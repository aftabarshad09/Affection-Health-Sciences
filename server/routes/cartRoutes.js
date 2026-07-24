const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { addCartItemSchema, updateCartItemSchema } = require('../validators/cartValidators');

router.use(requireAuth);

router.get('/', cartController.list);
router.post('/items', validate(addCartItemSchema), cartController.addItem);
router.put('/items/:id', validate(updateCartItemSchema), cartController.updateItem);
router.delete('/items/:id', cartController.removeItem);
router.delete('/', cartController.clear);
router.post('/merge', cartController.merge);

module.exports = router;
