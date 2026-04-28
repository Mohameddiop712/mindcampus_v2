import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Brain } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom:'',prenom:'',email:'',motDePasse:'',role:'etudiant',filiere:'',specialite:'' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try { await register(form); toast.success('Compte créé ! 🎉'); navigate('/')
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur')
    } finally { setLoading(false) }
  }

  const roles = [
    { v:'etudiant', emoji:'🎓', label:'Étudiant', desc:'Suivre mon bien-être', grad:'from-indigo-500 to-blue-500' },
    { v:'pair', emoji:'🤝', label:'Pair-aidant', desc:'Soutenir mes camarades', grad:'from-emerald-500 to-teal-500' },
    { v:'professionnel', emoji:'🩺', label:'Professionnel', desc:'Accompagner les étudiants', grad:'from-violet-500 to-purple-500' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{background:'linear-gradient(135deg,#f0f4ff,#faf5ff)'}}>
      <div className="w-full max-w-[480px] fade-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900">MindCampus</p>
            <p className="text-xs text-gray-500">Créer un compte</p>
          </div>
        </div>

        <div className="card" style={{boxShadow:'0 8px 40px rgba(99,102,241,0.12)'}}>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Rejoindre MindCampus</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role */}
            <div>
              <label className="label">Je suis</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(r => (
                  <button key={r.v} type="button" onClick={() => setForm({...form,role:r.v})}
                    className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${form.role===r.v ? 'border-transparent scale-[1.02] shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    style={form.role===r.v ? {background:`linear-gradient(135deg,${r.grad.split(' ')[1]},${r.grad.split(' ')[2]})`} : {}}>
                    <div className="text-xl mb-1">{r.emoji}</div>
                    <p className={`text-xs font-semibold ${form.role===r.v?'text-white':'text-gray-700'}`}>{r.label}</p>
                    <p className={`text-[10px] mt-0.5 ${form.role===r.v?'text-white/80':'text-gray-400'}`}>{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Prénom</label><input className="input" placeholder="Aminata" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})} required /></div>
              <div><label className="label">Nom</label><input className="input" placeholder="Diallo" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} required /></div>
            </div>
            <div><label className="label">Email</label><input className="input" type="email" placeholder="vous@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
            <div><label className="label">Mot de passe</label><input className="input" type="password" placeholder="Minimum 6 caractères" value={form.motDePasse} onChange={e=>setForm({...form,motDePasse:e.target.value})} required /></div>

            {form.role==='etudiant' && (
              <div className="fade-up"><label className="label">Filière</label><input className="input" placeholder="Ex : Informatique, Médecine..." value={form.filiere} onChange={e=>setForm({...form,filiere:e.target.value})} /></div>
            )}
            {form.role==='professionnel' && (
              <div className="fade-up"><label className="label">Spécialité</label><input className="input" placeholder="Ex : Psychologue..." value={form.specialite} onChange={e=>setForm({...form,specialite:e.target.value})} /></div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? <span className="spinner"/> : 'Créer mon compte →'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
