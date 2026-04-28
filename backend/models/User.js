const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  prenom: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  motDePasse: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['etudiant', 'pair', 'professionnel', 'admin'], default: 'etudiant' },
  filiere: { type: String, default: '' },
  estAnonyme: { type: Boolean, default: true },
  avatar: { type: String, default: '' },
  disponible: { type: Boolean, default: true },
  specialite: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('motDePasse')) return next();
  this.motDePasse = await bcrypt.hash(this.motDePasse, 12);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.motDePasse);
};

module.exports = mongoose.model('User', userSchema);
