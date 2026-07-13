const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/auth');

router.get('/', reviewController.list);
router.post('/', reviewController.create);

router.get('/admin', requireAuth, reviewController.adminList);
router.put('/admin/:id', requireAuth, reviewController.update);
router.delete('/admin/:id', requireAuth, reviewController.remove);

module.exports = router;
