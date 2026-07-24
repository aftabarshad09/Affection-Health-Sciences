const db = require('../lib/db');

exports.list = async (req, res) => {
  try {
    const logs = await db.activityLogs.list(Number(req.query.limit) || 100);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
