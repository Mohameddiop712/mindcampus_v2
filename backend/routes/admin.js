const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Humeur = require('../models/Humeur');
const DemandeAide = require('../models/DemandeAide');
const RendezVous = require('../models/RendezVous');

// Stats globales
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const [totalUsers, totalHumeurs, totalDemandes, totalRDV, enAttente, users] = await Promise.all([
      User.countDocuments(),
      Humeur.countDocuments(),
      DemandeAide.countDocuments(),
      RendezVous.countDocuments(),
      User.countDocuments({ statutVerification: 'en_attente' }),
      User.find().select('-motDePasse -carteIdentite').sort({ createdAt: -1 })
    ])
    const parRole = {
      etudiants: users.filter(u => u.role === 'etudiant').length,
      pairs: users.filter(u => u.role === 'pair').length,
      professionnels: users.filter(u => u.role === 'professionnel').length,
      admins: users.filter(u => u.role === 'admin').length,
    }
    res.json({ totalUsers, totalHumeurs, totalDemandes, totalRDV, enAttente, parRole })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// Tous les utilisateurs
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-motDePasse').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// Utilisateurs en attente de vérification
router.get('/verifications', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({ statutVerification: 'en_attente' }).select('-motDePasse').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// Approuver un utilisateur
router.put('/users/:id/approuver', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id,
      { statutVerification: 'approuve', estVerifie: true },
      { new: true }
    ).select('-motDePasse -carteIdentite')
    res.json(user)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// Rejeter un utilisateur
router.put('/users/:id/rejeter', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id,
      { statutVerification: 'rejete', estVerifie: false },
      { new: true }
    ).select('-motDePasse -carteIdentite')
    res.json(user)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// Supprimer un utilisateur
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'Utilisateur supprimé' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// Voir la carte d'identité d'un user
router.get('/users/:id/carte', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('carteIdentite nom prenom role')
    if (!user) return res.status(404).json({ message: 'Introuvable' })
    res.json(user)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router;
