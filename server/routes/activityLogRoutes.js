const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');

router.use(requireAuth, requireRole('admin', 'super_admin'));

router.get('/', activityLogController.list);

module.exports = router;
