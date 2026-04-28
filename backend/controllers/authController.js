const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, role, filiere, specialite, carteIdentite } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email déjà utilisé' });

    // Pour pair et professionnel, la carte est obligatoire
    if ((role === 'pair' || role === 'professionnel') && !carteIdentite) {
      return res.status(400).json({ message: 'La photo de votre carte est obligatoire' });
    }

    const statutVerification = (role === 'pair' || role === 'professionnel') 
      ? 'en_attente' 
      : 'non_soumis';

    const user = await User.create({ 
      nom, prenom, email, motDePasse, role, filiere, specialite,
      carteIdentite: carteIdentite || '',
      statutVerification
    });

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { 
        id: user._id, nom: user.nom, prenom: user.prenom, 
        email: user.email, role: user.role,
        statutVerification: user.statutVerification
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(motDePasse)))
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const token = generateToken(user._id);
    res.json({
      token,
      user: { 
        id: user._id, nom: user.nom, prenom: user.prenom, 
        email: user.email, role: user.role,
        statutVerification: user.statutVerification,
        estVerifie: user.estVerifie
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};
