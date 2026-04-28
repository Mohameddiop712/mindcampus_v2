import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Brain, Eye, EyeOff, Shield, Heart, MessageCircle, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email:'', motDePasse:'' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const user = await login(form.email, form.motDePasse)
      toast.success(`Bienvenue ${user.prenom} ! 👋`)
      navigate('/')
    } catch (err) { toast.error(err.response?.data?.message || 'Identifiants incorrects')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-[48%] flex-col justify-between p-12 relative overflow-hidden" style={{background:'linear-gradient(145deg,#1e1b4b,#312e81,#4c1d95)'}}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20" style={{background:'radial-gradient(circle,#818cf8,transparent)'}} />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-15" style={{background:'radial-gradient(circle,#a78bfa,transparent)'}} />
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'radial-gradient(#fff 1px,transparent 1px)',backgroundSize:'28px 28px'}} />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-lg">MindCampus</span>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <p className="text-indigo-300 text-sm font-semibold tracking-wide uppercase mb-3">Soutien psychologique</p>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Votre bien-être,<br />
              <span style={{background:'linear-gradient(90deg,#a5b4fc,#c4b5fd)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                notre priorité.
              </span>
            </h1>
            <p className="text-indigo-200 text-base leading-relaxed">Une plateforme moderne, anonyme et bienveillante pour les étudiants.</p>
          </div>

          <div className="space-y-3">
            {[
              { icon:Heart, label:'Suivi de l\'humeur quotidien', color:'text-pink-400' },
              { icon:Sparkles, label:'Recommandations personnalisées', color:'text-amber-400' },
              { icon:MessageCircle, label:'Chat pair-aidant anonyme', color:'text-emerald-400' },
              { icon:Shield, label:'100% sécurisé & confidentiel', color:'text-sky-400' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)'}}>
                <f.icon className={`w-4 h-4 ${f.color} shrink-0`} />
                <span className="text-indigo-100 text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-indigo-400 text-xs">© 2025 MindCampus · Données chiffrées · RGPD</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8" style={{background:'linear-gradient(135deg,#f0f4ff,#faf5ff)'}}>
        <div className="w-full max-w-[400px] fade-up">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">MindCampus</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Bon retour 👋</h2>
            <p className="text-gray-500 text-sm mt-1">Connectez-vous à votre espace</p>
          </div>

          <div className="card shadow-lg" style={{boxShadow:'0 8px 40px rgba(99,102,241,0.12)'}}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Adresse email</label>
                <input className="input" type="email" placeholder="vous@email.com"
                  value={form.email} onChange={e => setForm({...form,email:e.target.value})} required />
              </div>
              <div>
                <label className="label">Mot de passe</label>
                <div className="relative">
                  <input className="input pr-11" type={showPass?'text':'password'} placeholder="••••••••"
                    value={form.motDePasse} onChange={e => setForm({...form,motDePasse:e.target.value})} required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
                {loading ? <span className="spinner"/> : 'Se connecter →'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Pas de compte ?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
