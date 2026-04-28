import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, ChevronRight, X, Clock, AlertCircle } from 'lucide-react'

const statut = { en_attente:{l:'En attente',c:'badge-yellow'}, acceptee:{l:'Acceptée',c:'badge-blue'}, en_cours:{l:'En cours',c:'badge-green'}, cloturee:{l:'Clôturée',c:'badge-gray'} }

export default function DemandesAide() {
  const [demandes, setDemandes] = useState([])
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ type:'pair', description:'', estUrgent:false })
  const [loading, setLoading] = useState(false)

  useEffect(() => { axios.get('/api/demandes/mes-demandes').then(r => setDemandes(r.data)).catch(console.error) }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.description.trim()) return toast.error('Décrivez votre situation')
    setLoading(true)
    try {
      const res = await axios.post('/api/demandes', form)
      setDemandes([res.data, ...demandes]); setShow(false); setForm({ type:'pair', description:'', estUrgent:false })
      toast.success('Demande envoyée ! 💜')
    } catch { toast.error('Erreur') } finally { setLoading(false) }
  }

  return (
    <div className="space-y-7 max-w-2xl">
      <div className="flex items-start justify-between fade-up">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Demandes d'aide</h1>
          <p className="text-gray-500 text-sm mt-1">Parlez à un pair-aidant ou un professionnel</p>
        </div>
        <button onClick={() => setShow(!show)} className={show ? 'btn-secondary' : 'btn-primary'}>
          {show ? <><X className="w-4 h-4"/> Annuler</> : <><Plus className="w-4 h-4"/> Nouvelle demande</>}
        </button>
      </div>

      {show && (
        <form onSubmit={submit} className="card fade-up space-y-5" style={{boxShadow:'0 4px 30px rgba(99,102,241,0.12)',borderTop:'3px solid #6366f1'}}>
          <h2 className="font-bold text-gray-900">Nouvelle demande d'aide</h2>
          <div>
            <label className="label">Type de soutien</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              {[{v:'pair',e:'🤝',l:'Pair-aidant',d:'Un étudiant formé qui vous comprend',grad:'linear-gradient(135deg,#6366f1,#8b5cf6)'},
                {v:'professionnel',e:'🩺',l:'Professionnel',d:'Psychologue ou médecin de santé',grad:'linear-gradient(135deg,#0d9488,#059669)'}].map(t => (
                <button key={t.v} type="button" onClick={() => setForm({...form,type:t.v})}
                  className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${form.type===t.v?'border-transparent text-white shadow-md scale-[1.02]':'border-gray-200 bg-white hover:border-gray-300'}`}
                  style={form.type===t.v?{background:t.grad}:{}}>
                  <span className="text-2xl">{t.e}</span>
                  <p className={`font-bold text-sm mt-1 ${form.type===t.v?'text-white':'text-gray-800'}`}>{t.l}</p>
                  <p className={`text-xs mt-0.5 ${form.type===t.v?'text-white/80':'text-gray-400'}`}>{t.d}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Décrivez votre situation</label>
            <textarea className="input resize-none mt-1" rows={4} placeholder="Comment pouvons-nous vous aider ? (Tout reste confidentiel)"
              value={form.description} onChange={e => setForm({...form,description:e.target.value})} required />
          </div>
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 transition-colors">
            <input type="checkbox" checked={form.estUrgent} onChange={e => setForm({...form,estUrgent:e.target.checked})} className="w-4 h-4 accent-red-500 rounded"/>
            <div><p className="text-sm font-bold text-red-700">⚠ C'est urgent</p><p className="text-xs text-red-500">Votre demande sera traitée en priorité</p></div>
          </label>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? <span className="spinner"/> : 'Envoyer ma demande →'}
          </button>
        </form>
      )}

      {demandes.length===0 && !show ? (
        <div className="card flex flex-col items-center py-16 text-center fade-up" style={{background:'linear-gradient(135deg,#f5f3ff,#ede9fe)',border:'1px solid #ddd6fe'}}>
          <div className="text-5xl mb-4">💬</div>
          <p className="font-bold text-gray-800">Aucune demande</p>
          <p className="text-sm text-gray-500 mt-1 mb-5">Vous n'êtes pas seul(e).</p>
          <button onClick={() => setShow(true)} className="btn-primary">Faire une demande</button>
        </div>
      ) : (
        <div className="space-y-3 fade-up d1">
          {demandes.map((d,i) => {
            const s = statut[d.statut]
            return (
              <Link key={d._id} to={`/chat/${d._id}`} className="card-hover flex items-center gap-4 fade-up" style={{animationDelay:`${i*0.05}s`}}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{background:d.type==='pair'?'linear-gradient(135deg,#ede9fe,#ddd6fe)':'linear-gradient(135deg,#d1fae5,#a7f3d0)'}}>
                  {d.type==='pair'?'🤝':'🩺'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={s.c}>{s.l}</span>
                    {d.estUrgent && <span className="badge-red flex items-center gap-1"><AlertCircle className="w-3 h-3"/>Urgent</span>}
                  </div>
                  <p className="text-sm text-gray-700 truncate font-medium">{d.description}</p>
                  <div className="flex items-center gap-1 mt-1"><Clock className="w-3 h-3 text-gray-300"/><p className="text-xs text-gray-400">{d.messages?.length||0} message(s) · {new Date(d.createdAt).toLocaleDateString('fr-FR')}</p></div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0"/>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
