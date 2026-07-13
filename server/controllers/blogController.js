const db = require('../lib/db');

exports.list = async (req, res) => {
  try {
    const posts = await db.blogs.list();
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const post = await db.blogs.getBySlug(req.params.slug);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const post = JSON.parse(req.body.post);
    const existing = await db.blogs.getBySlug(post.slug);
    if (existing) return res.status(400).json({ success: false, error: 'A post with this slug already exists' });
    const created = await db.blogs.create(post);
    res.status(201).json({ success: true, post: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const post = JSON.parse(req.body.post);
    const updated = await db.blogs.update(req.params.slug, post);
    res.json({ success: true, post: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.blogs.remove(req.params.slug);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
  // req.file.path is the Cloudinary URL when using multer-storage-cloudinary
  res.json({ success: true, url: req.file.path });
};
