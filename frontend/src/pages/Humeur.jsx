import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Heart } from 'lucide-react'

const etats = [
  { value: 'tres_bien', emoji: '😄', label: 'Très bien', score: 5, gradient: 'from-emerald-400 to-teal-500', ring: 'ring-emerald-400', bg: 'bg-emerald-50' },
  { value: 'bien', emoji: '🙂', label: 'Bien', score: 4, gradient: 'from-teal-400 to-cyan-500', ring: 'ring-teal-400', bg: 'bg-teal-50' },
  { value: 'moyen', emoji: '😐', label: 'Moyen', score: 3, gradient: 'from-amber-400 to-yellow-500', ring: 'ring-amber-400', bg: 'bg-amber-50' },
  { value: 'mal', emoji: '😔', label: 'Mal', score: 2, gradient: 'from-orange-400 to-red-400', ring: 'ring-orange-400', bg: 'bg-orange-50' },
  { value: 'tres_mal', emoji: '😢', label: 'Très mal', score: 1, gradient: 'from-red-500 to-rose-600', ring: 'ring-red-400', bg: 'bg-red-50' },
]

const scoreLabels = ['', 'Très faible', 'Faible', 'Modéré', 'Élevé', 'Très élevé']

export default function Humeur() {
  const [selected, setSelected] = useState('')
  const [intensite, setIntensite] = useState(3)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [historique, setHistorique] = useState([])

  useEffect(() => {
    axios.get('/api/humeur').then(r => setHistorique(r.data)).catch(console.error)
  }, [])

  const handleSubmit = async () => {
    if (!selected) return toast.error('Sélectionnez votre humeur')
    setLoading(true)
    try {
      const res = await axios.post('/api/humeur', { etat: selected, intensite, note })
      toast.success('Humeur enregistrée !')
      setHistorique([res.data.humeur, ...historique])
      setSelected(''); setNote(''); setIntensite(3)
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur')
    } finally { setLoading(false) }
  }

  const selectedEtat = etats.find(e => e.value === selected)

  return (
    <div className="space-y-7 max-w-3xl">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Heart className="w-6 h-6 text-teal-600" /> Mon Humeur
        </h1>
        <p className="text-gray-500 text-sm mt-1">Prenez 30 secondes pour noter votre état du moment</p>
      </div>

      <div className="card shadow-sm animate-fade-up stagger-1 space-y-8">
        {/* Mood selector */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-4">Comment vous sentez-vous ?</p>
          <div className="grid grid-cols-5 gap-3">
            {etats.map(e => (
              <button key={e.value} type="button" onClick={() => setSelected(e.value)}
                className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                  selected === e.value
                    ? `border-transparent ring-2 ${e.ring} ring-offset-2 scale-105 shadow-lg ${e.bg}`
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm hover:-translate-y-0.5'
                }`}>
                {selected === e.value && (
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${e.gradient} opacity-10`} />
                )}
                <span className="text-3xl mb-1.5 relative z-10">{e.emoji}</span>
                <span className="text-xs font-medium text-gray-600 relative z-10">{e.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Intensité */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">Intensité</p>
            <span className="text-sm font-bold text-teal-600">{scoreLabels[intensite]}</span>
          </div>
          <div className="relative">
            <input type="range" min="1" max="5" value={intensite}
              onChange={e => setIntensite(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: '#0d9488', background: `linear-gradient(to right, #0d9488 ${(intensite-1)*25}%, #e2e8f0 ${(intensite-1)*25}%)` }} />
            <div className="flex justify-between mt-1.5">
              {[1,2,3,4,5].map(n => (
                <span key={n} className={`text-[10px] font-medium ${n === intensite ? 'text-teal-600' : 'text-gray-300'}`}>{n}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="label">Note personnelle <span className="text-gray-400 font-normal">(optionnel)</span></label>
          <textarea className="input resize-none" rows={3}
            placeholder="Qu'est-ce qui influence votre humeur aujourd'hui ? (Tout reste confidentiel)"
            value={note} onChange={e => setNote(e.target.value)} maxLength={500} />
          <p className="text-[11px] text-gray-400 mt-1 text-right">{note.length}/500</p>
        </div>

        {/* CTA */}
        <button onClick={handleSubmit} disabled={loading || !selected} className="btn-primary w-full py-3.5 text-base"
          style={{ background: !selected || loading ? '#94a3b8' : 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
          {loading ? <span className="spinner" /> : <><Heart className="w-5 h-5" /> Enregistrer mon humeur</>}
        </button>
      </div>

      {/* Historique */}
      {historique.length > 0 && (
        <div className="card animate-fade-up stagger-2">
          <h2 className="font-bold text-gray-900 mb-4 text-sm">Historique récent</h2>
          <div className="space-y-2.5">
            {historique.slice(0, 8).map((h, i) => {
              const etat = etats.find(e => e.value === h.etat)
              return (
                <div key={h._id} className={`flex items-center gap-3 p-3 rounded-xl transition-all animate-fade-up`}
                  style={{ background: '#f8fafc', animationDelay: `${i * 0.04}s` }}>
                  <span className="text-xl shrink-0">{etat?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{etat?.label}</span>
                      {h.estCritique && <span className="badge-red">⚠ Critique</span>}
                    </div>
                    {h.note && <p className="text-xs text-gray-500 truncate italic mt-0.5">"{h.note}"</p>}
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(h.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
