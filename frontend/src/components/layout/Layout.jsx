import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Brain, LayoutDashboard, Heart, Lightbulb, MessageCircle, Calendar, LogOut, Users, ChevronRight } from 'lucide-react'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  const nav = user?.role === 'etudiant' ? [
    { to: '/', icon: LayoutDashboard, label: 'Accueil' },
    { to: '/humeur', icon: Heart, label: 'Mon Humeur' },
    { to: '/recommandations', icon: Lightbulb, label: 'Recommandations' },
    { to: '/demandes', icon: MessageCircle, label: "Demande d'aide" },
    { to: '/rendezvous', icon: Calendar, label: 'Rendez-vous' },
  ] : [
    { to: '/', icon: LayoutDashboard, label: 'Accueil' },
    { to: '/pair-dashboard', icon: Users, label: 'Demandes' },
    { to: '/rendezvous', icon: Calendar, label: 'Rendez-vous' },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-[220px] flex flex-col fixed h-full bg-[#fafafa] border-r border-[#f0f0f0] z-20">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#0f0f0f] rounded-lg flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[#0f0f0f] text-sm tracking-tight">MindCampus</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-[#bbb] uppercase tracking-widest px-2 mb-2">Menu</p>
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => isActive
                ? 'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-[#0f0f0f] bg-white border border-[#e8e8e8] shadow-xs'
                : 'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-[#666] hover:text-[#0f0f0f] hover:bg-white transition-all'
              }>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-[#f0f0f0]">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white transition-all group">
            <div className="w-7 h-7 rounded-lg bg-[#0f0f0f] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[#0f0f0f] truncate">{user?.prenom} {user?.nom}</p>
              <p className="text-[10px] text-[#999] capitalize">{user?.role}</p>
            </div>
            <button onClick={handleLogout} title="Déconnexion"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-[#999] hover:text-[#ff4444]">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-[220px] min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
