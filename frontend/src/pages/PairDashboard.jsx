import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { ChevronRight, Clock, Activity, CheckCircle, AlertCircle, Users } from 'lucide-react'

export default function PairDashboard() {
  const { user } = useAuth()
  const [demandes, setDemandes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { axios.get('/api/demandes/assignees').then(r => setDemandes(r.data)).catch(console.error).finally(() => setLoading(false)) }, [])

  const accepter = async (id) => {
    try { const res = await axios.put(`/api/demandes/${id}/accepter`); setDemandes(demandes.map(d => d._id===id?res.data:d)); toast.success('Demande acceptée !') }
    catch { toast.error('Erreur') }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-indigo-500 border-t-transparent rounded-full animate-spin" style={{borderWidth:'3px',borderStyle:'solid'}}/></div>

  const enAttente = demandes.filter(d => d.statut==='en_attente')
  const enCours = demandes.filter(d => ['acceptee','en_cours'].includes(d.statut))

  return (
    <div className="space-y-7 max-w-2xl">
      <div className="fade-up">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-500"/>{user?.role==='pair'?'Espace pair-aidant':'Espace professionnel'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{enAttente.length} en attente · {enCours.length} en cours</p>
      </div>

      <div className="grid grid-cols-3 gap-4 fade-up d1">
        {[
          { icon:Clock, label:'En attente', val:enAttente.length, grad:'linear-gradient(135deg,#fef3c7,#fde68a)', text:'text-amber-700' },
          { icon:Activity, label:'En cours', val:enCours.length, grad:'linear-gradient(135deg,#d1fae5,#a7f3d0)', text:'text-emerald-700' },
          { icon:CheckCircle, label:'Total reçues', val:demandes.length, grad:'linear-gradient(135deg,#e0e7ff,#c7d2fe)', text:'text-indigo-700' },
        ].map(s => (
          <div key={s.label} className="card" style={{background:s.grad,border:'none',boxShadow:'0 2px 15px rgba(0,0,0,0.06)'}}>
            <s.icon className={`w-5 h-5 ${s.text} mb-3`}/>
            <p className={`text-3xl font-extrabold ${s.text}`}>{s.val}</p>
            <p className="text-xs text-gray-600 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {enAttente.length > 0 && (
        <div className="space-y-3 fade-up d2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">En attente</p>
          {enAttente.map((d,i) => (
            <div key={d._id} className="card fade-up" style={{animationDelay:`${i*0.05}s`,borderLeft:'3px solid #f59e0b',boxShadow:'0 2px 15px rgba(245,158,11,0.10)'}}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{background:'linear-gradient(135deg,#fef3c7,#fde68a)'}}>{d.type==='pair'?'🤝':'🩺'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {d.estUrgent && <span className="badge-red flex items-center gap-1"><AlertCircle className="w-3 h-3"/>Urgent</span>}
                    <span className="text-xs text-gray-500 font-medium">{d.etudiant?.estAnonyme!==false?'🔒 Anonyme':d.etudiant?.prenom}{d.etudiant?.filiere&&` · ${d.etudiant.filiere}`}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{d.description}</p>
                  <p className="text-xs text-gray-400 mt-1.5">{new Date(d.createdAt).toLocaleDateString('fr-FR',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})}</p>
                </div>
                <button onClick={() => accepter(d._id)} className="btn-primary btn-sm shrink-0">Accepter →</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {enCours.length > 0 && (
        <div className="space-y-3 fade-up d3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">En cours</p>
          {enCours.map((d,i) => (
            <Link key={d._id} to={`/chat/${d._id}`} className="card-hover flex items-center gap-4 fade-up" style={{animationDelay:`${i*0.05}s`}}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{background:'linear-gradient(135deg,#d1fae5,#a7f3d0)'}}>{d.type==='pair'?'🤝':'🩺'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5"><span className="badge-green">En cours</span>{d.estUrgent&&<span className="badge-red">Urgent</span>}</div>
                <p className="text-sm text-gray-700 truncate font-medium">{d.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">{d.messages?.length||0} message(s)</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0"/>
            </Link>
          ))}
        </div>
      )}

      {demandes.length===0 && (
        <div className="card flex flex-col items-center py-16 text-center fade-up" style={{background:'linear-gradient(135deg,#f0fdf4,#dcfce7)',border:'1px solid #bbf7d0'}}>
          <div className="text-5xl mb-4">✅</div>
          <p className="font-bold text-gray-800">Tout est à jour !</p>
          <p className="text-sm text-gray-500 mt-1">Aucune demande en attente</p>
        </div>
      )}
    </div>
  )
}
