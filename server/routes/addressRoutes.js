const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { addressSchema } = require('../validators/addressValidators');

router.use(requireAuth);

router.get('/', addressController.list);
router.post('/', validate(addressSchema), addressController.create);
router.put('/:id', validate(addressSchema), addressController.update);
router.delete('/:id', addressController.remove);

module.exports = router;
