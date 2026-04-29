import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  Users, Heart, MessageCircle, Calendar, ShieldCheck, ShieldX,
  Eye, Trash2, Clock, CheckCircle, XCircle, BarChart3, RefreshCw,
  UserCog, ToggleLeft, ToggleRight, ChevronDown
} from 'lucide-react'

const roleColor  = { etudiant:'badge-blue', pair:'badge-purple', professionnel:'badge-green', admin:'badge-gray' }
const roleEmoji  = { etudiant:'🎓', pair:'🤝', professionnel:'🩺', admin:'⚙️' }
const statutColor = { non_soumis:'badge-gray', en_attente:'badge-yellow', approuve:'badge-green', rejete:'badge-red' }
const statutLabel = { non_soumis:'—', en_attente:'En attente', approuve:'Approuvé', rejete:'Rejeté' }

export default function AdminDashboard() {
  const [stats, setStats]             = useState(null)
  const [users, setUsers]             = useState([])
  const [verifications, setVerifs]    = useState([])
  const [tab, setTab]                 = useState('stats')
  const [loading, setLoading]         = useState(true)
  const [carteModal, setCarteModal]   = useState(null)
  const [roleMenu, setRoleMenu]       = useState(null) // id de l'user dont le menu est ouvert

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [s, u, v] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/verifications'),
      ])
      setStats(s.data); setUsers(u.data); setVerifs(v.data)
    } catch { toast.error('Erreur chargement') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  const approuver = async (id) => {
    try { await axios.put(`/api/admin/users/${id}/approuver`); toast.success('✅ Approuvé !'); fetchAll() }
    catch { toast.error('Erreur') }
  }
  const rejeter = async (id) => {
    try { await axios.put(`/api/admin/users/${id}/rejeter`); toast.success('❌ Rejeté'); fetchAll() }
    catch { toast.error('Erreur') }
  }
  const supprimer = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return
    try { await axios.delete(`/api/admin/users/${id}`); toast.success('Supprimé'); fetchAll() }
    catch { toast.error('Erreur') }
  }
  const changerRole = async (id, role) => {
    try {
      await axios.put(`/api/admin/users/${id}/role`, { role })
      toast.success(`Rôle changé en ${role} ✅`)
      setRoleMenu(null); fetchAll()
    } catch { toast.error('Erreur') }
  }
  const toggleCompte = async (id) => {
    try {
      const res = await axios.put(`/api/admin/users/${id}/toggle`)
      toast.success(res.data.disponible ? 'Compte activé ✅' : 'Compte désactivé ⛔')
      fetchAll()
    } catch { toast.error('Erreur') }
  }
  const voirCarte = async (id) => {
    try {
      const res = await axios.get(`/api/admin/users/${id}/carte`)
      setCarteModal(res.data)
    } catch { toast.error('Erreur chargement carte') }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  const tabs = [
    { id:'stats', label:'Tableau de bord', icon:BarChart3 },
    { id:'verifications', label:`Vérifications${verifications.length>0?` (${verifications.length})`:''}`, icon:ShieldCheck },
    { id:'users', label:'Utilisateurs', icon:Users },
  ]

  return (
    <div className="space-y-6 max-w-5xl" onClick={() => setRoleMenu(null)}>
      {/* Header */}
      <div className="flex items-start justify-between fade-up">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">⚙️ Espace Administrateur</h1>
          <p className="text-gray-400 text-sm mt-1">Gestion complète de la plateforme MindCampus</p>
        </div>
        <button onClick={fetchAll} className="btn-secondary gap-2">
          <RefreshCw className="w-4 h-4"/> Actualiser
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl fade-up d1 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${tab===t.id?'bg-white text-gray-900 shadow-sm':'text-gray-500 hover:text-gray-700'}`}>
            <t.icon className="w-4 h-4"/> {t.label}
          </button>
        ))}
      </div>

      {/* ── STATS ── */}
      {tab==='stats' && stats && (
        <div className="space-y-5 fade-up">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon:Users, label:'Utilisateurs', val:stats.totalUsers, grad:'linear-gradient(135deg,#6366f1,#8b5cf6)' },
              { icon:Heart, label:'Humeurs', val:stats.totalHumeurs, grad:'linear-gradient(135deg,#ec4899,#f43f5e)' },
              { icon:MessageCircle, label:'Demandes', val:stats.totalDemandes, grad:'linear-gradient(135deg,#0d9488,#059669)' },
              { icon:Calendar, label:'Rendez-vous', val:stats.totalRDV, grad:'linear-gradient(135deg,#f59e0b,#ef4444)' },
            ].map(s => (
              <div key={s.label} className="card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10 -translate-y-4 translate-x-4" style={{background:s.grad}}/>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background:s.grad}}>
                  <s.icon className="w-5 h-5 text-white"/>
                </div>
                <p className="text-3xl font-extrabold text-gray-900">{s.val}</p>
                <p className="text-sm text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Répartition */}
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500"/> Répartition des utilisateurs
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label:'Étudiants', val:stats.parRole.etudiants, emoji:'🎓', color:'#6366f1' },
                { label:'Pair-aidants', val:stats.parRole.pairs, emoji:'🤝', color:'#8b5cf6' },
                { label:'Professionnels', val:stats.parRole.professionnels, emoji:'🩺', color:'#0d9488' },
                { label:'Admins', val:stats.parRole.admins, emoji:'⚙️', color:'#6b7280' },
              ].map(r => (
                <div key={r.label} className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-3xl mb-2">{r.emoji}</div>
                  <p className="text-2xl font-extrabold" style={{color:r.color}}>{r.val}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.label}</p>
                </div>
              ))}
            </div>
          </div>

          {stats.enAttente > 0 && (
            <div className="p-4 rounded-2xl flex items-center gap-4" style={{background:'linear-gradient(135deg,#fffbeb,#fef3c7)',border:'1px solid #fde68a'}}>
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-amber-600"/>
              </div>
              <div className="flex-1">
                <p className="font-bold text-amber-800">{stats.enAttente} vérification(s) en attente</p>
                <p className="text-xs text-amber-600 mt-0.5">Des aidants attendent votre validation</p>
              </div>
              <button onClick={() => setTab('verifications')} className="px-4 py-2 rounded-xl text-amber-700 text-sm font-bold" style={{background:'#fde68a'}}>
                Voir →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── VÉRIFICATIONS ── */}
      {tab==='verifications' && (
        <div className="space-y-3 fade-up">
          {verifications.length===0 ? (
            <div className="card flex flex-col items-center py-16 text-center" style={{background:'linear-gradient(135deg,#f0fdf4,#dcfce7)',border:'1px solid #bbf7d0'}}>
              <CheckCircle className="w-12 h-12 text-emerald-400 mb-3"/>
              <p className="font-bold text-gray-800">Tout est vérifié !</p>
              <p className="text-gray-500 text-sm mt-1">Aucune vérification en attente</p>
            </div>
          ) : verifications.map((u,i) => (
            <div key={u._id} className="card fade-up" style={{animationDelay:`${i*0.05}s`,borderLeft:'3px solid #f59e0b'}}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{background:'linear-gradient(135deg,#fef3c7,#fde68a)'}}>
                  {roleEmoji[u.role]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold text-gray-900">{u.prenom} {u.nom}</p>
                    <span className={roleColor[u.role]}>{u.role}</span>
                    <span className={statutColor[u.statutVerification]}>{statutLabel[u.statutVerification]}</span>
                  </div>
                  <p className="text-sm text-gray-500">{u.email}</p>
                  {u.specialite && <p className="text-xs text-gray-400 mt-0.5">Spécialité : {u.specialite}</p>}
                  <p className="text-xs text-gray-400 mt-0.5">Inscrit le {new Date(u.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => voirCarte(u._id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                    <Eye className="w-3.5 h-3.5"/> Voir carte
                  </button>
                  <button onClick={() => approuver(u._id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                    <ShieldCheck className="w-3.5 h-3.5"/> Approuver
                  </button>
                  <button onClick={() => rejeter(u._id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100">
                    <ShieldX className="w-3.5 h-3.5"/> Rejeter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── USERS ── */}
      {tab==='users' && (
        <div className="space-y-2 fade-up">
          <p className="text-xs text-gray-400 mb-3">{users.length} utilisateur(s) au total</p>
          {users.map((u,i) => (
            <div key={u._id} className={`card flex items-center gap-4 py-3 fade-up ${!u.disponible?'opacity-50':''}`}
              style={{animationDelay:`${i*0.03}s`}}>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{background:'linear-gradient(135deg,#e0e7ff,#c7d2fe)'}}>
                {roleEmoji[u.role]}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900 text-sm">{u.prenom} {u.nom}</p>
                  <span className={roleColor[u.role]}>{u.role}</span>
                  {!u.disponible && <span className="badge-red">Désactivé</span>}
                  {(u.role==='pair'||u.role==='professionnel') && (
                    <span className={statutColor[u.statutVerification]}>{statutLabel[u.statutVerification]}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{u.email}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>

                {/* Changer rôle */}
                <div className="relative">
                  <button onClick={() => setRoleMenu(roleMenu===u._id ? null : u._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors">
                    <UserCog className="w-3.5 h-3.5"/> Rôle <ChevronDown className="w-3 h-3"/>
                  </button>
                  {roleMenu===u._id && (
                    <div className="absolute right-0 top-8 z-50 bg-white border border-gray-100 rounded-2xl shadow-xl p-1 min-w-[150px]">
                      {['etudiant','pair','professionnel','admin'].map(r => (
                        <button key={r} onClick={() => changerRole(u._id, r)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${u.role===r?'bg-indigo-50 text-indigo-700':'text-gray-600 hover:bg-gray-50'}`}>
                          {roleEmoji[r]} {r}
                          {u.role===r && <CheckCircle className="w-3 h-3 ml-auto text-indigo-500"/>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Voir carte */}
                {(u.role==='pair'||u.role==='professionnel') && u.carteIdentite && (
                  <button onClick={() => voirCarte(u._id)} className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center transition-colors" title="Voir carte">
                    <Eye className="w-3.5 h-3.5 text-indigo-600"/>
                  </button>
                )}

                {/* Approuver/Rejeter */}
                {u.statutVerification==='en_attente' && (
                  <>
                    <button onClick={() => approuver(u._id)} className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center transition-colors" title="Approuver">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600"/>
                    </button>
                    <button onClick={() => rejeter(u._id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors" title="Rejeter">
                      <XCircle className="w-3.5 h-3.5 text-red-500"/>
                    </button>
                  </>
                )}

                {/* Activer/Désactiver */}
                <button onClick={() => toggleCompte(u._id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{background:u.disponible?'#f0fdf4':'#fff1f2'}}
                  title={u.disponible?'Désactiver':'Activer'}>
                  {u.disponible
                    ? <ToggleRight className="w-4 h-4 text-emerald-500"/>
                    : <ToggleLeft className="w-4 h-4 text-red-400"/>
                  }
                </button>

                {/* Supprimer */}
                <button onClick={() => supprimer(u._id)} className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-red-50 flex items-center justify-center transition-colors" title="Supprimer">
                  <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500"/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal carte */}
      {carteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.7)'}}>
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900">Carte d'identité</h3>
                <p className="text-sm text-gray-500">{carteModal.prenom} {carteModal.nom} · {carteModal.role}</p>
              </div>
              <button onClick={() => setCarteModal(null)} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-gray-500"/>
              </button>
            </div>
            {carteModal.carteIdentite ? (
              <img src={carteModal.carteIdentite} alt="Carte" className="w-full rounded-2xl object-contain max-h-80"/>
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-400 bg-gray-50 rounded-2xl">Aucune carte soumise</div>
            )}
            <div className="flex gap-3 mt-4">
              <button onClick={() => { approuver(carteModal._id); setCarteModal(null) }} className="btn-primary flex-1 py-2.5">
                <ShieldCheck className="w-4 h-4"/> Approuver
              </button>
              <button onClick={() => { rejeter(carteModal._id); setCarteModal(null) }} className="btn-danger flex-1 py-2.5">
                <ShieldX className="w-4 h-4"/> Rejeter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
