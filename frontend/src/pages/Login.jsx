import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Brain, Eye, EyeOff, Sparkles, Shield, Heart, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const features = [
  { icon: Heart, label: 'Suivi humeur quotidien', color: 'text-teal-400' },
  { icon: Sparkles, label: 'Recommandations IA', color: 'text-violet-400' },
  { icon: MessageCircle, label: 'Chat pair-aidant', color: 'text-blue-400' },
  { icon: Shield, label: '100% anonyme & sécurisé', color: 'text-emerald-400' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', motDePasse: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const user = await login(form.email, form.motDePasse)
      toast.success(`Bienvenue ${user.prenom} ! 👋`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-[48%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#0f172a 0%,#1a2744 60%,#0f2a35 100%)' }}>

        {/* BG decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #0d9488, transparent)' }} />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">MindCampus</span>
          </div>

          <div className="space-y-2 mb-10">
            <p className="text-teal-400 text-sm font-semibold tracking-wide uppercase">Soutien psychologique</p>
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Votre bien-être,<br />
              <span style={{ background: 'linear-gradient(90deg,#0d9488,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                notre priorité
              </span>
            </h1>
            <p className="text-slate-400 text-base mt-4 max-w-sm leading-relaxed">
              Une plateforme moderne, anonyme et bienveillante pour accompagner les étudiants au quotidien.
            </p>
          </div>

          <div className="space-y-3">
            {features.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-sm text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(13,148,136,0.12)', border: '1px solid rgba(13,148,136,0.2)' }}>
            <Shield className="w-4 h-4 text-teal-400" />
            <p className="text-sm text-teal-300">Données chiffrées · Anonymat garanti · RGPD</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#f8fafc]">
        <div className="w-full max-w-[400px] animate-fade-up">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">MindCampus</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Bon retour 👋</h2>
            <p className="text-gray-500 text-sm mt-1">Connectez-vous à votre espace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Adresse email</label>
              <input className="input" type="email" placeholder="vous@email.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <input className="input pr-12" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  value={form.motDePasse} onChange={e => setForm({ ...form, motDePasse: e.target.value })} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2"
              style={{ background: loading ? '#0d9488' : 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
              {loading ? <span className="spinner" /> : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">
                Créer un compte →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
