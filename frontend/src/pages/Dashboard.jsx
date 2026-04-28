import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Heart, Lightbulb, MessageCircle, Calendar, TrendingUp, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const etatEmoji = { tres_bien:'😄', bien:'🙂', moyen:'😐', mal:'😔', tres_mal:'😢' }
const etatLabel = { tres_bien:'Très bien', bien:'Bien', moyen:'Moyen', mal:'Mal', tres_mal:'Très mal' }
const etatScore = { tres_bien:5, bien:4, moyen:3, mal:2, tres_mal:1 }
const etatGrad  = { tres_bien:'from-emerald-400 to-teal-500', bien:'from-teal-400 to-cyan-500', moyen:'from-amber-400 to-yellow-500', mal:'from-orange-400 to-red-400', tres_mal:'from-red-500 to-rose-600' }

const Tip = ({ active, payload, label }) => active && payload?.length ? (
  <div className="bg-white border border-indigo-100 rounded-xl px-3 py-2 shadow-lg text-xs">
    <p className="text-gray-500">{label}</p>
    <p className="font-bold text-indigo-600 mt-0.5">Score : {payload[0].value}/5</p>
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
    ]).then(([h,r,d,rv]) => setData({humeurs:h.data,recommandations:r.data,demandes:d.data,rendezvous:rv.data}))
    .catch(console.error).finally(() => setLoading(false))
  }, [user])

  const chart = data.humeurs.slice(0,7).reverse().map(h => ({
    date: new Date(h.createdAt).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'}),
    score: etatScore[h.etat]
  }))
  const last = data.humeurs[0]
  const unread = data.recommandations.filter(r => !r.lue).length
  const hour = new Date().getHours()
  const greeting = hour<12?'Bonjour':hour<18?'Bon après-midi':'Bonsoir'

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" style={{borderWidth:'3px'}} />
    </div>
  )

  const stats = [
    { icon:Heart, label:'Humeurs', value:data.humeurs.length, sub:'enregistrées', grad:'linear-gradient(135deg,#0d9488,#059669)', to:'/humeur' },
    { icon:Lightbulb, label:'Non lues', value:unread, sub:'recommandations', grad:'linear-gradient(135deg,#f59e0b,#ef4444)', to:'/recommandations' },
    { icon:MessageCircle, label:'Demandes', value:data.demandes.length, sub:"d'aide", grad:'linear-gradient(135deg,#6366f1,#8b5cf6)', to:'/demandes' },
    { icon:Calendar, label:'Rendez-vous', value:data.rendezvous.length, sub:'planifiés', grad:'linear-gradient(135deg,#ec4899,#8b5cf6)', to:'/rendezvous' },
  ]

  return (
    <div className="space-y-7 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between fade-up">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {greeting}, {user?.prenom} {last?etatEmoji[last.etat]:'👋'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}
          </p>
        </div>
        <Link to="/humeur" className="btn-primary">
          <Heart className="w-4 h-4" /> Saisir mon humeur
        </Link>
      </div>

      {/* Alert critique */}
      {last?.estCritique && (
        <div className="fade-up flex items-center gap-4 p-4 rounded-2xl border border-red-200" style={{background:'linear-gradient(135deg,#fff5f5,#fef2f2)'}}>
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-red-800 text-sm">Nous pensons à vous</p>
            <p className="text-red-600 text-xs mt-0.5">Vous ne vous sentez pas bien. Un aidant est disponible.</p>
          </div>
          <Link to="/demandes" className="btn-danger btn-sm">Demander de l'aide</Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 fade-up d1">
        {stats.map(s => (
          <Link key={s.to} to={s.to}
            className="card-hover group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 -translate-y-6 translate-x-6"
              style={{background:s.grad}} />
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm"
              style={{background:s.grad}}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-600 font-medium mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-400">{s.sub}</p>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 absolute bottom-4 right-4 group-hover:text-gray-500 transition-colors" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="card lg:col-span-2 fade-up d2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-indigo-500" /> Évolution de l'humeur
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">7 derniers jours</p>
            </div>
            <Link to="/humeur" className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1">Voir tout <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {chart.length > 0 ? (
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false} />
                <YAxis domain={[1,5]} tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} fill="url(#g)"
                  dot={{fill:'#6366f1',r:4,strokeWidth:2,stroke:'#fff'}} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center">
              <TrendingUp className="w-10 h-10 text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">Enregistrez votre humeur pour voir l'évolution</p>
            </div>
          )}
        </div>

        {/* Humeur du jour */}
        <div className="card fade-up d3 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-sm">Humeur du jour</h2>
            <Link to="/humeur" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">Modifier</Link>
          </div>
          {last ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-3">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-3 bg-gradient-to-br ${etatGrad[last.etat]} shadow-lg`}>
                {etatEmoji[last.etat]}
              </div>
              <p className="font-bold text-gray-900">{etatLabel[last.etat]}</p>
              {last.note && <p className="text-xs text-gray-400 mt-2 italic max-w-[150px] line-clamp-2">"{last.note}"</p>}
              <p className="text-xs text-gray-300 mt-2">{new Date(last.createdAt).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-4">
              <div className="text-5xl">🌤️</div>
              <p className="text-sm text-gray-500">Pas de saisie aujourd'hui</p>
              <Link to="/humeur" className="btn-primary btn-sm">Commencer</Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="fade-up d4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <p className="text-sm font-bold text-gray-700">Actions rapides</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to:'/humeur', emoji:'🧠', label:'Saisir mon humeur', grad:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'#bbf7d0' },
            { to:'/demandes', emoji:'💬', label:"Demande d'aide", grad:'linear-gradient(135deg,#eff6ff,#dbeafe)', border:'#bfdbfe' },
            { to:'/rendezvous', emoji:'📅', label:'Prendre un RDV', grad:'linear-gradient(135deg,#fdf4ff,#fae8ff)', border:'#e9d5ff' },
            { to:'/recommandations', emoji:'✨', label:'Recommandations', grad:'linear-gradient(135deg,#fffbeb,#fef3c7)', border:'#fde68a' },
          ].map(a => (
            <Link key={a.to} to={a.to}
              className="flex items-center gap-3 p-4 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{background:a.grad,borderColor:a.border}}>
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-xs font-semibold text-gray-700">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
