import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { Users, ChevronRight, AlertCircle, Clock, CheckCircle, Activity } from 'lucide-react'

export default function PairDashboard() {
  const { user } = useAuth()
  const [demandes, setDemandes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/demandes/assignees').then(r => setDemandes(r.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const accepter = async (id) => {
    try {
      const res = await axios.put(`/api/demandes/${id}/accepter`)
      setDemandes(demandes.map(d => d._id === id ? res.data : d))
      toast.success('Demande acceptée !')
    } catch { toast.error('Erreur') }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>

  const enAttente = demandes.filter(d => d.statut === 'en_attente')
  const enCours = demandes.filter(d => ['acceptee', 'en_cours'].includes(d.statut))

  return (
    <div className="space-y-7 max-w-3xl">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-teal-600" />
          {user?.role === 'pair' ? 'Tableau pair-aidant' : 'Tableau professionnel'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Gérez les demandes de soutien des étudiants</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 animate-fade-up stagger-1">
        {[
          { icon: Clock, label: 'En attente', count: enAttente.length, bg: 'bg-amber-50', text: 'text-amber-600', iconBg: 'bg-amber-100' },
          { icon: Activity, label: 'En cours', count: enCours.length, bg: 'bg-teal-50', text: 'text-teal-600', iconBg: 'bg-teal-100' },
          { icon: CheckCircle, label: 'Total reçues', count: demandes.length, bg: 'bg-gray-50', text: 'text-gray-600', iconBg: 'bg-gray-100' },
        ].map(s => (
          <div key={s.label} className={`card ${s.bg} border-0`}>
            <div className={`w-10 h-10 rounded-2xl ${s.iconBg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.text}`} />
            </div>
            <p className={`text-3xl font-extrabold ${s.text}`}>{s.count}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* En attente */}
      {enAttente.length > 0 && (
        <div className="space-y-3 animate-fade-up stagger-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-gray-700">Demandes en attente</h2>
            <span className="badge-yellow">{enAttente.length}</span>
          </div>
          {enAttente.map((d, i) => (
            <div key={d._id} className="card border-l-[3px] border-l-amber-400 animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start gap-4">
                <div className="text-2xl mt-0.5">{d.type === 'pair' ? '🤝' : '🩺'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {d.estUrgent && (
                      <span className="badge-red flex items-center gap-1"><AlertCircle className="w-3 h-3" />Urgent</span>
                    )}
                    <span className="text-xs font-semibold text-gray-500">
                      {d.etudiant?.estAnonyme !== false ? '🔒 Étudiant anonyme' : d.etudiant?.prenom}
                      {d.etudiant?.filiere && ` · ${d.etudiant.filiere}`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{d.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(d.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' })}
                  </p>
                </div>
                <button onClick={() => accepter(d._id)} className="btn-primary btn-sm whitespace-nowrap">
                  Accepter →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* En cours */}
      {enCours.length > 0 && (
        <div className="space-y-3 animate-fade-up stagger-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-500" />
            <h2 className="text-sm font-bold text-gray-700">Sessions en cours</h2>
            <span className="badge-teal">{enCours.length}</span>
          </div>
          {enCours.map((d, i) => (
            <Link key={d._id} to={`/chat/${d._id}`}
              className="card-hover flex items-center gap-4 animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0 text-xl">
                {d.type === 'pair' ? '🤝' : '🩺'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="badge-teal text-[10px]">{d.statut === 'en_cours' ? 'En cours' : 'Acceptée'}</span>
                  {d.estUrgent && <span className="badge-red">Urgent</span>}
                </div>
                <p className="text-sm text-gray-700 truncate font-medium">{d.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">{d.messages?.length || 0} message(s)</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {demandes.length === 0 && (
        <div className="card flex flex-col items-center justify-center py-20 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center mb-4"><span className="text-3xl">✅</span></div>
          <h3 className="font-bold text-gray-800 mb-1">Tout est à jour !</h3>
          <p className="text-sm text-gray-500">Aucune demande en attente pour le moment.</p>
        </div>
      )}
    </div>
  )
}
