import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Heart, Lightbulb, MessageCircle, Calendar, ArrowRight, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const etatEmoji = { tres_bien:'😄', bien:'🙂', moyen:'😐', mal:'😔', tres_mal:'😢' }
const etatLabel = { tres_bien:'Très bien', bien:'Bien', moyen:'Moyen', mal:'Mal', tres_mal:'Très mal' }
const etatScore = { tres_bien:5, bien:4, moyen:3, mal:2, tres_mal:1 }

const Tip = ({ y, active, payload, label }) => active && payload?.length ? (
  <div className="bg-white border border-[#f0f0f0] rounded-lg px-3 py-2 shadow-sm text-xs">
    <p className="text-[#999]">{label}</p>
    <p className="font-semibold text-[#0f0f0f]">{payload[0].value}/5</p>
  </div>
) : null

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState({ humeurs:[], recommandations:[], demandes:[], rendezvous:[] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'etudiant') { setLoading(false); return }
    Promise.all([
      axios.get('/api/humeur'), axios.get('/api/recommandations'),
      axios.get('/api/demandes/mes-demandes'), axios.get('/api/rendezvous')
    ]).then(([h,r,d,rv]) => setData({ humeurs:h.data, recommandations:r.data, demandes:d.data, rendezvous:rv.data }))
    .catch(console.error).finally(() => setLoading(false))
  }, [user])

  const chart = data.humeurs.slice(0,7).reverse().map(h => ({
    date: new Date(h.createdAt).toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit' }),
    score: etatScore[h.etat]
  }))
  const last = data.humeurs[0]
  const unread = data.recommandations.filter(r => !r.lue).length

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-[#0f0f0f] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="fade-up">
        <h1 className="text-3xl font-bold text-[#0f0f0f] tracking-tight">
          {greeting}, {user?.prenom} {last ? etatEmoji[last.etat] : '👋'}
        </h1>
        <p className="text-[#999] text-sm mt-1">
          {new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
        </p>
      </div>

      {/* Alert critique */}
      {last?.estCritique && (
        <div className="fade-up card-inset border-l-4 border-l-[#ff4444]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#0f0f0f] text-sm">Nous pensons à vous</p>
              <p className="text-[#666] text-xs mt-0.5">Vous ne vous sentez pas bien. Un aidant est disponible.</p>
            </div>
            <Link to="/demandes" className="btn-primary btn-sm">Demander de l'aide</Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 fade-up d1">
        {[
          { icon: Heart, label: 'Humeurs', value: data.humeurs.length, to: '/humeur' },
          { icon: Lightbulb, label: 'Non lues', value: unread, to: '/recommandations' },
          { icon: MessageCircle, label: 'Demandes', value: data.demandes.length, to: '/demandes' },
          { icon: Calendar, label: 'RDV', value: data.rendezvous.length, to: '/rendezvous' },
        ].map(s => (
          <Link key={s.to} to={s.to}
            className="card-hover flex flex-col gap-3 group">
            <div className="flex items-center justify-between">
              <s.icon className="w-4 h-4 text-[#aaa] group-hover:text-[#0f0f0f] transition-colors" />
              <ArrowRight className="w-3.5 h-3.5 text-[#ddd] group-hover:text-[#aaa] transition-colors" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0f0f0f]">{s.value}</p>
              <p className="text-xs text-[#999]">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="card lg:col-span-2 fade-up d2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-[#0f0f0f] text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#aaa]" /> Évolution de l'humeur
              </h2>
              <p className="text-xs text-[#aaa] mt-0.5">7 derniers jours</p>
            </div>
            <Link to="/humeur" className="text-xs text-[#999] hover:text-[#0f0f0f] flex items-center gap-1 transition-colors">
              Voir tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {chart.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f0f0f" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#0f0f0f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize:11, fill:'#bbb' }} axisLine={false} tickLine={false} />
                <YAxis domain={[1,5]} tick={{ fontSize:11, fill:'#bbb' }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} />
                <Area type="monotone" dataKey="score" stroke="#0f0f0f" strokeWidth={2} fill="url(#g)"
                  dot={{ fill:'#0f0f0f', r:3, strokeWidth:2, stroke:'#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[#ddd] text-3xl mb-2">📈</p>
                <p className="text-xs text-[#bbb]">Enregistrez votre humeur pour voir l'évolution</p>
              </div>
            </div>
          )}
        </div>

        {/* Humeur du jour */}
        <div className="card fade-up d3 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#0f0f0f] text-sm">Humeur du jour</h2>
            <Link to="/humeur" className="text-xs text-[#999] hover:text-[#0f0f0f] transition-colors">Modifier</Link>
          </div>
          {last ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
              <span className="text-5xl mb-3">{etatEmoji[last.etat]}</span>
              <p className="font-semibold text-[#0f0f0f]">{etatLabel[last.etat]}</p>
              {last.note && <p className="text-xs text-[#999] mt-2 italic max-w-[140px] line-clamp-2">"{last.note}"</p>}
              <p className="text-xs text-[#bbb] mt-3">
                {new Date(last.createdAt).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6 gap-3">
              <span className="text-4xl">🌤️</span>
              <p className="text-xs text-[#999]">Pas encore de saisie aujourd'hui</p>
              <Link to="/humeur" className="btn-primary btn-sm">Saisir maintenant</Link>
            </div>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="fade-up d4">
        <p className="text-xs font-semibold text-[#aaa] uppercase tracking-widest mb-3">Accès rapide</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { to:'/humeur', emoji:'🧠', label:'Saisir mon humeur' },
            { to:'/demandes', emoji:'💬', label:"Demander de l'aide" },
            { to:'/rendezvous', emoji:'📅', label:'Prendre un RDV' },
            { to:'/recommandations', emoji:'✨', label:'Recommandations' },
          ].map(a => (
            <Link key={a.to} to={a.to}
              className="card-hover flex items-center gap-3 p-4 group">
              <span className="text-xl">{a.emoji}</span>
              <span className="text-xs font-medium text-[#444] group-hover:text-[#0f0f0f] transition-colors">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
