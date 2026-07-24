const db = require('../lib/db');

exports.list = async (req, res) => {
  try {
    const users = await db.profiles.list({ role: req.query.role });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Role promotion/demotion is super_admin-only (enforced at the route level)
// — an admin should never be able to grant themselves or anyone else
// elevated access.
exports.updateRole = async (req, res) => {
  try {
    const user = await db.profiles.setRole(req.params.id, req.body.role);
    await db.activityLogs.record({
      adminId: req.user.id,
      action: 'user.role_updated',
      entityType: 'user',
      entityId: req.params.id,
      description: `Changed role for ${user.email} to "${req.body.role}"`,
    });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const user = await db.profiles.setStatus(req.params.id, req.body.status);
    await db.activityLogs.record({
      adminId: req.user.id,
      action: 'user.status_updated',
      entityType: 'user',
      entityId: req.params.id,
      description: `Changed status for ${user.email} to "${req.body.status}"`,
    });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
