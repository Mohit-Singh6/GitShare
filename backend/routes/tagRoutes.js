const express = require('express');
const router = express.Router();
const { getAllTags } = require('../controllers/tagController');
const { protect } = require('../middleware/authMiddleware');


// TEMPORARY DEBUG LOGS:
// console.log("Protect Function:", protect);

router.use(protect); // Apply authentication middleware to all routes in this router. This means that any route defined here will require a valid JWT token in the Authorization header to access.

router.get('/', getAllTags);

module.exports = router;