import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { Plus, Clock, X } from 'lucide-react'

const statut = { planifie:{l:'Planifié',c:'badge-blue'}, confirme:{l:'Confirmé',c:'badge-green'}, annule:{l:'Annulé',c:'badge-red'}, termine:{l:'Terminé',c:'badge-gray'} }

export default function RendezVous() {
  const { user } = useAuth()
  const [rvs, setRvs] = useState([])
  const [pros, setPros] = useState([])
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ professionnelId:'', dateHeure:'', type:'consultation', notes:'' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get('/api/rendezvous').then(r => setRvs(r.data)).catch(console.error)
    if (user?.role === 'etudiant') axios.get('/api/rendezvous/professionnels').then(r => setPros(r.data)).catch(console.error)
  }, [user])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.professionnelId || !form.dateHeure) return toast.error('Remplissez tous les champs')
    setLoading(true)
    try {
      const res = await axios.post('/api/rendezvous', form)
      setRvs([res.data, ...rvs]); setShow(false); setForm({ professionnelId:'', dateHeure:'', type:'consultation', notes:'' })
      toast.success('RDV planifié !')
    } catch { toast.error('Erreur') } finally { setLoading(false) }
  }

  const update = async (id, s) => {
    try { const res = await axios.put(`/api/rendezvous/${id}/statut`, { statut:s }); setRvs(rvs.map(r => r._id === id ? res.data : r)); toast.success('Mis à jour') }
    catch { toast.error('Erreur') }
  }

  const upcoming = rvs.filter(r => new Date(r.dateHeure) >= new Date() && r.statut !== 'annule')
  const past = rvs.filter(r => new Date(r.dateHeure) < new Date() || r.statut === 'annule')

  return (
    <div className="space-y-7 max-w-2xl">
      <div className="flex items-start justify-between fade-up">
        <div>
          <h1 className="text-3xl font-bold text-[#0f0f0f] tracking-tight">Rendez-vous</h1>
          <p className="text-[#999] text-sm mt-1">Gérez vos consultations</p>
        </div>
        {user?.role === 'etudiant' && (
          <button onClick={() => setShow(!show)} className={show ? 'btn-secondary' : 'btn-primary'}>
            {show ? <><X className="w-4 h-4" /> Annuler</> : <><Plus className="w-4 h-4" /> Nouveau RDV</>}
          </button>
        )}
      </div>

      {show && (
        <form onSubmit={submit} className="card space-y-4 fade-up">
          <h2 className="font-semibold text-[#0f0f0f] text-sm">Planifier un rendez-vous</h2>
          <div>
            <label className="label">Professionnel</label>
            <select className="input mt-1" value={form.professionnelId} onChange={e => setForm({ ...form, professionnelId:e.target.value })} required>
              <option value="">Choisir un professionnel</option>
              {pros.map(p => <option key={p._id} value={p._id}>{p.prenom} {p.nom} — {p.specialite || 'Professionnel'}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Date & heure</label>
              <input className="input mt-1" type="datetime-local" value={form.dateHeure} min={new Date().toISOString().slice(0,16)} onChange={e => setForm({ ...form, dateHeure:e.target.value })} required />
            </div>
            <div>
              <label className="label">Type</label>
              <select className="input mt-1" value={form.type} onChange={e => setForm({ ...form, type:e.target.value })}>
                <option value="consultation">Consultation</option>
                <option value="suivi">Suivi</option>
                <option value="urgence">Urgence</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Notes <span className="text-[#ccc] font-normal normal-case">(optionnel)</span></label>
            <textarea className="input resize-none mt-1" rows={2} placeholder="Motif..." value={form.notes} onChange={e => setForm({ ...form, notes:e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
            {loading ? <span className="spinner" /> : 'Confirmer le rendez-vous'}
          </button>
        </form>
      )}

      {rvs.length === 0 && !show && (
        <div className="card flex flex-col items-center py-16 text-center fade-up">
          <span className="text-4xl mb-3">📅</span>
          <p className="font-medium text-[#0f0f0f]">Aucun rendez-vous</p>
          <p className="text-sm text-[#999] mt-1 mb-4">Planifiez une consultation avec un professionnel</p>
          {user?.role === 'etudiant' && <button onClick={() => setShow(true)} className="btn-primary">Prendre un RDV</button>}
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-2 fade-up d1">
          <p className="text-xs font-semibold text-[#aaa] uppercase tracking-widest">À venir</p>
          {upcoming.map((rv, i) => <RvCard key={rv._id} rv={rv} user={user} onUpdate={update} delay={i} />)}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-2 fade-up d2 opacity-50">
          <p className="text-xs font-semibold text-[#aaa] uppercase tracking-widest">Passés</p>
          {past.map((rv, i) => <RvCard key={rv._id} rv={rv} user={user} onUpdate={update} delay={i} past />)}
        </div>
      )}
    </div>
  )
}

function RvCard({ rv, user, onUpdate, past, delay=0 }) {
  const s = statut[rv.statut]
  return (
    <div className="card flex items-center gap-4 fade-up" style={{ animationDelay:`${delay*0.05}s` }}>
      <div className="w-10 h-10 rounded-xl bg-[#fafafa] border border-[#f0f0f0] flex items-center justify-center text-xl shrink-0">
        {user?.role === 'etudiant' ? '🩺' : '🎓'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-semibold text-[#0f0f0f] text-sm">
            {user?.role === 'etudiant' ? `${rv.professionnel?.prenom} ${rv.professionnel?.nom}` : `${rv.etudiant?.prenom} ${rv.etudiant?.nom}`}
          </p>
          <span className={s.c}>{s.l}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#bbb]" />
          <span className="text-xs text-[#999]">
            {new Date(rv.dateHeure).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' })}
          </span>
        </div>
        <p className="text-xs text-[#bbb] mt-0.5 capitalize">{rv.type} · {rv.lieu}</p>
      </div>
      {!past && rv.statut === 'planifie' && (
        <div className="flex gap-2 shrink-0">
          {user?.role !== 'etudiant' && (
            <button onClick={() => onUpdate(rv._id, 'confirme')} className="btn-sm bg-[#f0faf0] text-[#1a7a1a] hover:bg-[#e0f5e0] rounded-md font-medium">Confirmer</button>
          )}
          <button onClick={() => onUpdate(rv._id, 'annule')} className="btn-sm bg-[#fff0f0] text-[#7a1a1a] hover:bg-[#ffe0e0] rounded-md font-medium">Annuler</button>
        </div>
      )}
    </div>
  )
}
