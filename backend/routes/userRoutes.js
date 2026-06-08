const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Apply authentication middleware to all routes in this router. This means that any route defined here will require a valid JWT token in the Authorization header to access.

router.post('/register', register);
router.post('/login', login);

module.exports = router;