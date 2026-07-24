const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { validate } = require('../middleware/validate');
const { updateRoleSchema, updateStatusSchema } = require('../validators/userValidators');

router.use(requireAuth, requireRole('admin', 'super_admin'));

router.get('/', adminUserController.list);
router.put('/:id/status', validate(updateStatusSchema), adminUserController.updateStatus);
// Role changes are the one action reserved for super_admin only.
router.put('/:id/role', requireRole('super_admin'), validate(updateRoleSchema), adminUserController.updateRole);

module.exports = router;
