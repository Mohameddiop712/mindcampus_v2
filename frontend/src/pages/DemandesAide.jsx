import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, ChevronRight, X, Clock } from 'lucide-react'

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
      setDemandes([res.data, ...demandes]); setShow(false)
      setForm({ type:'pair', description:'', estUrgent:false })
      toast.success('Demande envoyée !')
    } catch (err) { toast.error('Erreur') } finally { setLoading(false) }
  }

  return (
    <div className="space-y-7 max-w-2xl">
      <div className="flex items-start justify-between fade-up">
        <div>
          <h1 className="text-3xl font-bold text-[#0f0f0f] tracking-tight">Demandes d'aide</h1>
          <p className="text-[#999] text-sm mt-1">Parlez à un pair-aidant ou un professionnel</p>
        </div>
        <button onClick={() => setShow(!show)} className={show ? 'btn-secondary' : 'btn-primary'}>
          {show ? <><X className="w-4 h-4" /> Annuler</> : <><Plus className="w-4 h-4" /> Nouvelle demande</>}
        </button>
      </div>

      {show && (
        <form onSubmit={submit} className="card space-y-5 fade-up">
          <h2 className="font-semibold text-[#0f0f0f] text-sm">Nouvelle demande</h2>
          <div>
            <label className="label">Type de soutien</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {[{ v:'pair', e:'🤝', l:'Pair-aidant', d:'Un étudiant formé' }, { v:'professionnel', e:'🩺', l:'Professionnel', d:'Psychologue ou médecin' }].map(t => (
                <button key={t.v} type="button" onClick={() => setForm({ ...form, type:t.v })}
                  className={`p-3 rounded-lg border text-left transition-all ${form.type === t.v ? 'border-[#0f0f0f] bg-[#0f0f0f]' : 'border-[#e8e8e8] hover:border-[#ccc]'}`}>
                  <span className="text-lg">{t.e}</span>
                  <p className={`text-xs font-semibold mt-1 ${form.type === t.v ? 'text-white' : 'text-[#0f0f0f]'}`}>{t.l}</p>
                  <p className={`text-[11px] mt-0.5 ${form.type === t.v ? 'text-[#aaa]' : 'text-[#999]'}`}>{t.d}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Décrivez votre situation</label>
            <textarea className="input resize-none mt-1" rows={4}
              placeholder="Comment pouvons-nous vous aider ? (Tout reste confidentiel)"
              value={form.description} onChange={e => setForm({ ...form, description:e.target.value })} required />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-9 h-5 rounded-full transition-colors relative ${form.estUrgent ? 'bg-[#ff4444]' : 'bg-[#e8e8e8]'}`}
              onClick={() => setForm({ ...form, estUrgent:!form.estUrgent })}>
              <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${form.estUrgent ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm font-medium text-[#0f0f0f]">C'est urgent</span>
          </label>
          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
            {loading ? <span className="spinner" /> : 'Envoyer la demande'}
          </button>
        </form>
      )}

      {demandes.length === 0 && !show ? (
        <div className="card flex flex-col items-center py-16 text-center fade-up">
          <span className="text-4xl mb-3">💬</span>
          <p className="font-medium text-[#0f0f0f]">Aucune demande</p>
          <p className="text-sm text-[#999] mt-1 mb-4">Vous n'êtes pas seul(e).</p>
          <button onClick={() => setShow(true)} className="btn-primary">Faire une demande</button>
        </div>
      ) : (
        <div className="space-y-2 fade-up d1">
          {demandes.map((d, i) => {
            const s = statut[d.statut]
            return (
              <Link key={d._id} to={`/chat/${d._id}`}
                className="card-hover flex items-center gap-4 fade-up"
                style={{ animationDelay:`${i*0.05}s` }}>
                <span className="text-xl shrink-0">{d.type === 'pair' ? '🤝' : '🩺'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={s.c}>{s.l}</span>
                    {d.estUrgent && <span className="badge-red">Urgent</span>}
                  </div>
                  <p className="text-sm text-[#444] truncate">{d.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-[#bbb]" />
                    <p className="text-xs text-[#bbb]">{d.messages?.length || 0} message(s) · {new Date(d.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#ccc] shrink-0" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
