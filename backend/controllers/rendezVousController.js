const RendezVous = require('../models/RendezVous');
const User = require('../models/User');

exports.creerRendezVous = async (req, res) => {
  try {
    const { professionnelId, dateHeure, type, notes } = req.body;
    const rv = await RendezVous.create({
      etudiant: req.user._id,
      professionnel: professionnelId,
      dateHeure,
      type,
      notes
    });
    const populated = await RendezVous.findById(rv._id)
      .populate('professionnel', 'nom prenom specialite');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMesRendezVous = async (req, res) => {
  try {
    const query = req.user.role === 'etudiant'
      ? { etudiant: req.user._id }
      : { professionnel: req.user._id };

    const rvs = await RendezVous.find(query)
      .populate('etudiant', 'nom prenom filiere')
      .populate('professionnel', 'nom prenom specialite')
      .sort({ dateHeure: 1 });
    res.json(rvs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatut = async (req, res) => {
  try {
    const rv = await RendezVous.findByIdAndUpdate(
      req.params.id, { statut: req.body.statut }, { new: true }
    ).populate('professionnel', 'nom prenom specialite');
    res.json(rv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfessionnels = async (req, res) => {
  try {
    const pros = await User.find({ role: 'professionnel' }).select('nom prenom specialite disponible');
    res.json(pros);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
