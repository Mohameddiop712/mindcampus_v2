import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Brain } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', motDePasse: '', role: 'etudiant', filiere: '', specialite: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      await register(form)
      toast.success('Bienvenue sur MindCampus ! 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'inscription")
    } finally { setLoading(false) }
  }

  const roles = [
    { v: 'etudiant', label: '🎓 Étudiant', desc: 'Suivre mon bien-être' },
    { v: 'pair', label: '🤝 Pair-aidant', desc: 'Soutenir mes camarades' },
    { v: 'professionnel', label: '🩺 Professionnel', desc: 'Accompagner les étudiants' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8fafc] bg-mesh">
      <div className="w-full max-w-[480px] animate-fade-up">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
            <Brain className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Créer mon compte</h2>
          <p className="text-gray-500 text-sm mt-1">Rejoignez la communauté MindCampus</p>
        </div>

        <div className="card shadow-lg border-0 space-y-5" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
          {/* Role selector */}
          <div>
            <label className="label">Je suis</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => (
                <button key={r.v} type="button" onClick={() => setForm({ ...form, role: r.v })}
                  className={`p-3 rounded-xl border-2 text-center transition-all text-left ${form.role === r.v ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                  <div className="text-lg mb-0.5">{r.label.split(' ')[0]}</div>
                  <p className="text-xs font-semibold text-gray-700">{r.label.split(' ').slice(1).join(' ')}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Prénom</label>
              <input className="input" placeholder="Aminata" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} required />
            </div>
            <div>
              <label className="label">Nom</label>
              <input className="input" placeholder="Diallo" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="vous@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div>
            <label className="label">Mot de passe</label>
            <input className="input" type="password" placeholder="Minimum 6 caractères" value={form.motDePasse} onChange={e => setForm({ ...form, motDePasse: e.target.value })} required />
          </div>

          {form.role === 'etudiant' && (
            <div className="animate-fade-up">
              <label className="label">Filière</label>
              <input className="input" placeholder="Ex : Informatique, Médecine, Droit..." value={form.filiere} onChange={e => setForm({ ...form, filiere: e.target.value })} />
            </div>
          )}
          {form.role === 'professionnel' && (
            <div className="animate-fade-up">
              <label className="label">Spécialité</label>
              <input className="input" placeholder="Ex : Psychologue, Médecin..." value={form.specialite} onChange={e => setForm({ ...form, specialite: e.target.value })} />
            </div>
          )}

          <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary w-full py-3 text-base"
            style={{ background: loading ? '#0d9488' : 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
            {loading ? <span className="spinner" /> : 'Créer mon compte →'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-teal-600 font-semibold hover:text-teal-700">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
