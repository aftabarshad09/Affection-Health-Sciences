const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAuth } = require('../middleware/auth');
const { uploadProductImages } = require('../middleware/upload');

const uploadFields = uploadProductImages.fields([
  { name: 'image', maxCount: 1 },
  { name: 'imageA', maxCount: 1 },
  { name: 'imageB', maxCount: 1 },
]);

router.get('/', productController.list);
router.post('/', requireAuth, uploadFields, productController.create);
router.put('/:id', requireAuth, uploadFields, productController.update);
router.delete('/:id', requireAuth, productController.remove);

module.exports = router;
