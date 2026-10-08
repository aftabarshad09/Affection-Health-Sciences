const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { validate } = require('../middleware/validate');
const { guestCheckoutSchema } = require('../validators/guestCheckoutValidators');

// Public guest checkout — no authentication.
router.get('/settings', checkoutController.getShippingSettings);
router.post('/', validate(guestCheckoutSchema), checkoutController.placeGuestOrder);

module.exports = router;
