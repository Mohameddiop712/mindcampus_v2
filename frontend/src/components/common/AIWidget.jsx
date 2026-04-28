import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { MessageCircle, X, Send, Bot, Minimize2, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const WELCOME = "Bonjour ! 👋 Je suis MindBot, votre assistant bien-être. Je suis là pour vous écouter en toute confidentialité. Comment vous sentez-vous aujourd'hui ?"

export default function AIWidget() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: WELCOME }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open, minimized])

  const sendMessage = async (e) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }))
      const res = await axios.post('/api/ai/chat', { messages: apiMessages })
      const botMsg = { role: 'assistant', content: res.data.message }
      setMessages(prev => [...prev, botMsg])
      if (!open) setUnread(n => n + 1)
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Je suis désolé, je rencontre une difficulté technique. Veuillez réessayer dans quelques instants. 🙏"
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetChat = () => {
    setMessages([{ role: 'assistant', content: WELCOME }])
    setInput('')
  }

  if (!user) return null

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 group"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          title="Parler à MindBot"
        >
          <Bot className="w-6 h-6 text-white" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-2xl animate-ping opacity-20" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }} />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${minimized ? 'h-[60px] w-[280px]' : 'w-[360px] h-[520px]'}`}
          style={{ boxShadow: '0 20px 60px rgba(99,102,241,0.25)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 shrink-0" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-white font-bold text-sm">MindBot</p>
                <Sparkles className="w-3 h-3 text-indigo-200" />
              </div>
              {!minimized && (
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <p className="text-indigo-200 text-[10px]">Assistant bien-être · En ligne</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized(!minimized)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5 text-white" />
              </button>
              <button
                onClick={() => { setOpen(false); setMinimized(false) }}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Disclaimer */}
              <div className="px-3 py-2 bg-indigo-50 border-b border-indigo-100 shrink-0">
                <p className="text-[10px] text-indigo-500 text-center">
                  🔒 Conversation confidentielle · Ne remplace pas un professionnel de santé
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-white">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} fade-in`}>
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mr-2 self-end mb-1"
                        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'text-white rounded-br-sm'
                          : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-bl-sm'
                      }`}
                      style={msg.role === 'user' ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' } : {}}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Loading dots */}
                {loading && (
                  <div className="flex justify-start fade-in">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mr-2 self-end mb-1"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick replies */}
              {messages.length <= 1 && (
                <div className="px-3 py-2 bg-white border-t border-gray-50 flex gap-2 overflow-x-auto shrink-0">
                  {["Je me sens stressé(e)", "J'ai du mal à dormir", "Je me sens seul(e)"].map(q => (
                    <button key={q} onClick={() => { setInput(q); inputRef.current?.focus() }}
                      className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors border border-indigo-100 shrink-0">
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="px-3 pb-3 pt-2 bg-white border-t border-gray-100 shrink-0">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Écrivez votre message..."
                    rows={1}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 resize-none transition-all"
                    style={{ maxHeight: '80px' }}
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-40 shrink-0"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[10px] text-gray-300">Entrée pour envoyer</p>
                  <button onClick={resetChat} className="text-[10px] text-gray-400 hover:text-indigo-500 transition-colors">
                    Nouvelle conversation
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
