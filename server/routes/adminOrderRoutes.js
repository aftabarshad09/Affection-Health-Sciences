const express = require('express');
const router = express.Router();
const adminOrderController = require('../controllers/adminOrderController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { validate } = require('../middleware/validate');
const { updateOrderStatusSchema, updatePaymentStatusSchema, addNoteSchema } = require('../validators/orderValidators');

router.use(requireAuth, requireRole('admin', 'super_admin'));

router.get('/', adminOrderController.list);
router.get('/:id', adminOrderController.getById);
router.put('/:id/status', validate(updateOrderStatusSchema), adminOrderController.updateStatus);
router.put('/:id/payment', validate(updatePaymentStatusSchema), adminOrderController.updatePaymentStatus);
router.post('/:id/note', validate(addNoteSchema), adminOrderController.addNote);
router.delete('/:id', adminOrderController.remove);

module.exports = router;
