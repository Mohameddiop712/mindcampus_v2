import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Lightbulb, Check, AlertTriangle, Sparkles } from 'lucide-react'

export default function Recommandations() {
  const [recs, setRecs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/recommandations').then(r => setRecs(r.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const marquerLue = async (id) => {
    try {
      await axios.put(`/api/recommandations/${id}/lue`)
      setRecs(recs.map(r => r._id === id ? { ...r, lue: true } : r))
    } catch { toast.error('Erreur') }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>

  const nonLues = recs.filter(r => !r.lue)
  const lues = recs.filter(r => r.lue)

  return (
    <div className="space-y-7 max-w-3xl">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-500" /> Recommandations
        </h1>
        <p className="text-gray-500 text-sm mt-1">{nonLues.length} nouvelle(s) recommandation(s) pour vous</p>
      </div>

      {recs.length === 0 && (
        <div className="card flex flex-col items-center justify-center py-20 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Aucune recommandation</h3>
          <p className="text-sm text-gray-500 max-w-xs">Enregistrez votre humeur pour recevoir des recommandations personnalisées selon votre état.</p>
        </div>
      )}

      {nonLues.length > 0 && (
        <div className="space-y-3 animate-fade-up stagger-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-gray-700">Nouvelles pour vous</h2>
            <span className="badge-yellow">{nonLues.length}</span>
          </div>
          {nonLues.map((rec, i) => <RecCard key={rec._id} rec={rec} onLue={() => marquerLue(rec._id)} delay={i} />)}
        </div>
      )}

      {lues.length > 0 && (
        <div className="space-y-3 animate-fade-up stagger-2">
          <h2 className="text-sm font-bold text-gray-400">Déjà lues</h2>
          {lues.map((rec, i) => <RecCard key={rec._id} rec={rec} read delay={i} />)}
        </div>
      )}
    </div>
  )
}

function RecCard({ rec, onLue, read, delay = 0 }) {
  return (
    <div className={`card transition-all animate-fade-up ${read ? 'opacity-50' : 'border-l-[3px] border-l-teal-500 hover:shadow-md'}`}
      style={{ animationDelay: `${delay * 0.06}s` }}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${rec.type === 'urgente' ? 'bg-red-100' : 'bg-teal-50'}`}>
          {rec.type === 'urgente' ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <Lightbulb className="w-5 h-5 text-teal-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-sm">{rec.titre}</h3>
            {rec.type === 'urgente' && <span className="badge-red">Urgent</span>}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{rec.contenu}</p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(rec.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        {!read && (
          <button onClick={onLue} title="Marquer comme lue"
            className="shrink-0 w-8 h-8 rounded-xl bg-teal-50 hover:bg-teal-100 flex items-center justify-center transition-all active:scale-90">
            <Check className="w-4 h-4 text-teal-600" />
          </button>
        )}
      </div>
    </div>
  )
}
