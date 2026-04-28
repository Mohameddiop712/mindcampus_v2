import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Brain, LayoutDashboard, Heart, Lightbulb, MessageCircle, Calendar, LogOut, Users, Sparkles } from 'lucide-react'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  const nav = user?.role === 'etudiant' ? [
    { to:'/', icon:LayoutDashboard, label:'Dashboard' },
    { to:'/humeur', icon:Heart, label:'Mon Humeur' },
    { to:'/recommandations', icon:Lightbulb, label:'Recommandations' },
    { to:'/demandes', icon:MessageCircle, label:"Demande d'aide" },
    { to:'/rendezvous', icon:Calendar, label:'Rendez-vous' },
  ] : [
    { to:'/', icon:LayoutDashboard, label:'Dashboard' },
    { to:'/pair-dashboard', icon:Users, label:'Demandes' },
    { to:'/rendezvous', icon:Calendar, label:'Rendez-vous' },
  ]

  return (
    <div className="flex min-h-screen" style={{background:'#f0f4ff'}}>
      {/* Sidebar */}
      <aside className="w-[240px] flex flex-col fixed h-full z-20" style={{background:'linear-gradient(180deg,#1e1b4b 0%,#312e81 60%,#1e1b4b 100%)'}}>
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">MindCampus</p>
              <p className="text-indigo-300 text-[10px] mt-0.5">Soutien étudiant</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-indigo-400 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3">Navigation</p>
          {nav.map(({ to, icon:Icon, label }) => (
            <NavLink key={to} to={to} end={to==='/'}
              className={({ isActive }) => isActive
                ? 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-white/15 border border-white/20 shadow-sm'
                : 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-200 hover:text-white hover:bg-white/10 transition-all'
              }>
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive?'text-indigo-300':''}`} />
                  <span>{label}</span>
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/8 mb-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.prenom} {user?.nom}</p>
              <p className="text-indigo-300 text-[10px] capitalize">{user?.role}</p>
            </div>
            <button onClick={handleLogout} title="Déconnexion" className="text-indigo-300 hover:text-red-400 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-[240px] min-h-screen">
        {/* Topbar */}
        <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-indigo-100/50 px-8 py-3.5 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">Connexion sécurisée</span>
          </div>
        </div>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
