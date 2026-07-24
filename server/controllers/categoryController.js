const db = require('../lib/db');

exports.list = async (req, res) => {
  try {
    const categories = req.query.all === 'true' ? await db.categories.list() : await db.categories.listActive();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const category = await db.categories.create(req.body);
    await db.activityLogs.record({
      adminId: req.user.id,
      action: 'category.created',
      entityType: 'category',
      entityId: category.id,
      description: `Created category "${category.name}"`,
    });
    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const category = await db.categories.update(Number(req.params.id), req.body);
    await db.activityLogs.record({
      adminId: req.user.id,
      action: 'category.updated',
      entityType: 'category',
      entityId: category.id,
      description: `Updated category "${category.name}"`,
    });
    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.categories.remove(Number(req.params.id));
    await db.activityLogs.record({
      adminId: req.user.id,
      action: 'category.deleted',
      entityType: 'category',
      entityId: req.params.id,
      description: `Deleted category #${req.params.id}`,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
