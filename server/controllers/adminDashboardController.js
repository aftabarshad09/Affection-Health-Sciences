const db = require('../lib/db');

exports.getStats = async (req, res) => {
  try {
    const stats = await db.dashboard.getStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
