import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { Send, ArrowLeft, Lock, CheckCheck } from 'lucide-react'

export default function Chat() {
  const { demandeId } = useParams(); const { user } = useAuth(); const navigate = useNavigate()
  const [demande, setDemande] = useState(null); const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true); const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { axios.get(`/api/demandes/${demandeId}`).then(r => setDemande(r.data)).catch(console.error).finally(() => setLoading(false)) }, [demandeId])
  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:'smooth'}) }, [demande?.messages])

  const envoyer = async (e) => {
    e.preventDefault(); if (!message.trim()) return; setSending(true)
    try { const res = await axios.post(`/api/demandes/${demandeId}/message`,{contenu:message}); setDemande(res.data); setMessage('') }
    catch { toast.error('Erreur') } finally { setSending(false) }
  }
  const cloturer = async () => {
    try { await axios.put(`/api/demandes/${demandeId}/cloturer`); setDemande(p => ({...p,statut:'cloturee'})); toast.success('Clôturé') }
    catch { toast.error('Erreur') }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-indigo-500 border-t-transparent rounded-full animate-spin" style={{borderWidth:'3px',borderStyle:'solid'}}/></div>
  if (!demande) return <div className="card text-center py-12 text-gray-400">Introuvable</div>

  const canMsg = demande.statut !== 'cloturee'
  const isEt = user?._id === demande.etudiant?._id || user?.id === demande.etudiant?._id

  return (
    <div className="max-w-2xl flex flex-col h-[calc(100vh-8rem)]">
      <div className="card mb-3 flex items-center gap-3 py-3.5 fade-up" style={{boxShadow:'0 2px 15px rgba(99,102,241,0.08)'}}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-all active:scale-90">
          <ArrowLeft className="w-4 h-4 text-gray-500"/>
        </button>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{background:demande.type==='pair'?'linear-gradient(135deg,#ede9fe,#ddd6fe)':'linear-gradient(135deg,#d1fae5,#a7f3d0)'}}>
          {demande.type==='pair'?'🤝':'🩺'}
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900 text-sm">{demande.type==='pair'?'Session pair-aidance':'Consultation professionnelle'}</p>
          {demande.assigneA && <p className="text-xs text-gray-500">{demande.assigneA.prenom} {demande.assigneA.nom}</p>}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <Lock className="w-3 h-3 text-emerald-600"/> <span className="text-xs font-semibold text-emerald-700">Anonyme</span>
        </div>
        {canMsg && !isEt && <button onClick={cloturer} className="btn-danger btn-sm">Clôturer</button>}
      </div>

      <div className="flex-1 card overflow-y-auto mb-3 space-y-3 fade-up d1" style={{boxShadow:'0 2px 15px rgba(99,102,241,0.06)'}}>
        {demande.statut==='en_attente' && (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 flex items-center justify-center mb-4 text-3xl animate-pulse">⏳</div>
            <p className="font-bold text-gray-700">En attente</p>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">Un aidant va prendre votre demande en charge prochainement</p>
          </div>
        )}
        {demande.messages?.map((msg,i) => {
          const isMe = msg.expediteur?._id===user?._id || msg.expediteur?._id===user?.id
          return (
            <div key={i} className={`flex ${isMe?'justify-end':'justify-start'} fade-up`} style={{animationDelay:`${i*0.02}s`}}>
              {!isMe && <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mr-2 self-end shrink-0" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>{msg.expediteur?.prenom?.[0]||'?'}</div>}
              <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${isMe?'rounded-br-sm text-white':'rounded-bl-sm text-gray-800 bg-gray-50 border border-gray-100'}`}
                style={isMe?{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}:{}}>
                {!isMe && <p className="text-[10px] font-bold text-indigo-400 mb-1">{msg.expediteur?.prenom||'Aidant'}</p>}
                <p className="text-sm leading-relaxed">{msg.contenu}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${isMe?'text-white/50':'text-gray-400'}`}>
                  <span className="text-[10px]">{new Date(msg.createdAt).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</span>
                  {isMe && <CheckCheck className="w-3 h-3"/>}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef}/>
      </div>

      {canMsg ? (
        <form onSubmit={envoyer} className="card flex items-center gap-3 py-3 fade-up d2" style={{boxShadow:'0 2px 15px rgba(99,102,241,0.08)'}}>
          <input className="input flex-1 border-0 bg-gray-50 focus:ring-0" placeholder="Votre message..." value={message} onChange={e => setMessage(e.target.value)} disabled={sending}/>
          <button type="submit" disabled={sending||!message.trim()} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-40" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
            {sending ? <span className="spinner w-4 h-4"/> : <Send className="w-4 h-4 text-white"/>}
          </button>
        </form>
      ) : <div className="card text-center text-gray-400 text-sm py-3.5">🔒 Session clôturée</div>}
    </div>
  )
}
