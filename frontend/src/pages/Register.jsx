import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Brain, ArrowRight, GraduationCap, Heart, Stethoscope, Eye, EyeOff, CheckCircle, XCircle, Camera, Upload, X, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

const ALLOWED_DOMAINS = ['gmail.com', 'ucad.edu.sn', 'esp.sn']
const isValidEmail = (email) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false
  return ALLOWED_DOMAINS.includes(email.split('@')[1]?.toLowerCase())
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [form, setForm] = useState({
    nom:'', prenom:'', email:'', motDePasse:'', confirmMotDePasse:'',
    role:'etudiant', filiere:'', specialite:'', carteIdentite:''
  })
  const [touched, setTouched] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  const getError = (name) => {
    if (!touched[name]) return ''
    switch (name) {
      case 'prenom': return !form.prenom.trim() ? 'Prénom requis' : ''
      case 'nom': return !form.nom.trim() ? 'Nom requis' : ''
      case 'email':
        if (!form.email.trim()) return 'Email requis'
        if (!isValidEmail(form.email)) return 'Utilisez @gmail.com, @ucad.edu.sn ou @esp.sn'
        return ''
      case 'motDePasse':
        if (!form.motDePasse) return 'Mot de passe requis'
        if (form.motDePasse.length < 6) return 'Minimum 6 caractères'
        return ''
      case 'confirmMotDePasse':
        if (!form.confirmMotDePasse) return 'Confirmez votre mot de passe'
        if (form.motDePasse !== form.confirmMotDePasse) return 'Les mots de passe ne correspondent pas'
        return ''
      default: return ''
    }
  }

  const handleBlur = (name) => setTouched(t => ({ ...t, [name]: true }))
  const handleChange = (name, value) => setForm(f => ({ ...f, [name]: value }))

  // Gestion photo carte
  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La photo ne doit pas dépasser 5 Mo')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Format accepté : JPG, PNG ou WEBP')
      return
    }
    setUploadingPhoto(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result)
      handleChange('carteIdentite', reader.result)
      setUploadingPhoto(false)
      toast.success('Photo ajoutée ✅')
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    setPhotoPreview(null)
    handleChange('carteIdentite', '')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ prenom:true, nom:true, email:true, motDePasse:true, confirmMotDePasse:true })

    const needsCard = form.role === 'pair' || form.role === 'professionnel'
    const hasErrors = !form.prenom.trim() || !form.nom.trim() ||
      !isValidEmail(form.email) || form.motDePasse.length < 6 ||
      form.motDePasse !== form.confirmMotDePasse ||
      (needsCard && !form.carteIdentite)

    if (hasErrors) {
      if (needsCard && !form.carteIdentite) toast.error('Veuillez ajouter la photo de votre carte')
      else toast.error('Corrigez les erreurs avant de continuer')
      return
    }

    setLoading(true)
    try {
      const { confirmMotDePasse, ...data } = form
      await register(data)
      toast.success('Compte créé ! 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'inscription")
    } finally { setLoading(false) }
  }

  const roles = [
    { v:'etudiant', icon:GraduationCap, label:'Étudiant', desc:'Suivre mon bien-être' },
    { v:'pair', icon:Heart, label:'Pair-aidant', desc:'Soutenir mes camarades' },
    { v:'professionnel', icon:Stethoscope, label:'Professionnel', desc:'Accompagner les étudiants' },
  ]

  const passMatch = form.confirmMotDePasse && form.motDePasse === form.confirmMotDePasse
  const passNoMatch = touched.confirmMotDePasse && form.confirmMotDePasse && form.motDePasse !== form.confirmMotDePasse
  const emailOk = form.email && isValidEmail(form.email)
  const emailBad = touched.email && form.email && !isValidEmail(form.email)

  const passStrength = form.motDePasse.length === 0 ? 0
    : form.motDePasse.length < 6 ? 1
    : form.motDePasse.length < 10 ? 2
    : form.motDePasse.length < 14 ? 3 : 4
  const strengthLabel = ['', 'Faible', 'Moyen', 'Fort', 'Très fort']
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500']

  const needsCard = form.role === 'pair' || form.role === 'professionnel'

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background:'linear-gradient(135deg,#f0f4ff,#faf5ff)'}}>
      <div className="w-full max-w-[500px] fade-up py-6">

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

          {/* Role */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Je suis</p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => {
                const isSelected = form.role === r.v
                return (
                  <button key={r.v} type="button" onClick={() => handleChange('role', r.v)}
                    className={`p-3 rounded-2xl border-2 text-center transition-all duration-200 ${isSelected ? 'border-transparent scale-[1.02] shadow-md' : 'border-gray-100 bg-gray-50 hover:border-indigo-200'}`}
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
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Prénom</p>
              <input className={`input ${getError('prenom') ? 'border-red-400' : ''}`} placeholder="Aminata"
                value={form.prenom} onChange={e => handleChange('prenom', e.target.value)} onBlur={() => handleBlur('prenom')} />
              {getError('prenom') && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><XCircle className="w-3 h-3"/>{getError('prenom')}</p>}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nom</p>
              <input className={`input ${getError('nom') ? 'border-red-400' : ''}`} placeholder="Diallo"
                value={form.nom} onChange={e => handleChange('nom', e.target.value)} onBlur={() => handleBlur('nom')} />
              {getError('nom') && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><XCircle className="w-3 h-3"/>{getError('nom')}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</p>
            <div className="relative">
              <input className={`input pr-10 ${emailBad ? 'border-red-400' : emailOk ? 'border-emerald-400' : ''}`}
                placeholder="vous@gmail.com" value={form.email}
                onChange={e => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')} />
              {form.email && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {emailOk ? <CheckCircle className="w-4 h-4 text-emerald-500"/> : emailBad ? <XCircle className="w-4 h-4 text-red-400"/> : null}
                </div>
              )}
            </div>
            {getError('email') && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><XCircle className="w-3 h-3"/>{getError('email')}</p>}
            <p className="text-[10px] text-gray-400 mt-1">Domaines : @gmail.com · @ucad.edu.sn · @esp.sn</p>
          </div>

          {/* Mot de passe */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mot de passe</p>
            <div className="relative">
              <input className={`input pr-10 ${getError('motDePasse') ? 'border-red-400' : ''}`}
                type={showPass ? 'text' : 'password'} placeholder="Minimum 6 caractères"
                value={form.motDePasse} onChange={e => handleChange('motDePasse', e.target.value)} onBlur={() => handleBlur('motDePasse')} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
              </button>
            </div>
            {form.motDePasse && (
              <div className="flex items-center gap-1.5 mt-1.5">
                {[1,2,3,4].map(i => <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i<=passStrength ? strengthColor[passStrength] : 'bg-gray-200'}`}/>)}
                <span className="text-[10px] text-gray-400 whitespace-nowrap">{strengthLabel[passStrength]}</span>
              </div>
            )}
            {getError('motDePasse') && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><XCircle className="w-3 h-3"/>{getError('motDePasse')}</p>}
          </div>

          {/* Confirmer MDP */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirmer le mot de passe</p>
            <div className="relative">
              <input className={`input pr-16 ${passNoMatch ? 'border-red-400' : passMatch ? 'border-emerald-400' : ''}`}
                type={showConfirm ? 'text' : 'password'} placeholder="Répétez votre mot de passe"
                value={form.confirmMotDePasse} onChange={e => handleChange('confirmMotDePasse', e.target.value)} onBlur={() => handleBlur('confirmMotDePasse')} />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {form.confirmMotDePasse && (passMatch ? <CheckCircle className="w-4 h-4 text-emerald-500"/> : passNoMatch ? <XCircle className="w-4 h-4 text-red-400"/> : null)}
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>
            {getError('confirmMotDePasse') && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><XCircle className="w-3 h-3"/>{getError('confirmMotDePasse')}</p>}
          </div>

          {/* Filière */}
          {form.role === 'etudiant' && (
            <div className="fade-up">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Filière</p>
              <input className="input" placeholder="Ex : Informatique, Médecine..." value={form.filiere} onChange={e => handleChange('filiere', e.target.value)} />
            </div>
          )}

          {/* Spécialité */}
          {form.role === 'professionnel' && (
            <div className="fade-up">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Spécialité</p>
              <input className="input" placeholder="Ex : Psychologue, Médecin..." value={form.specialite} onChange={e => handleChange('specialite', e.target.value)} />
            </div>
          )}

          {/* ═══ PHOTO CARTE D'IDENTITÉ (pair + professionnel) ═══ */}
          {needsCard && (
            <div className="fade-up">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500"/>
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Vérification d'identité <span className="text-red-500">*</span>
                </p>
              </div>

              {/* Info box */}
              <div className="p-3 rounded-xl mb-3 text-xs" style={{background:'linear-gradient(135deg,#eff6ff,#dbeafe)',border:'1px solid #bfdbfe'}}>
                <p className="font-semibold text-blue-700 mb-1">📋 Document requis</p>
                <p className="text-blue-600">
                  {form.role === 'pair'
                    ? 'Prenez en photo votre carte étudiant ou tout document attestant votre formation pair-aidant.'
                    : 'Prenez en photo votre carte professionnelle, diplôme ou tout document certifiant votre qualité de professionnel de santé.'}
                </p>
                <p className="text-blue-500 mt-1">⏳ Votre compte sera actif immédiatement mais sera examiné par notre équipe.</p>
              </div>

              {/* Zone upload */}
              {!photoPreview ? (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 transition-all">
                  {uploadingPhoto ? (
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
                        <Camera className="w-6 h-6 text-indigo-500"/>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-indigo-700">Ajouter une photo</p>
                        <p className="text-xs text-indigo-400 mt-0.5">JPG, PNG ou WEBP · Max 5 Mo</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500 text-white text-xs font-semibold">
                          <Upload className="w-3 h-3"/> Choisir un fichier
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-600 text-xs font-semibold">
                          <Camera className="w-3 h-3"/> Prendre une photo
                        </span>
                      </div>
                    </>
                  )}
                </button>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-300">
                  <img src={photoPreview} alt="Carte" className="w-full h-48 object-cover"/>
                  <div className="absolute inset-0 flex items-end p-3" style={{background:'linear-gradient(to top,rgba(0,0,0,0.6),transparent)'}}>
                    <div className="flex items-center gap-2 flex-1">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0"/>
                      <p className="text-white text-xs font-semibold">Photo ajoutée avec succès</p>
                    </div>
                    <button type="button" onClick={removePhoto}
                      className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors">
                      <X className="w-4 h-4 text-white"/>
                    </button>
                  </div>
                </div>
              )}

              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto}/>

              {needsCard && !form.carteIdentite && touched.carteIdentite && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><XCircle className="w-3 h-3"/>La photo de votre carte est obligatoire</p>
              )}
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
