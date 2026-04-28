const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMesRecommandations, marquerLue } = require('../controllers/recommandationController');

router.use(protect);
router.get('/', getMesRecommandations);
router.put('/:id/lue', marquerLue);

module.exports = router;
