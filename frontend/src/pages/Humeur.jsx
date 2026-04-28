import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ArrowRight } from 'lucide-react'

const etats = [
  { value:'tres_bien', emoji:'😄', label:'Très bien', score:5 },
  { value:'bien',      emoji:'🙂', label:'Bien',      score:4 },
  { value:'moyen',     emoji:'😐', label:'Moyen',     score:3 },
  { value:'mal',       emoji:'😔', label:'Mal',        score:2 },
  { value:'tres_mal',  emoji:'😢', label:'Très mal',   score:1 },
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
      toast.success('Humeur enregistrée !')
      setHistorique([res.data.humeur, ...historique])
      setSel(''); setNote(''); setIntensite(3)
    } catch (err) { toast.error('Erreur') } finally { setLoading(false) }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="fade-up">
        <h1 className="text-3xl font-bold text-[#0f0f0f] tracking-tight">Mon Humeur</h1>
        <p className="text-[#999] text-sm mt-1">Prenez un moment pour noter votre état du jour</p>
      </div>

      <div className="card space-y-7 fade-up d1">
        {/* Emoji */}
        <div>
          <p className="label">Comment vous sentez-vous ?</p>
          <div className="flex gap-2 mt-2">
            {etats.map(e => (
              <button key={e.value} onClick={() => setSel(e.value)}
                className={`flex-1 flex flex-col items-center gap-1 py-4 rounded-lg border transition-all duration-150 ${
                  sel === e.value
                    ? 'border-[#0f0f0f] bg-[#0f0f0f]'
                    : 'border-[#f0f0f0] bg-white hover:border-[#e0e0e0] hover:bg-[#fafafa]'
                }`}>
                <span className="text-2xl">{e.emoji}</span>
                <span className={`text-[11px] font-medium ${sel === e.value ? 'text-white' : 'text-[#666]'}`}>{e.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Intensité */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="label">Intensité</p>
            <span className="text-xs font-medium text-[#0f0f0f]">{scores[intensite]}</span>
          </div>
          <input type="range" min="1" max="5" value={intensite}
            onChange={e => setIntensite(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-[#e8e8e8]"
            style={{ accentColor: '#0f0f0f' }} />
          <div className="flex justify-between mt-1">
            {[1,2,3,4,5].map(n => (
              <span key={n} className={`text-[10px] ${n === intensite ? 'text-[#0f0f0f] font-semibold' : 'text-[#ccc]'}`}>{n}</span>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="label">Note personnelle <span className="text-[#ccc] font-normal normal-case tracking-normal">(optionnel)</span></label>
          <textarea className="input resize-none mt-1" rows={3}
            placeholder="Qu'est-ce qui influence votre humeur aujourd'hui ?"
            value={note} onChange={e => setNote(e.target.value)} maxLength={500} />
          <p className="text-[10px] text-[#ccc] mt-1 text-right">{note.length}/500</p>
        </div>

        <button onClick={submit} disabled={loading || !sel} className="btn-primary w-full py-3">
          {loading ? <span className="spinner" /> : <>Enregistrer <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>

      {/* Historique */}
      {historique.length > 0 && (
        <div className="fade-up d2">
          <p className="text-xs font-semibold text-[#aaa] uppercase tracking-widest mb-3">Historique</p>
          <div className="space-y-2">
            {historique.slice(0,10).map((h, i) => {
              const e = etats.find(x => x.value === h.etat)
              return (
                <div key={h._id} className="card-inset flex items-center gap-3 fade-up" style={{ animationDelay:`${i*0.03}s` }}>
                  <span className="text-xl shrink-0">{e?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#0f0f0f]">{e?.label}</span>
                      {h.estCritique && <span className="badge-red">Critique</span>}
                    </div>
                    {h.note && <p className="text-xs text-[#999] truncate italic mt-0.5">"{h.note}"</p>}
                  </div>
                  <span className="text-xs text-[#bbb] shrink-0">
                    {new Date(h.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
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
