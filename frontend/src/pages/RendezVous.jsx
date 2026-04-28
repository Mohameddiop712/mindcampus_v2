import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { Plus, Clock, Calendar } from 'lucide-react'

const statut = {
  planifie:{l:'Planifié',c:'badge-blue'},
  confirme:{l:'Confirmé',c:'badge-green'},
  annule:{l:'Annulé',c:'badge-red'},
  termine:{l:'Terminé',c:'badge-gray'}
}

export default function RendezVous() {
  const { user } = useAuth()
  const [rvs, setRvs] = useState([])
  const [pros, setPros] = useState([])
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ professionnelId:'', dateHeure:'', type:'consultation', notes:'' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get('/api/rendezvous').then(r => setRvs(r.data)).catch(console.error)
    if (user?.role==='etudiant') axios.get('/api/rendezvous/professionnels').then(r => setPros(r.data)).catch(console.error)
  }, [user])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.professionnelId || !form.dateHeure) return toast.error('Remplissez tous les champs')
    setLoading(true)
    try {
      const res = await axios.post('/api/rendezvous', form)
      setRvs([res.data, ...rvs])
      setShow(false)
      setForm({ professionnelId:'', dateHeure:'', type:'consultation', notes:'' })
      toast.success('RDV planifié ! 📅')
    } catch { toast.error('Erreur') } finally { setLoading(false) }
  }

  const update = async (id, s) => {
    try {
      const res = await axios.put(`/api/rendezvous/${id}/statut`, {statut:s})
      setRvs(rvs.map(r => r._id===id ? res.data : r))
      toast.success('Mis à jour !')
    } catch { toast.error('Erreur') }
  }

  const upcoming = rvs.filter(r => new Date(r.dateHeure) >= new Date() && r.statut !== 'annule')
  const past = rvs.filter(r => new Date(r.dateHeure) < new Date() || r.statut === 'annule')

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-start justify-between fade-up">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-violet-500"/> Rendez-vous
          </h1>
          <p className="text-gray-400 text-sm mt-1">Gérez vos consultations</p>
        </div>
        {/* UN SEUL bouton pour l'étudiant */}
        {user?.role === 'etudiant' && (
          <button onClick={() => setShow(!show)} className="btn-primary">
            <Plus className="w-4 h-4"/> Nouveau RDV
          </button>
        )}
      </div>

      {/* Formulaire */}
      {show && (
        <form onSubmit={submit} className="bg-white rounded-3xl p-6 space-y-4 fade-up" style={{boxShadow:'0 4px 30px rgba(124,58,237,0.12)',borderTop:'3px solid #8b5cf6'}}>
          <h2 className="font-bold text-gray-900">Planifier un rendez-vous</h2>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Professionnel</p>
            <select className="input" value={form.professionnelId} onChange={e => setForm({...form,professionnelId:e.target.value})} required>
              <option value="">Choisir un professionnel</option>
              {pros.map(p => <option key={p._id} value={p._id}>{p.prenom} {p.nom} — {p.specialite||'Professionnel'}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Date & heure</p>
              <input className="input" type="datetime-local" value={form.dateHeure}
                min={new Date().toISOString().slice(0,16)}
                onChange={e => setForm({...form,dateHeure:e.target.value})} required />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Type</p>
              <select className="input" value={form.type} onChange={e => setForm({...form,type:e.target.value})}>
                <option value="consultation">Consultation</option>
                <option value="suivi">Suivi</option>
                <option value="urgence">Urgence</option>
              </select>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Notes <span className="font-normal normal-case text-gray-300">(optionnel)</span></p>
            <textarea className="input resize-none" rows={2} value={form.notes}
              onChange={e => setForm({...form,notes:e.target.value})} placeholder="Motif de la consultation..."/>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
              {loading ? <span className="spinner"/> : 'Confirmer le RDV'}
            </button>
            <button type="button" onClick={() => setShow(false)} className="btn-secondary px-5">Annuler</button>
          </div>
        </form>
      )}

      {/* Vide */}
      {rvs.length === 0 && !show && (
        <div className="rounded-3xl flex flex-col items-center py-16 text-center fade-up" style={{background:'linear-gradient(135deg,#fdf4ff,#fae8ff)',border:'1px solid #e9d5ff'}}>
          <div className="text-5xl mb-4">📅</div>
          <p className="font-bold text-gray-800 text-lg">Aucun rendez-vous</p>
          <p className="text-gray-500 text-sm mt-1 mb-5">Planifiez une consultation avec un professionnel</p>
          {user?.role==='etudiant' && (
            <button onClick={() => setShow(true)} className="btn-primary">
              <Plus className="w-4 h-4"/> Prendre un RDV
            </button>
          )}
        </div>
      )}

      {/* À venir */}
      {upcoming.length > 0 && (
        <div className="space-y-3 fade-up d1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">À venir</p>
          {upcoming.map((rv, i) => <RvCard key={rv._id} rv={rv} user={user} onUpdate={update} delay={i}/>)}
        </div>
      )}

      {/* Passés */}
      {past.length > 0 && (
        <div className="space-y-3 fade-up d2 opacity-60">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Passés</p>
          {past.map((rv, i) => <RvCard key={rv._id} rv={rv} user={user} onUpdate={update} delay={i} past/>)}
        </div>
      )}
    </div>
  )
}

function RvCard({ rv, user, onUpdate, past, delay=0 }) {
  const s = statut[rv.statut]
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-gray-100"
      style={{boxShadow:'0 2px 15px rgba(99,102,241,0.06)',animationDelay:`${delay*0.05}s`}}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
        style={{background:'linear-gradient(135deg,#fdf4ff,#fae8ff)'}}>
        {user?.role==='etudiant'?'🩺':'🎓'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <p className="font-bold text-gray-900 text-sm">
            {user?.role==='etudiant'
              ? `${rv.professionnel?.prenom} ${rv.professionnel?.nom}`
              : `${rv.etudiant?.prenom} ${rv.etudiant?.nom}`}
          </p>
          <span className={s.c}>{s.l}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-gray-300"/>
          <span className="text-xs text-gray-500">
            {new Date(rv.dateHeure).toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5 capitalize">{rv.type} · {rv.lieu}</p>
      </div>
      {!past && rv.statut==='planifie' && (
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          {user?.role!=='etudiant' && (
            <button onClick={() => onUpdate(rv._id,'confirme')} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors">Confirmer</button>
          )}
          <button onClick={() => onUpdate(rv._id,'annule')} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors">Annuler</button>
        </div>
      )}
    </div>
  )
}
