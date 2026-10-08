const jwt = require('jsonwebtoken');

// Verifies the admin JWT (signed locally at login). Attaches req.user with the
// admin identity + role. There are no customer accounts — only the admin logs
// in — so a valid token means an admin.
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Missing or invalid Authorization header' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.username,
      username: payload.username,
      email: payload.username,
      fullName: 'Admin',
      role: payload.role || 'super_admin',
      status: 'active',
    };
    req.admin = req.user;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired session' });
  }
};

module.exports = { requireAuth };
