import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MessageCircle, Plus, ChevronRight, AlertCircle, Clock, X } from 'lucide-react'

const statut = {
  en_attente: { label: 'En attente', cls: 'badge-yellow' },
  acceptee: { label: 'Acceptée', cls: 'badge-blue' },
  en_cours: { label: 'En cours', cls: 'badge-teal' },
  cloturee: { label: 'Clôturée', cls: 'badge-gray' },
}

export default function DemandesAide() {
  const [demandes, setDemandes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'pair', description: '', estUrgent: false })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get('/api/demandes/mes-demandes').then(r => setDemandes(r.data)).catch(console.error)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.description.trim()) return toast.error('Décrivez votre situation')
    setLoading(true)
    try {
      const res = await axios.post('/api/demandes', form)
      setDemandes([res.data, ...demandes])
      setShowForm(false); setForm({ type: 'pair', description: '', estUrgent: false })
      toast.success('Demande envoyée ! Un aidant va vous contacter.')
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-7 max-w-3xl">
      <div className="flex items-start justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-600" /> Demandes d'aide
          </h1>
          <p className="text-gray-500 text-sm mt-1">Parlez à un pair-aidant ou un professionnel de santé</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Annuler' : 'Nouvelle demande'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card shadow-lg border-2 border-teal-100 space-y-5 animate-fade-up">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-500" />
            <h2 className="font-bold text-gray-900">Nouvelle demande d'aide</h2>
          </div>

          <div>
            <label className="label">Je souhait parler à</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: 'pair', emoji: '🤝', label: 'Pair-aidant', desc: 'Un étudiant formé qui vous comprend' },
                { v: 'professionnel', emoji: '🩺', label: 'Professionnel', desc: 'Psychologue ou médecin de santé' }
              ].map(t => (
                <button key={t.v} type="button" onClick={() => setForm({ ...form, type: t.v })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${form.type === t.v ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                  <span className="text-2xl">{t.emoji}</span>
                  <p className="font-bold text-sm text-gray-800 mt-1">{t.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Décrivez votre situation</label>
            <textarea className="input resize-none" rows={4}
              placeholder="Comment pouvons-nous vous aider ? Toutes vos informations restent strictement confidentielles et anonymes."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 transition-colors">
            <input type="checkbox" checked={form.estUrgent} onChange={e => setForm({ ...form, estUrgent: e.target.checked })}
              className="w-4 h-4 accent-red-500 rounded" />
            <div>
              <span className="text-sm font-semibold text-red-700">⚠ C'est urgent</span>
              <p className="text-xs text-red-500">Votre demande sera traitée en priorité</p>
            </div>
          </label>

          <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full py-3"
            style={{ background: loading ? '#94a3b8' : 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
            {loading ? <span className="spinner" /> : 'Envoyer ma demande →'}
          </button>
        </div>
      )}

      {/* List */}
      {demandes.length === 0 && !showForm ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Aucune demande</h3>
          <p className="text-sm text-gray-500 max-w-xs mb-6">Vous n'êtes pas seul(e). N'hésitez pas à demander de l'aide.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Faire une demande</button>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-up stagger-1">
          {demandes.map((d, i) => {
            const s = statut[d.statut]
            return (
              <Link key={d._id} to={`/chat/${d._id}`}
                className="card-hover flex items-center gap-4 animate-fade-up"
                style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${d.type === 'pair' ? 'bg-blue-50' : 'bg-violet-50'}`}>
                  <span className="text-xl">{d.type === 'pair' ? '🤝' : '🩺'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`badge text-[11px] ${s.cls}`}>{s.label}</span>
                    {d.estUrgent && <span className="badge-red flex items-center gap-1"><AlertCircle className="w-3 h-3" />Urgent</span>}
                  </div>
                  <p className="text-sm text-gray-700 truncate font-medium">{d.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-400">{d.messages?.length || 0} message(s) · {new Date(d.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
