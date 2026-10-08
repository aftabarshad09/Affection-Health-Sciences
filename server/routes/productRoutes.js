const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { validate } = require('../middleware/validate');
const { uploadProductImages } = require('../middleware/upload');
const { productCommerceSchema } = require('../validators/productCommerceValidators');

const uploadFields = uploadProductImages.fields([
  { name: 'image', maxCount: 1 },
  { name: 'imageA', maxCount: 1 },
  { name: 'imageB', maxCount: 1 },
]);

const requireAdmin = [requireAuth, requireRole('admin', 'super_admin')];

router.get('/', productController.list);
router.post('/', requireAdmin, uploadFields, productController.create);
router.put('/:id', requireAdmin, uploadFields, productController.update);
router.put('/:id/commerce', requireAdmin, validate(productCommerceSchema), productController.updateCommerce);
router.delete('/:id', requireAdmin, productController.remove);

module.exports = router;
