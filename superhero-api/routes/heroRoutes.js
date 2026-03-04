const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/heroController');

router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);
router.get('/:id/incidents', ctrl.getIncidentsForHero);
router.post('/', ctrl.create);
router.patch('/:id', ctrl.update);

module.exports = router;