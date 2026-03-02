const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/incidentController');

router.get('/',    ctrl.getAll);
router.post('/',   ctrl.create);
router.post('/:id/assign',   ctrl.assignHeroToIncident);
router.patch('/:id/resolve',   ctrl.closeIncident);

module.exports = router;