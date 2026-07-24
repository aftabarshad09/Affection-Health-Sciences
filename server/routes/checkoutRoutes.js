const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { checkoutSchema } = require('../validators/checkoutValidators');

router.get('/settings', checkoutController.getShippingSettings);
router.post('/', requireAuth, validate(checkoutSchema), checkoutController.placeOrder);

module.exports = router;
