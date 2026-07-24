const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', orderController.listMine);
router.get('/:orderNumber', orderController.getMineByOrderNumber);

module.exports = router;
