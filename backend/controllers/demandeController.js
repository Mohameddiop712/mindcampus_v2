const DemandeAide = require('../models/DemandeAide');
const User = require('../models/User');

exports.creerDemande = async (req, res) => {
  try {
    const { type, description, estUrgent } = req.body;
    const demande = await DemandeAide.create({
      etudiant: req.user._id, type, description, estUrgent
    });
    res.status(201).json(demande);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMesDemandes = async (req, res) => {
  try {
    const demandes = await DemandeAide.find({ etudiant: req.user._id })
      .populate('assigneA', 'nom prenom specialite')
      .sort({ createdAt: -1 });
    res.json(demandes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDemandesAssignees = async (req, res) => {
  try {
    const role = req.user.role;
    const type = role === 'pair' ? 'pair' : 'professionnel';
    const demandes = await DemandeAide.find({ type, statut: { $in: ['en_attente', 'acceptee', 'en_cours'] } })
      .populate('etudiant', 'prenom filiere estAnonyme')
      .sort({ createdAt: -1 });
    res.json(demandes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.accepterDemande = async (req, res) => {
  try {
    const demande = await DemandeAide.findByIdAndUpdate(
      req.params.id,
      { statut: 'acceptee', assigneA: req.user._id },
      { new: true }
    ).populate('etudiant', 'prenom filiere');
    res.json(demande);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.envoyerMessage = async (req, res) => {
  try {
    const demande = await DemandeAide.findById(req.params.id);
    if (!demande) return res.status(404).json({ message: 'Demande introuvable' });

    demande.messages.push({ expediteur: req.user._id, contenu: req.body.contenu });
    demande.statut = 'en_cours';
    demande.updatedAt = Date.now();
    await demande.save();

    const updated = await DemandeAide.findById(req.params.id)
      .populate('messages.expediteur', 'nom prenom role');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cloturerDemande = async (req, res) => {
  try {
    const demande = await DemandeAide.findByIdAndUpdate(
      req.params.id, { statut: 'cloturee' }, { new: true }
    );
    res.json(demande);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDemande = async (req, res) => {
  try {
    const demande = await DemandeAide.findById(req.params.id)
      .populate('etudiant', 'prenom filiere estAnonyme')
      .populate('assigneA', 'nom prenom specialite')
      .populate('messages.expediteur', 'nom prenom role');
    if (!demande) return res.status(404).json({ message: 'Demande introuvable' });
    res.json(demande);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
