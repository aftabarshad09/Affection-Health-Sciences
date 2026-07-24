const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');

router.use(requireAuth, requireRole('admin', 'super_admin'));

router.get('/', adminDashboardController.getStats);

module.exports = router;
