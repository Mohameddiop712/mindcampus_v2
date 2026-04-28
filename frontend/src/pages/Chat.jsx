import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { Send, ArrowLeft, Lock } from 'lucide-react'

export default function Chat() {
  const { demandeId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [demande, setDemande] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { axios.get(`/api/demandes/${demandeId}`).then(r => setDemande(r.data)).catch(console.error).finally(() => setLoading(false)) }, [demandeId])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [demande?.messages])

  const envoyer = async (e) => {
    e.preventDefault(); if (!message.trim()) return
    setSending(true)
    try { const res = await axios.post(`/api/demandes/${demandeId}/message`, { contenu:message }); setDemande(res.data); setMessage('') }
    catch { toast.error('Erreur') } finally { setSending(false) }
  }
  const cloturer = async () => {
    try { await axios.put(`/api/demandes/${demandeId}/cloturer`); setDemande(p => ({ ...p, statut:'cloturee' })); toast.success('Clôturé') }
    catch { toast.error('Erreur') }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-6 h-6 border-2 border-[#0f0f0f] border-t-transparent rounded-full animate-spin" /></div>
  if (!demande) return <div className="card text-center py-12 text-[#999]">Introuvable</div>

  const canMsg = demande.statut !== 'cloturee'
  const isEt = user?._id === demande.etudiant?._id || user?.id === demande.etudiant?._id

  return (
    <div className="max-w-2xl flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="card mb-3 flex items-center gap-3 py-3 fade-up">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-lg bg-[#fafafa] hover:bg-[#f0f0f0] flex items-center justify-center transition-all">
          <ArrowLeft className="w-4 h-4 text-[#666]" />
        </button>
        <span className="text-xl">{demande.type === 'pair' ? '🤝' : '🩺'}</span>
        <div className="flex-1">
          <p className="font-semibold text-[#0f0f0f] text-sm">{demande.type === 'pair' ? 'Session pair-aidance' : 'Consultation'}</p>
          {demande.assigneA && <p className="text-xs text-[#999]">{demande.assigneA.prenom} {demande.assigneA.nom}</p>}
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#fafafa] border border-[#f0f0f0]">
          <Lock className="w-3 h-3 text-[#999]" />
          <span className="text-[11px] text-[#999] font-medium">Anonyme</span>
        </div>
        {canMsg && !isEt && <button onClick={cloturer} className="btn-secondary btn-sm">Clôturer</button>}
      </div>

      {/* Messages */}
      <div className="flex-1 card overflow-y-auto mb-3 space-y-3 fade-up d1">
        {demande.statut === 'en_attente' && (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <span className="text-4xl mb-3">⏳</span>
            <p className="font-medium text-[#0f0f0f] text-sm">En attente d'un aidant</p>
            <p className="text-xs text-[#999] mt-1">Votre demande sera prise en charge prochainement</p>
          </div>
        )}
        {demande.messages?.map((msg, i) => {
          const isMe = msg.expediteur?._id === user?._id || msg.expediteur?._id === user?.id
          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} fade-up`} style={{ animationDelay:`${i*0.02}s` }}>
              {!isMe && (
                <div className="w-6 h-6 rounded-full bg-[#0f0f0f] flex items-center justify-center text-[10px] font-bold text-white mr-2 self-end shrink-0">
                  {msg.expediteur?.prenom?.[0] || '?'}
                </div>
              )}
              <div className={`max-w-[65%] px-3.5 py-2.5 rounded-xl text-sm ${isMe ? 'bg-[#0f0f0f] text-white rounded-br-sm' : 'bg-[#fafafa] text-[#0f0f0f] border border-[#f0f0f0] rounded-bl-sm'}`}>
                {!isMe && <p className="text-[10px] font-semibold text-[#aaa] mb-1">{msg.expediteur?.prenom || 'Aidant'}</p>}
                <p className="leading-relaxed">{msg.contenu}</p>
                <p className={`text-[10px] mt-1 ${isMe ? 'text-white/50' : 'text-[#bbb]'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {canMsg ? (
        <form onSubmit={envoyer} className="card flex items-center gap-2 py-3 fade-up d2">
          <input className="input flex-1 border-0 bg-[#fafafa] focus:ring-0" placeholder="Votre message..."
            value={message} onChange={e => setMessage(e.target.value)} disabled={sending} />
          <button type="submit" disabled={sending || !message.trim()}
            className="w-9 h-9 bg-[#0f0f0f] rounded-lg flex items-center justify-center transition-all active:scale-90 disabled:opacity-30">
            {sending ? <span className="spinner w-3.5 h-3.5" /> : <Send className="w-4 h-4 text-white" />}
          </button>
        </form>
      ) : (
        <div className="card text-center text-[#999] text-sm py-3">🔒 Session clôturée</div>
      )}
    </div>
  )
}
