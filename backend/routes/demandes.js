const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  creerDemande, getMesDemandes, getDemandesAssignees,
  accepterDemande, envoyerMessage, cloturerDemande, getDemande
} = require('../controllers/demandeController');

router.use(protect);
router.post('/', creerDemande);
router.get('/mes-demandes', getMesDemandes);
router.get('/assignees', getDemandesAssignees);
router.get('/:id', getDemande);
router.put('/:id/accepter', accepterDemande);
router.post('/:id/message', envoyerMessage);
router.put('/:id/cloturer', cloturerDemande);

module.exports = router;
