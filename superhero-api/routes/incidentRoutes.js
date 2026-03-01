const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/userController');

router.get('/',    ctrl.getAll);
router.post('/',   ctrl.create);
router.post('/:id/assign',   ctrl.assign);
router.post('/:id/resolve',   ctrl.resolve);

module.exports = router;