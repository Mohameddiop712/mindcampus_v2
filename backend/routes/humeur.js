const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { enregistrerHumeur, getHistorique, getDerniereHumeur } = require('../controllers/humeurController');

router.use(protect);
router.post('/', enregistrerHumeur);
router.get('/', getHistorique);
router.get('/derniere', getDerniereHumeur);

module.exports = router;
