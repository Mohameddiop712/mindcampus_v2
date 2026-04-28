const mongoose = require('mongoose');

const humeurSchema = new mongoose.Schema({
  etudiant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  etat: {
    type: String,
    enum: ['tres_bien', 'bien', 'moyen', 'mal', 'tres_mal'],
    required: true
  },
  intensite: { type: Number, min: 1, max: 5, required: true },
  note: { type: String, default: '', maxlength: 500 },
  estCritique: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

humeurSchema.pre('save', function (next) {
  this.estCritique = this.intensite <= 2;
  next();
});

module.exports = mongoose.model('Humeur', humeurSchema);
