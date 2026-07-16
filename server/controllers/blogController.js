const fs = require('fs');
const path = require('path');

const BLOGS_FILE = path.join(__dirname, '../data/blogs.json');

const readBlogs = () => JSON.parse(fs.readFileSync(BLOGS_FILE, 'utf-8'));

exports.list = (req, res) => {
  try {
    const posts = readBlogs();
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getBySlug = (req, res) => {
  try {
    const posts = readBlogs();
    const post = posts.find((p) => p.slug === req.params.slug);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = (req, res) => res.status(403).json({ success: false, error: 'Blog management is disabled' });
exports.update = (req, res) => res.status(403).json({ success: false, error: 'Blog management is disabled' });
exports.remove = (req, res) => res.status(403).json({ success: false, error: 'Blog management is disabled' });
exports.uploadImage = (req, res) => res.status(403).json({ success: false, error: 'Blog management is disabled' });
