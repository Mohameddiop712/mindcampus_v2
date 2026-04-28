import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import AIWidget from './components/common/AIWidget'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Humeur from './pages/Humeur'
import Recommandations from './pages/Recommandations'
import DemandesAide from './pages/DemandesAide'
import Chat from './pages/Chat'
import RendezVous from './pages/RendezVous'
import PairDashboard from './pages/PairDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Ressources from './pages/Ressources'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#f0f4ff'}}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Chargement...</p>
      </div>
    </div>
  )
  return user ? children : <Navigate to="/login" />
}

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'admin') return <Navigate to="/" />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/ressources" element={<Ressources />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="humeur" element={<Humeur />} />
          <Route path="recommandations" element={<Recommandations />} />
          <Route path="demandes" element={<DemandesAide />} />
          <Route path="chat/:demandeId" element={<Chat />} />
          <Route path="rendezvous" element={<RendezVous />} />
          <Route path="pair-dashboard" element={<PairDashboard />} />
          <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <AIWidget />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', fontFamily: 'Inter', fontSize: '14px' }
        }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
