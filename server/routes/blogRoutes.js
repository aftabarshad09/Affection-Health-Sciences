const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { requireAuth } = require('../middleware/auth');
const { uploadBlogImages } = require('../middleware/upload');

router.get('/', blogController.list);
router.get('/:slug', blogController.getBySlug);

router.post('/', requireAuth, uploadBlogImages.none(), blogController.create);
router.put('/:slug', requireAuth, uploadBlogImages.none(), blogController.update);
router.delete('/:slug', requireAuth, blogController.remove);
router.post('/upload-image', requireAuth, uploadBlogImages.single('image'), blogController.uploadImage);

module.exports = router;
