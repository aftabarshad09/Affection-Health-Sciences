const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { updateProfileSchema } = require('../validators/profileValidators');

router.use(requireAuth);

router.get('/', profileController.getMe);
router.put('/', validate(updateProfileSchema), profileController.updateMe);
router.post('/welcome', profileController.notifyWelcome);

module.exports = router;
