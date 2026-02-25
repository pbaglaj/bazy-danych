// routes/users.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/userController');

router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/',   ctrl.create);
router.post('/:id/delete', ctrl.deleteById);  // opcjonalnie, do testów

module.exports = router;