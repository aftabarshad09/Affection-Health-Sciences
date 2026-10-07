const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');

// Public — the token in the URL is the access secret.
router.get('/:token', trackController.getByToken);

module.exports = router;
