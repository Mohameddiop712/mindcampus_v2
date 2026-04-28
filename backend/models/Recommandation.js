const mongoose = require('mongoose');

const recommandationSchema = new mongoose.Schema({
  etudiant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  humeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Humeur' },
  type: { type: String, enum: ['simple', 'urgente'], default: 'simple' },
  titre: { type: String, required: true },
  contenu: { type: String, required: true },
  lue: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommandation', recommandationSchema);
