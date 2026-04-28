import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Check, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react'

export default function Recommandations() {
  const [recs, setRecs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { axios.get('/api/recommandations').then(r => setRecs(r.data)).catch(console.error).finally(() => setLoading(false)) }, [])

  const marquer = async (id) => {
    try { await axios.put(`/api/recommandations/${id}/lue`); setRecs(recs.map(r => r._id===id ? {...r,lue:true} : r)) }
    catch { toast.error('Erreur') }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" style={{borderWidth:'3px'}}/></div>

  const nonLues = recs.filter(r => !r.lue)
  const lues = recs.filter(r => r.lue)

  return (
    <div className="space-y-7 max-w-2xl">
      <div className="fade-up">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-500"/> Recommandations
        </h1>
        <p className="text-gray-500 text-sm mt-1">{nonLues.length} nouvelle(s) pour vous</p>
      </div>

      {recs.length===0 && (
        <div className="card flex flex-col items-center py-16 text-center fade-up" style={{background:'linear-gradient(135deg,#fffbeb,#fef3c7)',border:'1px solid #fde68a'}}>
          <Sparkles className="w-12 h-12 text-amber-400 mb-3"/>
          <p className="font-bold text-gray-800">Aucune recommandation</p>
          <p className="text-sm text-gray-500 mt-1">Enregistrez votre humeur pour en recevoir</p>
        </div>
      )}

      {nonLues.length > 0 && (
        <div className="space-y-3 fade-up d1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nouvelles</p>
          {nonLues.map((rec,i) => (
            <div key={rec._id} className="card flex items-start gap-4 fade-up" style={{animationDelay:`${i*0.05}s`,borderLeft:'3px solid #6366f1'}}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${rec.type==='urgente'?'bg-red-100':'bg-indigo-50'}`}>
                {rec.type==='urgente' ? <AlertTriangle className="w-5 h-5 text-red-500"/> : <Lightbulb className="w-5 h-5 text-indigo-500"/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">{rec.titre}</h3>
                  {rec.type==='urgente' && <span className="badge-red">Urgent</span>}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{rec.contenu}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(rec.createdAt).toLocaleDateString('fr-FR',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})}</p>
              </div>
              <button onClick={() => marquer(rec._id)} className="w-8 h-8 rounded-xl bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center transition-all active:scale-90 shrink-0">
                <Check className="w-4 h-4 text-indigo-600"/>
              </button>
            </div>
          ))}
        </div>
      )}

      {lues.length > 0 && (
        <div className="space-y-2 fade-up d2 opacity-50">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lues</p>
          {lues.map(rec => (
            <div key={rec._id} className="card flex items-center gap-3 py-3" style={{boxShadow:'none',border:'1px solid #f3f4f6'}}>
              <Lightbulb className="w-4 h-4 text-gray-300 shrink-0"/>
              <div><p className="text-sm font-medium text-gray-500">{rec.titre}</p><p className="text-xs text-gray-400 mt-0.5">{rec.contenu}</p></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
