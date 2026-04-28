const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
  etudiant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  professionnel: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateHeure: { type: Date, required: true },
  lieu: { type: String, default: 'En ligne (MindCampus)' },
  statut: { type: String, enum: ['planifie', 'confirme', 'annule', 'termine'], default: 'planifie' },
  type: { type: String, enum: ['consultation', 'suivi', 'urgence'], default: 'consultation' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RendezVous', rendezVousSchema);
