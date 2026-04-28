import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Heart, Lightbulb, MessageCircle, Calendar, TrendingUp, AlertCircle, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const etatEmoji = { tres_bien: '😄', bien: '🙂', moyen: '😐', mal: '😔', tres_mal: '😢' }
const etatLabel = { tres_bien: 'Très bien', bien: 'Bien', moyen: 'Moyen', mal: 'Mal', tres_mal: 'Très mal' }
const etatScore = { tres_bien: 5, bien: 4, moyen: 3, mal: 2, tres_mal: 1 }
const etatGrad = { tres_bien: 'from-emerald-400 to-teal-500', bien: 'from-teal-400 to-cyan-500', moyen: 'from-amber-400 to-yellow-500', mal: 'from-orange-400 to-red-400', tres_mal: 'from-red-500 to-rose-600' }

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-3 py-2 text-xs">
      <p className="font-semibold text-gray-600">{label}</p>
      <p className="text-teal-600 font-bold">Score : {payload[0].value}/5</p>
    </div>
  )
  return null
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ humeurs: [], recommandations: [], demandes: [], rendezvous: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'etudiant') { setLoading(false); return }
    Promise.all([
      axios.get('/api/humeur'), axios.get('/api/recommandations'),
      axios.get('/api/demandes/mes-demandes'), axios.get('/api/rendezvous')
    ]).then(([h, r, d, rv]) => {
      setStats({ humeurs: h.data, recommandations: r.data, demandes: d.data, rendezvous: rv.data })
    }).catch(console.error).finally(() => setLoading(false))
  }, [user])

  const chartData = stats.humeurs.slice(0, 7).reverse().map(h => ({
    date: new Date(h.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    score: etatScore[h.etat]
  }))

  const derniereHumeur = stats.humeurs[0]
  const nonLues = stats.recommandations.filter(r => !r.lue).length

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-7 max-w-5xl">

      {/* Header */}
      <div className="flex items-start justify-between animate-fade-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{derniereHumeur ? etatEmoji[derniereHumeur.etat] : '👋'}</span>
            <h1 className="text-2xl font-extrabold text-gray-900">Bonjour, {user?.prenom} !</h1>
          </div>
          <p className="text-gray-500 text-sm">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Link to="/humeur" className="btn-primary gap-2">
          <Heart className="w-4 h-4" /> Saisir mon humeur
        </Link>
      </div>

      {/* Alert critique */}
      {derniereHumeur?.estCritique && (
        <div className="animate-fade-up flex items-start gap-3 p-4 rounded-2xl border"
          style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
          <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-red-700 text-sm">Nous pensons à vous</p>
            <p className="text-xs text-red-500 mt-0.5">Vous ne vous sentez pas bien. Un pair-aidant est disponible pour vous écouter.</p>
          </div>
          <Link to="/demandes" className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 whitespace-nowrap">
            Demander de l'aide <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Heart, label: 'Humeurs', value: stats.humeurs.length, sub: 'enregistrées', color: '#0d9488', bg: '#f0fdfa', to: '/humeur', delay: 'stagger-1' },
          { icon: Lightbulb, label: 'Recommandations', value: nonLues, sub: 'non lues', color: '#d97706', bg: '#fffbeb', to: '/recommandations', delay: 'stagger-2' },
          { icon: MessageCircle, label: "Demandes d'aide", value: stats.demandes.length, sub: 'total', color: '#2563eb', bg: '#eff6ff', to: '/demandes', delay: 'stagger-3' },
          { icon: Calendar, label: 'Rendez-vous', value: stats.rendezvous.length, sub: 'planifiés', color: '#7c3aed', bg: '#f5f3ff', to: '/rendezvous', delay: 'stagger-4' },
        ].map(({ icon: Icon, label, value, sub, color, bg, to, delay }) => (
          <Link key={to} to={to} className={`card-hover animate-fade-up ${delay}`}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ background: bg }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{value}</p>
            <p className="text-sm font-medium text-gray-600 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="card lg:col-span-2 animate-fade-up stagger-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <div>
                <h2 className="font-bold text-gray-900 text-sm">Évolution de l'humeur</h2>
                <p className="text-xs text-gray-400">7 derniers jours</p>
              </div>
            </div>
            <Link to="/humeur" className="text-xs text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1">
              Voir tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[1, 5]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#0d9488" strokeWidth={2.5} fill="url(#colorScore)" dot={{ fill: '#0d9488', r: 4, strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-gray-300">
              <TrendingUp className="w-10 h-10 mb-2" />
              <p className="text-sm text-gray-400">Enregistrez votre humeur pour voir l'évolution</p>
            </div>
          )}
        </div>

        {/* Dernière humeur */}
        <div className="card animate-fade-up stagger-2 flex flex-col">
          <h2 className="font-bold text-gray-900 text-sm mb-4">Humeur du jour</h2>
          {derniereHumeur ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4 bg-gradient-to-br ${etatGrad[derniereHumeur.etat]} shadow-lg`}>
                {etatEmoji[derniereHumeur.etat]}
              </div>
              <p className="font-bold text-gray-900">{etatLabel[derniereHumeur.etat]}</p>
              {derniereHumeur.note && (
                <p className="text-xs text-gray-500 mt-2 italic max-w-[160px] line-clamp-2">"{derniereHumeur.note}"</p>
              )}
              <p className="text-xs text-gray-400 mt-3">
                {new Date(derniereHumeur.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
              <div className="text-5xl mb-3">🌟</div>
              <p className="text-sm text-gray-500 mb-4">Aucune humeur aujourd'hui</p>
              <Link to="/humeur" className="btn-primary btn-sm">Commencer</Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="animate-fade-up stagger-3">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <h2 className="font-bold text-gray-900 text-sm">Actions rapides</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/humeur', emoji: '🧠', label: 'Saisir mon humeur', gradient: 'from-teal-500 to-cyan-500' },
            { to: '/demandes', emoji: '💬', label: "Demander de l'aide", gradient: 'from-blue-500 to-indigo-500' },
            { to: '/rendezvous', emoji: '📅', label: 'Prendre un RDV', gradient: 'from-violet-500 to-purple-600' },
            { to: '/recommandations', emoji: '✨', label: 'Mes recommandations', gradient: 'from-amber-400 to-orange-500' },
          ].map(a => (
            <Link key={a.to} to={a.to}
              className="group relative overflow-hidden rounded-2xl p-4 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{ background: 'white', border: '1px solid #f1f5f9' }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${a.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className="text-3xl mb-2">{a.emoji}</div>
              <p className="text-xs font-semibold text-gray-700">{a.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
