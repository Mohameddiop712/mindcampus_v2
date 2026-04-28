const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { creerRendezVous, getMesRendezVous, updateStatut, getProfessionnels } = require('../controllers/rendezVousController');

router.use(protect);
router.post('/', creerRendezVous);
router.get('/', getMesRendezVous);
router.get('/professionnels', getProfessionnels);
router.put('/:id/statut', updateStatut);

module.exports = router;
