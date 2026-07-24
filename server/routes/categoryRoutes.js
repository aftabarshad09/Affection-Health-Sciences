const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');

const requireAdmin = [requireAuth, requireRole('admin', 'super_admin')];

router.get('/', categoryController.list);
router.post('/', requireAdmin, categoryController.create);
router.put('/:id', requireAdmin, categoryController.update);
router.delete('/:id', requireAdmin, categoryController.remove);

module.exports = router;
