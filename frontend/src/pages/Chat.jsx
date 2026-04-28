import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { Send, ArrowLeft, Lock, CheckCheck } from 'lucide-react'

const statutBadge = { en_attente:'badge-yellow', acceptee:'badge-blue', en_cours:'badge-teal', cloturee:'badge-gray' }
const statutLabel = { en_attente:'En attente', acceptee:'Acceptée', en_cours:'En cours', cloturee:'Clôturée' }

export default function Chat() {
  const { demandeId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [demande, setDemande] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    axios.get(`/api/demandes/${demandeId}`).then(r => setDemande(r.data)).catch(console.error).finally(() => setLoading(false))
  }, [demandeId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [demande?.messages])

  const envoyer = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    try {
      const res = await axios.post(`/api/demandes/${demandeId}/message`, { contenu: message })
      setDemande(res.data); setMessage('')
    } catch { toast.error('Erreur envoi') } finally { setSending(false) }
  }

  const cloturer = async () => {
    try {
      await axios.put(`/api/demandes/${demandeId}/cloturer`)
      setDemande(prev => ({ ...prev, statut: 'cloturee' }))
      toast.success('Session clôturée')
    } catch { toast.error('Erreur') }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!demande) return <div className="card text-center py-12 text-gray-500">Demande introuvable</div>

  const canMessage = demande.statut !== 'cloturee'
  const isEtudiant = user?._id === demande.etudiant?._id || user?.id === demande.etudiant?._id

  return (
    <div className="max-w-3xl flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="card mb-4 flex items-center gap-3 py-4 animate-fade-up">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all active:scale-90">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div className="text-2xl">{demande.type === 'pair' ? '🤝' : '🩺'}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-gray-900 text-sm">
              {demande.type === 'pair' ? 'Session pair-aidance' : 'Consultation professionnelle'}
            </h1>
            <span className={`badge text-[10px] ${statutBadge[demande.statut]}`}>{statutLabel[demande.statut]}</span>
          </div>
          {demande.assigneA && (
            <p className="text-xs text-gray-500">{demande.assigneA.prenom} {demande.assigneA.nom}{demande.assigneA.specialite && ` · ${demande.assigneA.specialite}`}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700">Anonyme</span>
        </div>
        {canMessage && !isEtudiant && (
          <button onClick={cloturer} className="btn-danger btn-sm">Clôturer</button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 card overflow-y-auto mb-4 space-y-3 animate-fade-up stagger-1">
        {demande.statut === 'en_attente' && (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 flex items-center justify-center mb-4 animate-pulse">
              <span className="text-3xl">⏳</span>
            </div>
            <p className="font-bold text-gray-700">Demande en attente</p>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">Un {demande.type === 'pair' ? 'pair-aidant' : 'professionnel'} va prendre en charge votre demande prochainement.</p>
          </div>
        )}

        {demande.messages?.map((msg, i) => {
          const isMe = msg.expediteur?._id === user?._id || msg.expediteur?._id === user?.id
          return (
            <div key={i} className={`flex animate-fade-up ${isMe ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${i * 0.03}s` }}>
              {!isMe && (
                <div className="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold text-white mr-2 shrink-0 self-end">
                  {msg.expediteur?.prenom?.[0] || '?'}
                </div>
              )}
              <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                style={{ background: isMe ? 'linear-gradient(135deg,#0d9488,#0891b2)' : '#f8fafc', border: isMe ? 'none' : '1px solid #f1f5f9' }}>
                {!isMe && <p className="text-[10px] font-bold text-teal-600 mb-1">{msg.expediteur?.prenom || 'Aidant'}</p>}
                <p className={`text-sm leading-relaxed ${isMe ? 'text-white' : 'text-gray-800'}`}>{msg.contenu}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                  <span className="text-[10px]">{new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMe && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {canMessage ? (
        <form onSubmit={envoyer} className="card flex items-center gap-3 py-3 animate-fade-up stagger-2">
          <input className="input flex-1 border-0 bg-gray-50 focus:ring-0 focus:border-0"
            placeholder="Votre message..."
            value={message} onChange={e => setMessage(e.target.value)} disabled={sending} />
          <button type="submit" disabled={sending || !message.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
            {sending ? <span className="spinner w-4 h-4" /> : <Send className="w-4 h-4 text-white" />}
          </button>
        </form>
      ) : (
        <div className="card text-center text-gray-500 text-sm py-4">🔒 Cette session est clôturée</div>
      )}
    </div>
  )
}
