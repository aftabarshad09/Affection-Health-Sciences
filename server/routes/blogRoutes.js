const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { uploadBlogImages } = require('../middleware/upload');

const requireAdmin = [requireAuth, requireRole('admin', 'super_admin')];

router.get('/', blogController.list);
router.get('/:slug', blogController.getBySlug);

router.post('/', requireAdmin, uploadBlogImages.none(), blogController.create);
router.put('/:slug', requireAdmin, uploadBlogImages.none(), blogController.update);
router.delete('/:slug', requireAdmin, blogController.remove);
router.post('/upload-image', requireAdmin, uploadBlogImages.single('image'), blogController.uploadImage);

module.exports = router;
