import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Check, AlertTriangle, Lightbulb } from 'lucide-react'

export default function Recommandations() {
  const [recs, setRecs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/recommandations').then(r => setRecs(r.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const marquer = async (id) => {
    try {
      await axios.put(`/api/recommandations/${id}/lue`)
      setRecs(recs.map(r => r._id === id ? { ...r, lue: true } : r))
    } catch { toast.error('Erreur') }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-6 h-6 border-2 border-[#0f0f0f] border-t-transparent rounded-full animate-spin" /></div>

  const nonLues = recs.filter(r => !r.lue)
  const lues = recs.filter(r => r.lue)

  return (
    <div className="space-y-7 max-w-2xl">
      <div className="fade-up">
        <h1 className="text-3xl font-bold text-[#0f0f0f] tracking-tight">Recommandations</h1>
        <p className="text-[#999] text-sm mt-1">{nonLues.length} nouvelle(s) recommandation(s)</p>
      </div>

      {recs.length === 0 && (
        <div className="card flex flex-col items-center py-16 text-center fade-up">
          <span className="text-4xl mb-3">💡</span>
          <p className="font-medium text-[#0f0f0f]">Aucune recommandation</p>
          <p className="text-sm text-[#999] mt-1">Enregistrez votre humeur pour en recevoir</p>
        </div>
      )}

      {nonLues.length > 0 && (
        <div className="space-y-2 fade-up d1">
          <p className="text-xs font-semibold text-[#aaa] uppercase tracking-widest">Nouvelles</p>
          {nonLues.map((rec, i) => (
            <div key={rec._id} className="card flex items-start gap-4 fade-up border-l-2 border-l-[#0f0f0f]"
              style={{ animationDelay:`${i*0.05}s` }}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${rec.type === 'urgente' ? 'bg-[#fff0f0]' : 'bg-[#fafafa]'}`}>
                {rec.type === 'urgente' ? <AlertTriangle className="w-4 h-4 text-[#ff4444]" /> : <Lightbulb className="w-4 h-4 text-[#aaa]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-[#0f0f0f] text-sm">{rec.titre}</h3>
                  {rec.type === 'urgente' && <span className="badge-red">Urgent</span>}
                </div>
                <p className="text-sm text-[#666] leading-relaxed">{rec.contenu}</p>
                <p className="text-xs text-[#bbb] mt-2">
                  {new Date(rec.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' })}
                </p>
              </div>
              <button onClick={() => marquer(rec._id)} title="Marquer comme lue"
                className="w-7 h-7 rounded-lg bg-[#fafafa] hover:bg-[#f0f0f0] flex items-center justify-center transition-all shrink-0 active:scale-90">
                <Check className="w-3.5 h-3.5 text-[#666]" />
              </button>
            </div>
          ))}
        </div>
      )}

      {lues.length > 0 && (
        <div className="space-y-2 fade-up d2 opacity-50">
          <p className="text-xs font-semibold text-[#aaa] uppercase tracking-widest">Lues</p>
          {lues.map(rec => (
            <div key={rec._id} className="card-inset flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#f0f0f0] flex items-center justify-center shrink-0">
                <Lightbulb className="w-3.5 h-3.5 text-[#bbb]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#666]">{rec.titre}</p>
                <p className="text-xs text-[#999] mt-0.5">{rec.contenu}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
