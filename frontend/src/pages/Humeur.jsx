import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Heart, ArrowRight } from 'lucide-react'

const etats = [
  { value:'tres_bien', emoji:'😄', label:'Très bien', score:5, grad:'from-emerald-400 to-teal-500', ring:'ring-emerald-400', bg:'bg-emerald-50' },
  { value:'bien',      emoji:'🙂', label:'Bien',       score:4, grad:'from-teal-400 to-cyan-500',    ring:'ring-teal-400',    bg:'bg-teal-50'    },
  { value:'moyen',     emoji:'😐', label:'Moyen',      score:3, grad:'from-amber-400 to-yellow-500', ring:'ring-amber-400',   bg:'bg-amber-50'   },
  { value:'mal',       emoji:'😔', label:'Mal',         score:2, grad:'from-orange-400 to-red-400',   ring:'ring-orange-400',  bg:'bg-orange-50'  },
  { value:'tres_mal',  emoji:'😢', label:'Très mal',    score:1, grad:'from-red-500 to-rose-600',     ring:'ring-red-400',     bg:'bg-red-50'     },
]
const scores = ['','Très faible','Faible','Modéré','Élevé','Très élevé']

export default function Humeur() {
  const [sel, setSel] = useState('')
  const [intensite, setIntensite] = useState(3)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [historique, setHistorique] = useState([])

  useEffect(() => { axios.get('/api/humeur').then(r => setHistorique(r.data)).catch(console.error) }, [])

  const submit = async () => {
    if (!sel) return toast.error('Sélectionnez votre humeur')
    setLoading(true)
    try {
      const res = await axios.post('/api/humeur', { etat:sel, intensite, note })
      toast.success('Humeur enregistrée ! 💚')
      setHistorique([res.data.humeur, ...historique])
      setSel(''); setNote(''); setIntensite(3)
    } catch { toast.error('Erreur') } finally { setLoading(false) }
  }

  return (
    <div className="space-y-7 max-w-2xl">
      <div className="fade-up">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Heart className="w-6 h-6 text-pink-500" /> Mon Humeur
        </h1>
        <p className="text-gray-500 text-sm mt-1">Prenez un moment pour noter votre état du jour</p>
      </div>

      <div className="card fade-up d1 space-y-7" style={{boxShadow:'0 4px 30px rgba(99,102,241,0.10)'}}>
        <div>
          <p className="label">Comment vous sentez-vous ?</p>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {etats.map(e => (
              <button key={e.value} onClick={() => setSel(e.value)}
                className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl border-2 transition-all duration-200 ${
                  sel===e.value
                    ? `${e.bg} border-transparent ring-2 ${e.ring} ring-offset-2 scale-105 shadow-md`
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm hover:-translate-y-0.5'
                }`}>
                <span className="text-3xl">{e.emoji}</span>
                <span className={`text-[11px] font-semibold ${sel===e.value?'text-gray-700':'text-gray-400'}`}>{e.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="label">Intensité</p>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{scores[intensite]}</span>
          </div>
          <input type="range" min="1" max="5" value={intensite}
            onChange={e => setIntensite(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{accentColor:'#6366f1',background:`linear-gradient(to right,#6366f1 ${(intensite-1)*25}%,#e0e7ff ${(intensite-1)*25}%)`}} />
          <div className="flex justify-between mt-1.5">
            {[1,2,3,4,5].map(n => <span key={n} className={`text-[10px] font-semibold ${n===intensite?'text-indigo-600':'text-gray-300'}`}>{n}</span>)}
          </div>
        </div>

        <div>
          <label className="label">Note personnelle <span className="text-gray-300 font-normal normal-case">(optionnel)</span></label>
          <textarea className="input resize-none mt-1" rows={3}
            placeholder="Qu'est-ce qui influence votre humeur aujourd'hui ?"
            value={note} onChange={e => setNote(e.target.value)} maxLength={500} />
          <p className="text-[10px] text-gray-400 text-right mt-1">{note.length}/500</p>
        </div>

        <button onClick={submit} disabled={loading||!sel} className="btn-primary w-full py-3">
          {loading ? <span className="spinner"/> : <><Heart className="w-4 h-4"/> Enregistrer mon humeur <ArrowRight className="w-4 h-4"/></>}
        </button>
      </div>

      {historique.length > 0 && (
        <div className="fade-up d2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Historique récent</p>
          <div className="space-y-2">
            {historique.slice(0,8).map((h,i) => {
              const e = etats.find(x => x.value===h.etat)
              return (
                <div key={h._id} className="card flex items-center gap-3 py-3 fade-up" style={{animationDelay:`${i*0.03}s`,boxShadow:'none',border:'1px solid #f3f4f6'}}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${e?.grad} shadow-sm`}>{e?.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{e?.label}</span>
                      {h.estCritique && <span className="badge-red">⚠ Critique</span>}
                    </div>
                    {h.note && <p className="text-xs text-gray-400 truncate italic mt-0.5">"{h.note}"</p>}
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(h.createdAt).toLocaleDateString('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
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
