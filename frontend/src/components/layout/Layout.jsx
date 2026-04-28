import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Brain, LayoutDashboard, Heart, Lightbulb, MessageCircle, Calendar, LogOut, Users, Menu, X } from 'lucide-react'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
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

  const NavContent = () => (
    <>
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shrink-0" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">MindCampus</p>
            <p className="text-indigo-300 text-[10px] mt-0.5">Soutien étudiant</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">Navigation</p>
        {nav.map(({ to, icon:Icon, label }) => (
          <NavLink key={to} to={to} end={to==='/'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => isActive
              ? 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-white/15 border border-white/20'
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

      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{background:'rgba(255,255,255,0.06)'}}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.prenom} {user?.nom}</p>
            <p className="text-indigo-300 text-[10px] capitalize">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="text-indigo-300 hover:text-red-400 transition-colors shrink-0">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen" style={{background:'#f0f4ff'}}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[240px] flex-col fixed h-full z-20" style={{background:'linear-gradient(180deg,#1e1b4b 0%,#312e81 60%,#1e1b4b 100%)'}}>
        <NavContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[260px] flex flex-col z-50" style={{background:'linear-gradient(180deg,#1e1b4b 0%,#312e81 60%,#1e1b4b 100%)'}}>
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-[240px] min-h-screen flex flex-col">
        {/* Topbar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 lg:px-8 py-3.5 border-b border-indigo-100/50" style={{background:'rgba(240,244,255,0.85)',backdropFilter:'blur(20px)'}}>
          <button onClick={() => setMobileOpen(true)} className="lg:hidden w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
            <Menu className="w-4 h-4 text-gray-600" />
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm text-gray-900">MindCampus</span>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 hidden sm:block">Connexion sécurisée</span>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
