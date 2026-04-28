const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

router.get('/pairs', protect, async (req, res) => {
  try {
    const pairs = await User.find({ role: 'pair', disponible: true }).select('nom prenom formation disponible');
    res.json(pairs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
