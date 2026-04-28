import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { ChevronRight, Clock, Activity, CheckCircle } from 'lucide-react'

export default function PairDashboard() {
  const { user } = useAuth()
  const [demandes, setDemandes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { axios.get('/api/demandes/assignees').then(r => setDemandes(r.data)).catch(console.error).finally(() => setLoading(false)) }, [])

  const accepter = async (id) => {
    try { const res = await axios.put(`/api/demandes/${id}/accepter`); setDemandes(demandes.map(d => d._id === id ? res.data : d)); toast.success('Acceptée !') }
    catch { toast.error('Erreur') }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-6 h-6 border-2 border-[#0f0f0f] border-t-transparent rounded-full animate-spin" /></div>

  const enAttente = demandes.filter(d => d.statut === 'en_attente')
  const enCours = demandes.filter(d => ['acceptee','en_cours'].includes(d.statut))

  return (
    <div className="space-y-7 max-w-2xl">
      <div className="fade-up">
        <h1 className="text-3xl font-bold text-[#0f0f0f] tracking-tight">
          {user?.role === 'pair' ? 'Espace pair-aidant' : 'Espace professionnel'}
        </h1>
        <p className="text-[#999] text-sm mt-1">{enAttente.length} en attente · {enCours.length} en cours</p>
      </div>

      <div className="grid grid-cols-3 gap-3 fade-up d1">
        {[
          { icon: Clock, label:'En attente', val:enAttente.length, bg:'bg-[#fefbf0]', text:'text-[#7a5c00]' },
          { icon: Activity, label:'En cours', val:enCours.length, bg:'bg-[#f0faf0]', text:'text-[#1a7a1a]' },
          { icon: CheckCircle, label:'Total', val:demandes.length, bg:'bg-[#fafafa]', text:'text-[#666]' },
        ].map(s => (
          <div key={s.label} className={`card ${s.bg} border-0`}>
            <s.icon className={`w-4 h-4 ${s.text} mb-3`} />
            <p className={`text-2xl font-bold ${s.text}`}>{s.val}</p>
            <p className="text-xs text-[#999] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {enAttente.length > 0 && (
        <div className="space-y-2 fade-up d2">
          <p className="text-xs font-semibold text-[#aaa] uppercase tracking-widest">En attente</p>
          {enAttente.map((d, i) => (
            <div key={d._id} className="card border-l-2 border-l-[#f59e0b] fade-up" style={{ animationDelay:`${i*0.05}s` }}>
              <div className="flex items-start gap-4">
                <span className="text-xl mt-0.5 shrink-0">{d.type === 'pair' ? '🤝' : '🩺'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {d.estUrgent && <span className="badge-red">Urgent</span>}
                    <span className="text-xs text-[#999]">
                      {d.etudiant?.estAnonyme !== false ? '🔒 Anonyme' : d.etudiant?.prenom}
                      {d.etudiant?.filiere && ` · ${d.etudiant.filiere}`}
                    </span>
                  </div>
                  <p className="text-sm text-[#444] leading-relaxed">{d.description}</p>
                  <p className="text-xs text-[#bbb] mt-1.5">
                    {new Date(d.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' })}
                  </p>
                </div>
                <button onClick={() => accepter(d._id)} className="btn-primary btn-sm shrink-0">Accepter</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {enCours.length > 0 && (
        <div className="space-y-2 fade-up d3">
          <p className="text-xs font-semibold text-[#aaa] uppercase tracking-widest">En cours</p>
          {enCours.map((d, i) => (
            <Link key={d._id} to={`/chat/${d._id}`} className="card-hover flex items-center gap-3 fade-up" style={{ animationDelay:`${i*0.05}s` }}>
              <span className="text-xl shrink-0">{d.type === 'pair' ? '🤝' : '🩺'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="badge-green">En cours</span>
                  {d.estUrgent && <span className="badge-red">Urgent</span>}
                </div>
                <p className="text-sm text-[#444] truncate">{d.description}</p>
                <p className="text-xs text-[#bbb] mt-0.5">{d.messages?.length || 0} message(s)</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#ccc] shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {demandes.length === 0 && (
        <div className="card flex flex-col items-center py-16 text-center fade-up">
          <span className="text-4xl mb-3">✅</span>
          <p className="font-medium text-[#0f0f0f]">Tout est à jour</p>
          <p className="text-sm text-[#999] mt-1">Aucune demande en attente</p>
        </div>
      )}
    </div>
  )
}
