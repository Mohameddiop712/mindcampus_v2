import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Brain, LayoutDashboard, Heart, Lightbulb, MessageCircle, Calendar, LogOut, Users, Sparkles } from 'lucide-react'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  const etudiantNav = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/humeur', icon: Heart, label: 'Mon Humeur' },
    { to: '/recommandations', icon: Lightbulb, label: 'Recommandations' },
    { to: '/demandes', icon: MessageCircle, label: "Demande d'aide" },
    { to: '/rendezvous', icon: Calendar, label: 'Rendez-vous' },
  ]
  const aidantNav = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/pair-dashboard', icon: Users, label: 'Demandes' },
    { to: '/rendezvous', icon: Calendar, label: 'Rendez-vous' },
  ]
  const nav = user?.role === 'etudiant' ? etudiantNav : aidantNav

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* ── Sidebar ── */}
      <aside className="w-[240px] flex flex-col fixed h-full z-20" style={{ background: 'linear-gradient(180deg,#0f172a 0%,#1a2744 100%)' }}>

        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-base leading-none">MindCampus</span>
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-none">Soutien étudiant</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">Navigation</p>
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => isActive
                ? 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-teal-300 bg-teal-500/[0.12] border border-teal-500/20'
                : 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all'
              }>
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : ''}`} />
                  {label}
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User card */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.04]">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg,#0d9488,#7c3aed)' }}>
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.prenom} {user?.nom}</p>
              <p className="text-[10px] text-slate-500 capitalize">{user?.role}</p>
            </div>
            <button onClick={handleLogout} title="Déconnexion"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-all">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 ml-[240px] min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#f8fafc]/80 backdrop-blur-xl border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-500 font-medium">Connexion sécurisée</span>
          </div>
        </div>
        <div className="p-8 bg-mesh min-h-[calc(100vh-65px)]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
