const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');

// TEMPORARY DEBUG LOGS:
// console.log("Register Function:", register);
// console.log("Login Function:", login);
// console.log("Protect Function:", protect);


router.post('/register', register);
router.post('/login', login);

module.exports = router;