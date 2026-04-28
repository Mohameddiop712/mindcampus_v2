import { useState } from 'react'
import { BookOpen, Phone, MapPin, ExternalLink, Search, Heart, Brain, Users, Shield } from 'lucide-react'

const ressources = [
  {
    categorie: 'Santé mentale',
    icon: Brain,
    color: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    items: [
      { titre: 'Gérer le stress étudiant', desc: 'Techniques de respiration, mindfulness et gestion du temps pour réduire l\'anxiété liée aux études.', type: 'Guide' },
      { titre: 'Comprendre l\'anxiété', desc: 'Les signes de l\'anxiété, ses causes et les stratégies pour mieux la gérer au quotidien.', type: 'Article' },
      { titre: 'Bien dormir pour mieux réussir', desc: 'L\'importance du sommeil sur la concentration et la santé mentale des étudiants.', type: 'Guide' },
    ]
  },
  {
    categorie: 'Bien-être',
    icon: Heart,
    color: 'linear-gradient(135deg,#ec4899,#f43f5e)',
    bg: '#fff1f2',
    border: '#fecdd3',
    items: [
      { titre: 'Sport et santé mentale', desc: 'Comment l\'activité physique améliore l\'humeur, réduit le stress et booste la concentration.', type: 'Article' },
      { titre: 'Alimentation et bien-être', desc: 'Les liens entre nutrition, énergie et santé mentale pour les étudiants.', type: 'Guide' },
      { titre: 'Méditation pour débutants', desc: 'Exercices simples de méditation et de pleine conscience pour gérer les émotions.', type: 'Exercice' },
    ]
  },
  {
    categorie: 'Ressources campus',
    icon: MapPin,
    color: 'linear-gradient(135deg,#0d9488,#059669)',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    items: [
      { titre: 'Service de santé UCAD', desc: 'Infirmerie et service médical disponible pour tous les étudiants de l\'UCAD.', type: 'Service', lien: true },
      { titre: 'Cellule d\'écoute ESP', desc: 'Service d\'écoute psychologique gratuit et confidentiel pour les étudiants de l\'ESP.', type: 'Service', lien: true },
      { titre: 'Associations étudiantes', desc: 'Liste des associations de soutien entre pairs disponibles sur les campus.', type: 'Service', lien: true },
    ]
  },
  {
    categorie: 'Urgences',
    icon: Phone,
    color: 'linear-gradient(135deg,#ef4444,#f59e0b)',
    bg: '#fff7ed',
    border: '#fed7aa',
    items: [
      { titre: 'Ligne nationale 3114', desc: 'Numéro national de prévention du suicide, disponible 24h/24 et 7j/7. Gratuit.', type: 'Urgence', tel: '3114' },
      { titre: 'SAMU Sénégal', desc: 'Service d\'aide médicale urgente disponible en cas d\'urgence médicale.', type: 'Urgence', tel: '15' },
      { titre: 'Croix-Rouge Sénégal', desc: 'Soutien psychosocial et aide humanitaire en situation de crise.', type: 'Urgence', tel: '338 232 020' },
    ]
  },
]

const typeColor = { Guide:'badge-blue', Article:'badge-purple', Exercice:'badge-green', Service:'badge-teal', Urgence:'badge-red' }

export default function Ressources() {
  const [search, setSearch] = useState('')
  const [catActive, setCatActive] = useState('Tout')

  const categories = ['Tout', ...ressources.map(r => r.categorie)]

  const filtered = ressources.filter(r =>
    (catActive === 'Tout' || r.categorie === catActive) &&
    (search === '' || r.items.some(i => i.titre.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase())))
  ).map(r => ({
    ...r,
    items: r.items.filter(i => search === '' || i.titre.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase()))
  }))

  return (
    <div className="space-y-7 max-w-4xl">
      {/* Header */}
      <div className="fade-up">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-500"/> Ressources & Services
        </h1>
        <p className="text-gray-400 text-sm mt-1">Guides, articles et services de santé disponibles pour les étudiants</p>
      </div>

      {/* Bannière */}
      <div className="p-5 rounded-2xl text-white fade-up d1" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
        <div className="flex items-center gap-4">
          <div className="text-4xl">📚</div>
          <div>
            <p className="font-bold text-lg">Centre de ressources MindCampus</p>
            <p className="text-indigo-200 text-sm mt-0.5">Toutes ces ressources sont gratuites et accessibles sans inscription</p>
          </div>
        </div>
      </div>

      {/* Recherche */}
      <div className="relative fade-up d2">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
        <input className="input pl-10" placeholder="Rechercher une ressource..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Filtres catégorie */}
      <div className="flex gap-2 overflow-x-auto pb-1 fade-up d2">
        {categories.map(c => (
          <button key={c} onClick={() => setCatActive(c)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${catActive===c ? 'text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'}`}
            style={catActive===c ? {background:'linear-gradient(135deg,#6366f1,#8b5cf6)'} : {}}>
            {c}
          </button>
        ))}
      </div>

      {/* Ressources */}
      <div className="space-y-6 fade-up d3">
        {filtered.map((cat, ci) => cat.items.length > 0 && (
          <div key={cat.categorie}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:cat.color}}>
                <cat.icon className="w-4 h-4 text-white"/>
              </div>
              <h2 className="font-bold text-gray-900">{cat.categorie}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.items.map((item, ii) => (
                <div key={ii} className="bg-white rounded-2xl p-4 border hover:shadow-md hover:-translate-y-0.5 transition-all fade-up"
                  style={{borderColor:cat.border,background:cat.bg,animationDelay:`${(ci*3+ii)*0.04}s`}}>
                  <div className="flex items-start justify-between mb-2">
                    <span className={typeColor[item.type] || 'badge-gray'}>{item.type}</span>
                    {(item.lien || item.tel) && (
                      item.tel ? (
                        <a href={`tel:${item.tel}`} className="w-7 h-7 rounded-lg bg-white flex items-center justify-center hover:shadow-md transition-all border border-gray-100">
                          <Phone className="w-3.5 h-3.5 text-gray-500"/>
                        </a>
                      ) : (
                        <button className="w-7 h-7 rounded-lg bg-white flex items-center justify-center hover:shadow-md transition-all border border-gray-100">
                          <ExternalLink className="w-3.5 h-3.5 text-gray-500"/>
                        </button>
                      )
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{item.titre}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  {item.tel && (
                    <a href={`tel:${item.tel}`} className="flex items-center gap-1.5 mt-3 text-sm font-bold text-indigo-600 hover:text-indigo-700">
                      <Phone className="w-3.5 h-3.5"/> {item.tel}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.every(r => r.items.length === 0) && (
          <div className="card flex flex-col items-center py-12 text-center">
            <Search className="w-10 h-10 text-gray-200 mb-3"/>
            <p className="font-medium text-gray-500">Aucune ressource trouvée</p>
            <p className="text-sm text-gray-400 mt-1">Essayez avec d'autres mots-clés</p>
          </div>
        )}
      </div>
    </div>
  )
}
