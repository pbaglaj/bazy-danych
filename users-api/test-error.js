require('dotenv').config();
const svc = require('./services/userService');
svc.findById(999)
   .catch(err => console.log('Code:', err.code, '|', err.message));