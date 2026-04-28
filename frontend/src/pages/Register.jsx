import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Brain, ArrowRight, GraduationCap, Heart, Stethoscope } from 'lucide-react'
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
    { v:'etudiant', icon:GraduationCap, label:'Étudiant', desc:'Suivre mon bien-être' },
    { v:'pair', icon:Heart, label:'Pair-aidant', desc:'Soutenir mes camarades' },
    { v:'professionnel', icon:Stethoscope, label:'Professionnel', desc:'Accompagner les étudiants' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background:'linear-gradient(135deg,#f0f4ff,#faf5ff)'}}>
      <div className="w-full max-w-[480px] fade-up">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">MindCampus</p>
            <p className="text-xs text-gray-400">Créer un compte</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-5" style={{boxShadow:'0 20px 60px rgba(99,102,241,0.15)'}}>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Rejoindre MindCampus</h2>
            <p className="text-gray-400 text-sm mt-0.5">Créez votre espace en quelques secondes</p>
          </div>

          {/* Role selector — FIXED: dark text visible on selected */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Je suis</p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => {
                const isSelected = form.role === r.v
                return (
                  <button key={r.v} type="button" onClick={() => setForm({...form,role:r.v})}
                    className={`p-3 rounded-2xl border-2 text-center transition-all duration-200 ${isSelected ? 'border-indigo-500 scale-[1.02] shadow-md' : 'border-gray-100 bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50'}`}
                    style={isSelected ? {background:'linear-gradient(135deg,#6366f1,#8b5cf6)'} : {}}>
                    <r.icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                    <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-700'}`}>{r.label}</p>
                    <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-gray-400'}`}>{r.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Prénom</label>
              <input className="input" placeholder="Aminata" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})} required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Nom</label>
              <input className="input" placeholder="Diallo" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} required />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
            <input className="input" type="email" placeholder="vous@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Mot de passe</label>
            <input className="input" type="password" placeholder="Minimum 6 caractères" value={form.motDePasse} onChange={e=>setForm({...form,motDePasse:e.target.value})} required />
          </div>

          {form.role==='etudiant' && (
            <div className="fade-up">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Filière</label>
              <input className="input" placeholder="Ex : Informatique, Médecine..." value={form.filiere} onChange={e=>setForm({...form,filiere:e.target.value})} />
            </div>
          )}
          {form.role==='professionnel' && (
            <div className="fade-up">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Spécialité</label>
              <input className="input" placeholder="Ex : Psychologue..." value={form.specialite} onChange={e=>setForm({...form,specialite:e.target.value})} />
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full py-3 rounded-2xl">
            {loading ? <span className="spinner"/> : <>Créer mon compte <ArrowRight className="w-4 h-4"/></>}
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
