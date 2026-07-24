const db = require('../lib/db');

exports.get = async (req, res) => {
  try {
    const settings = await db.settings.get();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const settings = await db.settings.update(req.body, req.user.id);
    await db.activityLogs.record({
      adminId: req.user.id,
      action: 'settings.updated',
      entityType: 'settings',
      description: 'Updated store settings',
      metadata: req.body,
    });
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
