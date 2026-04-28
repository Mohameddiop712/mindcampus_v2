const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  expediteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contenu: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const demandeAideSchema = new mongoose.Schema({
  etudiant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['pair', 'professionnel'], required: true },
  description: { type: String, required: true },
  statut: { type: String, enum: ['en_attente', 'acceptee', 'en_cours', 'cloturee'], default: 'en_attente' },
  assigneA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  messages: [messageSchema],
  estUrgent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DemandeAide', demandeAideSchema);
