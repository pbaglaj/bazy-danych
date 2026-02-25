require('dotenv').config();
const svc = require('./services/userService');

svc.findAll()
   .then(users => console.log('Users:', users))
   .catch(err  => console.error('Error:', err.message));