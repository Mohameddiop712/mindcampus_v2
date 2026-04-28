import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Brain, Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

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
      toast.success(`Bienvenue ${user.prenom} !`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants incorrects')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex w-[45%] bg-[#0f0f0f] flex-col justify-between p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-[#0f0f0f]" />
          </div>
          <span className="text-white font-semibold">MindCampus</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-[#666] text-sm font-medium uppercase tracking-widest">Soutien étudiant</p>
            <h1 className="text-white text-4xl font-bold leading-tight tracking-tight">
              Votre bien-être<br />commence ici.
            </h1>
            <p className="text-[#888] text-base leading-relaxed max-w-sm">
              Une plateforme confidentielle pour suivre votre humeur, recevoir des recommandations et vous connecter avec des professionnels.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {[
              { num: '01', label: 'Suivi de l\'humeur quotidien' },
              { num: '02', label: 'Recommandations personnalisées' },
              { num: '03', label: 'Chat anonyme avec un pair-aidant' },
              { num: '04', label: 'Prise de RDV avec un professionnel' },
            ].map(f => (
              <div key={f.num} className="flex items-center gap-3">
                <span className="text-[#333] text-xs font-mono">{f.num}</span>
                <span className="text-[#888] text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#444] text-xs">© 2025 MindCampus · Confidentiel & sécurisé</p>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[360px] fade-up">
          <div className="mb-8">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-7 h-7 bg-[#0f0f0f] rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm">MindCampus</span>
            </div>
            <h2 className="text-2xl font-bold text-[#0f0f0f] tracking-tight">Connexion</h2>
            <p className="text-[#999] text-sm mt-1">Accédez à votre espace personnel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="vous@email.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <input className="input pr-10" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  value={form.motDePasse} onChange={e => setForm({ ...form, motDePasse: e.target.value })} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#666]">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? <span className="spinner" /> : <>Continuer <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#f0f0f0]">
            <p className="text-sm text-[#999] text-center">
              Pas de compte ?{' '}
              <Link to="/register" className="text-[#0f0f0f] font-medium hover:underline">Créer un compte</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
