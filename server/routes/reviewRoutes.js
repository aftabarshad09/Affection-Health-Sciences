const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');

const requireAdmin = [requireAuth, requireRole('admin', 'super_admin')];

router.get('/', reviewController.list);
router.post('/', reviewController.create);

router.get('/admin', requireAdmin, reviewController.adminList);
router.put('/admin/:id', requireAdmin, reviewController.update);
router.delete('/admin/:id', requireAdmin, reviewController.remove);

module.exports = router;
