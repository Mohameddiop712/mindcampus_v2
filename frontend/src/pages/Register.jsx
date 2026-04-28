import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Brain, ArrowRight, GraduationCap, Heart, Stethoscope, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom:'',prenom:'',email:'',motDePasse:'',confirmMotDePasse:'',role:'etudiant',filiere:'',specialite:'' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Validation email
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // Validation en temps réel
  const validate = () => {
    const e = {}
    if (!form.prenom.trim()) e.prenom = 'Prénom requis'
    if (!form.nom.trim()) e.nom = 'Nom requis'
    if (!form.email.trim()) e.email = 'Email requis'
    else if (!isValidEmail(form.email)) e.email = 'Format email invalide (ex: nom@domaine.com)'
    if (!form.motDePasse) e.motDePasse = 'Mot de passe requis'
    else if (form.motDePasse.length < 6) e.motDePasse = 'Minimum 6 caractères'
    if (!form.confirmMotDePasse) e.confirmMotDePasse = 'Confirmez votre mot de passe'
    else if (form.motDePasse !== form.confirmMotDePasse) e.confirmMotDePasse = 'Les mots de passe ne correspondent pas'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast.error('Corrigez les erreurs avant de continuer')
      return
    }
    setLoading(true)
    try {
      const { confirmMotDePasse, ...data } = form
      await register(data)
      toast.success('Compte créé ! 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription')
    } finally { setLoading(false) }
  }

  const Field = ({ name, children }) => (
    <div>
      {children}
      {errors[name] && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
          <XCircle className="w-3 h-3 shrink-0"/> {errors[name]}
        </p>
      )}
    </div>
  )

  const passMatch = form.confirmMotDePasse && form.motDePasse === form.confirmMotDePasse
  const passNoMatch = form.confirmMotDePasse && form.motDePasse !== form.confirmMotDePasse

  const roles = [
    { v:'etudiant', icon:GraduationCap, label:'Étudiant', desc:'Suivre mon bien-être' },
    { v:'pair', icon:Heart, label:'Pair-aidant', desc:'Soutenir mes camarades' },
    { v:'professionnel', icon:Stethoscope, label:'Professionnel', desc:'Accompagner les étudiants' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background:'linear-gradient(135deg,#f0f4ff,#faf5ff)'}}>
      <div className="w-full max-w-[480px] fade-up py-6">
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

        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4" style={{boxShadow:'0 20px 60px rgba(99,102,241,0.15)'}}>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Rejoindre MindCampus</h2>
            <p className="text-gray-400 text-sm mt-0.5">Créez votre espace en quelques secondes</p>
          </div>

          {/* Role selector */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Je suis</p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => {
                const isSelected = form.role === r.v
                return (
                  <button key={r.v} type="button"
                    onClick={() => setForm({...form, role:r.v})}
                    className={`p-3 rounded-2xl border-2 text-center transition-all duration-200 ${isSelected ? 'border-transparent scale-[1.02] shadow-md' : 'border-gray-100 bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50'}`}
                    style={isSelected ? {background:'linear-gradient(135deg,#6366f1,#8b5cf6)'} : {}}>
                    <r.icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                    <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-700'}`}>{r.label}</p>
                    <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-gray-400'}`}>{r.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Prénom + Nom */}
          <div className="grid grid-cols-2 gap-3">
            <Field name="prenom">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Prénom</p>
              <input
                className={`input ${errors.prenom ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : ''}`}
                placeholder="Aminata"
                value={form.prenom}
                onChange={e => { setForm({...form,prenom:e.target.value}); setErrors({...errors,prenom:''}) }}
              />
            </Field>
            <Field name="nom">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nom</p>
              <input
                className={`input ${errors.nom ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : ''}`}
                placeholder="Diallo"
                value={form.nom}
                onChange={e => { setForm({...form,nom:e.target.value}); setErrors({...errors,nom:''}) }}
              />
            </Field>
          </div>

          {/* Email */}
          <Field name="email">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</p>
            <div className="relative">
              <input
                className={`input pr-10 ${errors.email ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : form.email && isValidEmail(form.email) ? 'border-emerald-400 focus:ring-emerald-400/30' : ''}`}
                type="email"
                placeholder="vous@email.com"
                value={form.email}
                onChange={e => { setForm({...form,email:e.target.value}); setErrors({...errors,email:''}) }}
              />
              {form.email && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isValidEmail(form.email)
                    ? <CheckCircle className="w-4 h-4 text-emerald-500"/>
                    : <XCircle className="w-4 h-4 text-red-400"/>
                  }
                </div>
              )}
            </div>
          </Field>

          {/* Mot de passe */}
          <Field name="motDePasse">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mot de passe</p>
            <div className="relative">
              <input
                className={`input pr-10 ${errors.motDePasse ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : ''}`}
                type={showPass ? 'text' : 'password'}
                placeholder="Minimum 6 caractères"
                value={form.motDePasse}
                onChange={e => { setForm({...form,motDePasse:e.target.value}); setErrors({...errors,motDePasse:''}) }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
              </button>
            </div>
            {/* Barre de force */}
            {form.motDePasse && (
              <div className="flex gap-1 mt-1.5">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                    form.motDePasse.length >= i*3
                      ? i <= 2 ? 'bg-red-400' : i === 3 ? 'bg-amber-400' : 'bg-emerald-400'
                      : 'bg-gray-200'
                  }`}/>
                ))}
                <span className="text-[10px] text-gray-400 ml-1">
                  {form.motDePasse.length < 4 ? 'Faible' : form.motDePasse.length < 8 ? 'Moyen' : form.motDePasse.length < 12 ? 'Fort' : 'Très fort'}
                </span>
              </div>
            )}
          </Field>

          {/* Confirmation mot de passe */}
          <Field name="confirmMotDePasse">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirmer le mot de passe</p>
            <div className="relative">
              <input
                className={`input pr-10 ${passNoMatch ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : passMatch ? 'border-emerald-400 focus:ring-emerald-400/30' : ''}`}
                type={showConfirm ? 'text' : 'password'}
                placeholder="Répétez votre mot de passe"
                value={form.confirmMotDePasse}
                onChange={e => { setForm({...form,confirmMotDePasse:e.target.value}); setErrors({...errors,confirmMotDePasse:''}) }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {form.confirmMotDePasse && (
                  passMatch
                    ? <CheckCircle className="w-4 h-4 text-emerald-500"/>
                    : <XCircle className="w-4 h-4 text-red-400"/>
                )}
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="text-gray-400 hover:text-gray-600 ml-1">
                  {showConfirm ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>
          </Field>

          {/* Filière / Spécialité */}
          {form.role === 'etudiant' && (
            <div className="fade-up">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Filière</p>
              <input className="input" placeholder="Ex : Informatique, Médecine..." value={form.filiere} onChange={e=>setForm({...form,filiere:e.target.value})} />
            </div>
          )}
          {form.role === 'professionnel' && (
            <div className="fade-up">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Spécialité</p>
              <input className="input" placeholder="Ex : Psychologue..." value={form.specialite} onChange={e=>setForm({...form,specialite:e.target.value})} />
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full py-3 rounded-2xl mt-2">
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
