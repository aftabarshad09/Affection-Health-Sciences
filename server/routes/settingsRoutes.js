const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { validate } = require('../middleware/validate');
const { updateSettingsSchema } = require('../validators/settingsValidators');

router.use(requireAuth, requireRole('admin', 'super_admin'));

router.get('/', settingsController.get);
router.put('/', validate(updateSettingsSchema), settingsController.update);

module.exports = router;
