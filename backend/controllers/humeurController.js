const Humeur = require('../models/Humeur');
const Recommandation = require('../models/Recommandation');

const recommandationsParEtat = {
  tres_bien: [
    { titre: '🌟 Super journée !', contenu: 'Profitez de cette belle énergie. Partagez votre bonne humeur autour de vous !' },
    { titre: '🏃 Activité physique', contenu: 'C\'est le moment idéal pour faire du sport ou une activité que vous aimez.' }
  ],
  bien: [
    { titre: '📚 Concentration optimale', contenu: 'Vous êtes en forme. Profitez-en pour avancer dans vos études !' },
    { titre: '🧘 Méditation', contenu: 'Maintenez cet équilibre avec 10 minutes de pleine conscience.' }
  ],
  moyen: [
    { titre: '☕ Pause nécessaire', contenu: 'Accordez-vous une pause. Une courte marche peut aider à vous ressourcer.' },
    { titre: '💬 Parlez à quelqu\'un', contenu: 'N\'hésitez pas à échanger avec un ami ou un pair-aidant.' }
  ],
  mal: [
    { titre: '🆘 Soutien disponible', contenu: 'Vous n\'êtes pas seul(e). Nos pair-aidants sont disponibles pour vous écouter.' },
    { titre: '🌿 Respiration', contenu: 'Essayez une technique de respiration : inspirez 4s, retenez 4s, expirez 4s.' }
  ],
  tres_mal: [
    { titre: '🚨 Aide immédiate', contenu: 'Nous vous recommandons vivement de contacter un professionnel dès maintenant.' },
    { titre: '📞 Ligne d\'écoute', contenu: 'Appelez le 3114 (numéro national de prévention du suicide) si besoin.' }
  ]
};

exports.enregistrerHumeur = async (req, res) => {
  try {
    const { etat, intensite, note } = req.body;
    const humeur = await Humeur.create({ etudiant: req.user._id, etat, intensite, note });

    const recs = recommandationsParEtat[etat] || [];
    const type = humeur.estCritique ? 'urgente' : 'simple';

    for (const rec of recs) {
      await Recommandation.create({ etudiant: req.user._id, humeur: humeur._id, type, ...rec });
    }

    res.status(201).json({ humeur, message: 'Humeur enregistrée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHistorique = async (req, res) => {
  try {
    const humeurs = await Humeur.find({ etudiant: req.user._id }).sort({ createdAt: -1 }).limit(30);
    res.json(humeurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDerniereHumeur = async (req, res) => {
  try {
    const humeur = await Humeur.findOne({ etudiant: req.user._id }).sort({ createdAt: -1 });
    res.json(humeur);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
