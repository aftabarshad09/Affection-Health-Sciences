// Must run after requireAuth (needs req.user). Frontend role checks are
// cosmetic only — this is the actual authorization boundary.
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: 'Insufficient permissions' });
  }
  next();
};

module.exports = { requireRole };
