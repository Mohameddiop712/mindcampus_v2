import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Heart, Lightbulb, MessageCircle, Calendar, TrendingUp, ArrowRight, AlertTriangle, Sparkles, Users, Clock, Activity, CheckCircle, ChevronRight } from 'lucide-react'
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

// ══════════════════════════════════════
// DASHBOARD ÉTUDIANT
// ══════════════════════════════════════
function DashboardEtudiant() {
  const { user } = useAuth()
  const [data, setData] = useState({ humeurs:[], recommandations:[], demandes:[], rendezvous:[] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/humeur'), axios.get('/api/recommandations'),
      axios.get('/api/demandes/mes-demandes'), axios.get('/api/rendezvous')
    ]).then(([h,r,d,rv]) => setData({humeurs:h.data,recommandations:r.data,demandes:d.data,rendezvous:rv.data}))
    .catch(console.error).finally(() => setLoading(false))
  }, [])

  const chart = data.humeurs.slice(0,7).reverse().map(h => ({
    date: new Date(h.createdAt).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'}),
    score: etatScore[h.etat]
  }))
  const last = data.humeurs[0]
  const unread = data.recommandations.filter(r => !r.lue).length
  const hour = new Date().getHours()
  const greeting = hour<12?'Bonjour':hour<18?'Bon après-midi':'Bonsoir'

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>

  const stats = [
    { icon:Heart, label:'Humeurs', value:data.humeurs.length, sub:'enregistrées', grad:'linear-gradient(135deg,#0d9488,#059669)', to:'/humeur' },
    { icon:Lightbulb, label:'Non lues', value:unread, sub:'recommandations', grad:'linear-gradient(135deg,#f59e0b,#ef4444)', to:'/recommandations' },
    { icon:MessageCircle, label:'Demandes', value:data.demandes.length, sub:"d'aide", grad:'linear-gradient(135deg,#6366f1,#8b5cf6)', to:'/demandes' },
    { icon:Calendar, label:'Rendez-vous', value:data.rendezvous.length, sub:'planifiés', grad:'linear-gradient(135deg,#ec4899,#8b5cf6)', to:'/rendezvous' },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between fade-up">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{greeting}, {user?.prenom} {last?etatEmoji[last.etat]:'👋'}</h1>
          <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}</p>
        </div>
        <Link to="/humeur" className="btn-primary"><Heart className="w-4 h-4"/> Saisir mon humeur</Link>
      </div>

      {last?.estCritique && (
        <div className="fade-up flex items-center gap-4 p-4 rounded-2xl border border-red-200" style={{background:'linear-gradient(135deg,#fff5f5,#fef2f2)'}}>
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0"><AlertTriangle className="w-5 h-5 text-red-500"/></div>
          <div className="flex-1">
            <p className="font-semibold text-red-800 text-sm">Nous pensons à vous</p>
            <p className="text-red-600 text-xs mt-0.5">Vous ne vous sentez pas bien. Un aidant est disponible.</p>
          </div>
          <Link to="/demandes" className="btn-danger btn-sm">Demander de l'aide</Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 fade-up d1">
        {stats.map(s => (
          <Link key={s.to} to={s.to} className="card-hover group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 -translate-y-6 translate-x-6" style={{background:s.grad}}/>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm" style={{background:s.grad}}>
              <s.icon className="w-5 h-5 text-white"/>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-600 font-medium mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-400">{s.sub}</p>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 absolute bottom-4 right-4 group-hover:text-gray-500 transition-colors"/>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card lg:col-span-2 fade-up d2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm"><TrendingUp className="w-4 h-4 text-indigo-500"/>Évolution de l'humeur</h2>
              <p className="text-xs text-gray-400 mt-0.5">7 derniers jours</p>
            </div>
            <Link to="/humeur" className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1">Voir tout <ArrowRight className="w-3 h-3"/></Link>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                <XAxis dataKey="date" tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
                <YAxis domain={[1,5]} tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
                <Tooltip content={<Tip/>}/>
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} fill="url(#g)" dot={{fill:'#6366f1',r:4,strokeWidth:2,stroke:'#fff'}}/>
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center">
              <TrendingUp className="w-10 h-10 text-gray-200 mb-2"/>
              <p className="text-sm text-gray-400">Enregistrez votre humeur pour voir l'évolution</p>
            </div>
          )}
        </div>

        <div className="card fade-up d3 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-sm">Humeur du jour</h2>
            <Link to="/humeur" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">Modifier</Link>
          </div>
          {last ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-3">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-3 bg-gradient-to-br ${etatGrad[last.etat]} shadow-lg`}>{etatEmoji[last.etat]}</div>
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

      <div className="fade-up d4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-500"/>
          <p className="text-sm font-bold text-gray-700">Actions rapides</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to:'/humeur', emoji:'🧠', label:'Saisir mon humeur', grad:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'#bbf7d0' },
            { to:'/demandes', emoji:'💬', label:"Demande d'aide", grad:'linear-gradient(135deg,#eff6ff,#dbeafe)', border:'#bfdbfe' },
            { to:'/rendezvous', emoji:'📅', label:'Prendre un RDV', grad:'linear-gradient(135deg,#fdf4ff,#fae8ff)', border:'#e9d5ff' },
            { to:'/recommandations', emoji:'✨', label:'Recommandations', grad:'linear-gradient(135deg,#fffbeb,#fef3c7)', border:'#fde68a' },
          ].map(a => (
            <Link key={a.to} to={a.to} className="flex items-center gap-3 p-4 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-md" style={{background:a.grad,borderColor:a.border}}>
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-xs font-semibold text-gray-700">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════
// DASHBOARD PAIR-AIDANT / PROFESSIONNEL
// ══════════════════════════════════════
function DashboardAidant() {
  const { user } = useAuth()
  const [demandes, setDemandes] = useState([])
  const [rendezvous, setRendezvous] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/demandes/assignees'),
      axios.get('/api/rendezvous')
    ]).then(([d, rv]) => {
      setDemandes(d.data)
      setRendezvous(rv.data)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const enAttente = demandes.filter(d => d.statut === 'en_attente')
  const enCours = demandes.filter(d => ['acceptee','en_cours'].includes(d.statut))
  const rvAVenir = rendezvous.filter(r => new Date(r.dateHeure) >= new Date() && r.statut !== 'annule')
  const hour = new Date().getHours()
  const greeting = hour<12?'Bonjour':hour<18?'Bon après-midi':'Bonsoir'
  const isPair = user?.role === 'pair'

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"/></div>

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="fade-up">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {greeting}, {user?.prenom} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{background:'linear-gradient(135deg,#f0fdf4,#dcfce7)',borderColor:'#bbf7d0'}}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
            <span className="text-xs font-semibold text-emerald-700">
              {isPair ? 'Pair-aidant actif' : 'Professionnel actif'}
            </span>
          </div>
        </div>

        {/* Bannière rôle */}
        <div className="mt-4 p-5 rounded-2xl text-white fade-up d1" style={{background:isPair?'linear-gradient(135deg,#6366f1,#8b5cf6)':'linear-gradient(135deg,#0d9488,#059669)'}}>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{isPair ? '🤝' : '🩺'}</div>
            <div>
              <p className="font-bold text-lg">{isPair ? 'Espace Pair-Aidant' : 'Espace Professionnel'}</p>
              <p className="text-white/80 text-sm mt-0.5">
                {isPair
                  ? 'Vous accompagnez vos camarades avec bienveillance et écoute'
                  : 'Vous fournissez un soutien psychologique professionnel aux étudiants'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 fade-up d2">
        {[
          { icon:Clock, label:'En attente', val:enAttente.length, grad:'linear-gradient(135deg,#fef3c7,#fde68a)', text:'text-amber-700' },
          { icon:Activity, label:'En cours', val:enCours.length, grad:'linear-gradient(135deg,#d1fae5,#a7f3d0)', text:'text-emerald-700' },
          { icon:Calendar, label:'RDV à venir', val:rvAVenir.length, grad:'linear-gradient(135deg,#e0e7ff,#c7d2fe)', text:'text-indigo-700' },
        ].map(s => (
          <div key={s.label} className="card" style={{background:s.grad,border:'none'}}>
            <s.icon className={`w-5 h-5 ${s.text} mb-3`}/>
            <p className={`text-3xl font-extrabold ${s.text}`}>{s.val}</p>
            <p className="text-xs text-gray-600 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Demandes en attente */}
      {enAttente.length > 0 && (
        <div className="fade-up d3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-700 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500"/>Demandes en attente</p>
            <Link to="/pair-dashboard" className="text-xs text-indigo-600 font-semibold flex items-center gap-1">Voir tout <ArrowRight className="w-3 h-3"/></Link>
          </div>
          <div className="space-y-2">
            {enAttente.slice(0,3).map((d,i) => (
              <Link key={d._id} to="/pair-dashboard"
                className="card flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all fade-up"
                style={{animationDelay:`${i*0.05}s`,borderLeft:'3px solid #f59e0b'}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{background:'linear-gradient(135deg,#fef3c7,#fde68a)'}}>
                  {d.type==='pair'?'🤝':'🩺'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {d.estUrgent && <span className="badge-red">⚠ Urgent</span>}
                    <span className="text-xs text-gray-400">{d.etudiant?.estAnonyme!==false?'Étudiant anonyme':d.etudiant?.prenom}</span>
                  </div>
                  <p className="text-sm text-gray-700 truncate">{d.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0"/>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sessions en cours */}
      {enCours.length > 0 && (
        <div className="fade-up d4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-700 flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-500"/>Sessions en cours</p>
            <Link to="/pair-dashboard" className="text-xs text-indigo-600 font-semibold flex items-center gap-1">Voir tout <ArrowRight className="w-3 h-3"/></Link>
          </div>
          <div className="space-y-2">
            {enCours.slice(0,2).map((d,i) => (
              <Link key={d._id} to={`/chat/${d._id}`}
                className="card flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all fade-up"
                style={{animationDelay:`${i*0.05}s`,borderLeft:'3px solid #10b981'}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{background:'linear-gradient(135deg,#d1fae5,#a7f3d0)'}}>💬</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="badge-green">En cours</span>
                    {d.estUrgent && <span className="badge-red">Urgent</span>}
                  </div>
                  <p className="text-sm text-gray-700 truncate">{d.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{d.messages?.length||0} message(s)</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0"/>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* RDV à venir */}
      {rvAVenir.length > 0 && (
        <div className="fade-up d5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-700 flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-500"/>Prochains rendez-vous</p>
            <Link to="/rendezvous" className="text-xs text-indigo-600 font-semibold flex items-center gap-1">Voir tout <ArrowRight className="w-3 h-3"/></Link>
          </div>
          <div className="space-y-2">
            {rvAVenir.slice(0,2).map((rv,i) => (
              <Link key={rv._id} to="/rendezvous"
                className="card flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all fade-up"
                style={{animationDelay:`${i*0.05}s`}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{background:'linear-gradient(135deg,#e0e7ff,#c7d2fe)'}}>📅</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{rv.etudiant?.prenom} {rv.etudiant?.nom}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(rv.dateHeure).toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
                  </p>
                </div>
                <span className="badge-blue capitalize">{rv.statut}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tout vide */}
      {demandes.length === 0 && rendezvous.length === 0 && (
        <div className="card flex flex-col items-center py-16 text-center fade-up" style={{background:'linear-gradient(135deg,#f0fdf4,#dcfce7)',border:'1px solid #bbf7d0'}}>
          <div className="text-5xl mb-4">✅</div>
          <p className="font-bold text-gray-800 text-lg">Tout est à jour !</p>
          <p className="text-gray-500 text-sm mt-1">Aucune demande en attente pour le moment</p>
        </div>
      )}

      {/* Actions rapides */}
      <div className="fade-up">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Accès rapide</p>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/pair-dashboard" className="flex items-center gap-3 p-4 rounded-2xl border hover:-translate-y-0.5 hover:shadow-md transition-all" style={{background:'linear-gradient(135deg,#f5f3ff,#ede9fe)',borderColor:'#ddd6fe'}}>
            <span className="text-2xl">📋</span>
            <span className="text-sm font-semibold text-gray-700">Gérer les demandes</span>
          </Link>
          <Link to="/rendezvous" className="flex items-center gap-3 p-4 rounded-2xl border hover:-translate-y-0.5 hover:shadow-md transition-all" style={{background:'linear-gradient(135deg,#eff6ff,#dbeafe)',borderColor:'#bfdbfe'}}>
            <span className="text-2xl">📅</span>
            <span className="text-sm font-semibold text-gray-700">Mes rendez-vous</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════
// COMPOSANT PRINCIPAL
// ══════════════════════════════════════
export default function Dashboard() {
  const { user } = useAuth()
  if (user?.role === 'etudiant') return <DashboardEtudiant />
  return <DashboardAidant />
}
