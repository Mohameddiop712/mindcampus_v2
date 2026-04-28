import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { Calendar, Plus, Clock, User, X } from 'lucide-react'

const statut = {
  planifie:  { label:'Planifié', cls:'badge-blue' },
  confirme:  { label:'Confirmé', cls:'badge-green' },
  annule:    { label:'Annulé', cls:'badge-red' },
  termine:   { label:'Terminé', cls:'badge-gray' },
}
const typeLabel = { consultation:'Consultation initiale', suivi:'Suivi régulier', urgence:'Urgence' }

export default function RendezVous() {
  const { user } = useAuth()
  const [rvs, setRvs] = useState([])
  const [pros, setPros] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ professionnelId:'', dateHeure:'', type:'consultation', notes:'' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get('/api/rendezvous').then(r => setRvs(r.data)).catch(console.error)
    if (user?.role === 'etudiant') axios.get('/api/rendezvous/professionnels').then(r => setPros(r.data)).catch(console.error)
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.professionnelId || !form.dateHeure) return toast.error('Remplissez tous les champs')
    setLoading(true)
    try {
      const res = await axios.post('/api/rendezvous', form)
      setRvs([res.data, ...rvs]); setShowForm(false); setForm({ professionnelId:'', dateHeure:'', type:'consultation', notes:'' })
      toast.success('Rendez-vous planifié !')
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur')
    } finally { setLoading(false) }
  }

  const updateStatut = async (id, s) => {
    try {
      const res = await axios.put(`/api/rendezvous/${id}/statut`, { statut: s })
      setRvs(rvs.map(r => r._id === id ? res.data : r))
      toast.success('Mis à jour !')
    } catch { toast.error('Erreur') }
  }

  const upcoming = rvs.filter(r => new Date(r.dateHeure) >= new Date() && r.statut !== 'annule')
  const past = rvs.filter(r => new Date(r.dateHeure) < new Date() || r.statut === 'annule')

  return (
    <div className="space-y-7 max-w-3xl">
      <div className="flex items-start justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-violet-600" /> Rendez-vous
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gérez vos consultations avec les professionnels de santé</p>
        </div>
        {user?.role === 'etudiant' && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Annuler' : 'Nouveau RDV'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card border-2 border-violet-100 shadow-lg space-y-5 animate-fade-up">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <h2 className="font-bold text-gray-900">Prendre un rendez-vous</h2>
          </div>

          <div>
            <label className="label">Choisissez un professionnel</label>
            <select className="input" value={form.professionnelId} onChange={e => setForm({ ...form, professionnelId: e.target.value })} required>
              <option value="">-- Sélectionner --</option>
              {pros.map(p => (
                <option key={p._id} value={p._id}>{p.prenom} {p.nom} — {p.specialite || 'Professionnel de santé'}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date & heure</label>
              <input className="input" type="datetime-local" value={form.dateHeure} min={new Date().toISOString().slice(0,16)}
                onChange={e => setForm({ ...form, dateHeure: e.target.value })} required />
            </div>
            <div>
              <label className="label">Type de consultation</label>
              <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="consultation">Consultation initiale</option>
                <option value="suivi">Suivi régulier</option>
                <option value="urgence">Urgence</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Notes <span className="text-gray-400 font-normal">(optionnel)</span></label>
            <textarea className="input resize-none" rows={2} placeholder="Motif de la consultation..."
              value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3"
            style={{ background: loading ? '#94a3b8' : 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
            {loading ? <span className="spinner" /> : 'Confirmer le rendez-vous →'}
          </button>
        </form>
      )}

      {rvs.length === 0 && !showForm && (
        <div className="card flex flex-col items-center justify-center py-20 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-3xl bg-violet-50 flex items-center justify-center mb-4"><span className="text-3xl">📅</span></div>
          <h3 className="font-bold text-gray-800 mb-2">Aucun rendez-vous</h3>
          <p className="text-sm text-gray-500 max-w-xs mb-6">Prenez rendez-vous avec un professionnel de santé pour un accompagnement personnalisé.</p>
          {user?.role === 'etudiant' && <button onClick={() => setShowForm(true)} className="btn-primary">Prendre un RDV</button>}
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-3 animate-fade-up stagger-1">
          <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><Clock className="w-4 h-4 text-violet-500" />À venir</h2>
          {upcoming.map((rv, i) => <RvCard key={rv._id} rv={rv} user={user} onUpdate={updateStatut} delay={i} />)}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-3 animate-fade-up stagger-2 opacity-70">
          <h2 className="text-sm font-bold text-gray-400">Passés</h2>
          {past.map((rv, i) => <RvCard key={rv._id} rv={rv} user={user} onUpdate={updateStatut} delay={i} past />)}
        </div>
      )}
    </div>
  )
}

function RvCard({ rv, user, onUpdate, past, delay = 0 }) {
  const s = statut[rv.statut]
  return (
    <div className={`card transition-all animate-fade-up ${!past ? 'hover:shadow-md' : ''}`} style={{ animationDelay: `${delay*0.05}s` }}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center shrink-0 text-2xl">
          {user?.role === 'etudiant' ? '🩺' : '🎓'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-gray-900 text-sm">
              {user?.role === 'etudiant' ? `${rv.professionnel?.prenom} ${rv.professionnel?.nom}` : `${rv.etudiant?.prenom} ${rv.etudiant?.nom}`}
            </p>
            <span className={`badge text-[10px] ${s.cls}`}>{s.label}</span>
          </div>
          {rv.professionnel?.specialite && <p className="text-xs text-gray-500">{rv.professionnel.specialite}</p>}
          <div className="flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              {new Date(rv.dateHeure).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' })}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">{typeLabel[rv.type]} · {rv.lieu}</p>
        </div>
        {!past && rv.statut === 'planifie' && (
          <div className="flex gap-2">
            {user?.role !== 'etudiant' && (
              <button onClick={() => onUpdate(rv._id, 'confirme')} className="btn-sm bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg font-semibold">Confirmer</button>
            )}
            <button onClick={() => onUpdate(rv._id, 'annule')} className="btn-sm bg-red-100 text-red-600 hover:bg-red-200 rounded-lg font-semibold">Annuler</button>
          </div>
        )}
      </div>
    </div>
  )
}
