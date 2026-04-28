import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Brain, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom:'', prenom:'', email:'', motDePasse:'', role:'etudiant', filiere:'', specialite:'' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      await register(form)
      toast.success('Compte créé !')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-[420px] fade-up">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-[#0f0f0f] rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm text-[#0f0f0f]">MindCampus</span>
        </div>

        <div className="mb-7">
          <h2 className="text-2xl font-bold text-[#0f0f0f] tracking-tight">Créer un compte</h2>
          <p className="text-[#999] text-sm mt-1">Rejoignez MindCampus gratuitement</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role */}
          <div>
            <label className="label">Je suis</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v:'etudiant', emoji:'🎓', label:'Étudiant' },
                { v:'pair', emoji:'🤝', label:'Pair-aidant' },
                { v:'professionnel', emoji:'🩺', label:'Professionnel' },
              ].map(r => (
                <button key={r.v} type="button" onClick={() => setForm({ ...form, role: r.v })}
                  className={`p-3 rounded-lg border text-center transition-all ${form.role === r.v ? 'border-[#0f0f0f] bg-[#0f0f0f]' : 'border-[#e8e8e8] bg-white hover:border-[#ccc]'}`}>
                  <div className="text-lg mb-0.5">{r.emoji}</div>
                  <p className={`text-[11px] font-medium ${form.role === r.v ? 'text-white' : 'text-[#666]'}`}>{r.label}</p>
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
            <div className="fade-up">
              <label className="label">Filière</label>
              <input className="input" placeholder="Ex : Informatique, Médecine..." value={form.filiere} onChange={e => setForm({ ...form, filiere: e.target.value })} />
            </div>
          )}
          {form.role === 'professionnel' && (
            <div className="fade-up">
              <label className="label">Spécialité</label>
              <input className="input" placeholder="Ex : Psychologue..." value={form.specialite} onChange={e => setForm({ ...form, specialite: e.target.value })} />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? <span className="spinner" /> : <>Créer mon compte <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-[#f0f0f0] text-center">
          <p className="text-sm text-[#999]">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-[#0f0f0f] font-medium hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
