const supabase = require('../lib/supabase');
const db = require('../lib/db');

// Verifies the bearer token against Supabase Auth (never trusts a locally
// signed JWT) and attaches the caller's profile — including their role —
// onto req.user. Route-level authorization is enforced separately by
// requireRole, since being logged in and being an admin are different things.
const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Missing or invalid Authorization header' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ success: false, error: 'Invalid or expired session' });
    }

    const profile = await db.profiles.getById(data.user.id);
    if (!profile) {
      return res.status(401).json({ success: false, error: 'No profile found for this account' });
    }
    if (profile.status === 'suspended') {
      return res.status(403).json({ success: false, error: 'This account has been suspended' });
    }

    req.user = profile;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid or expired session' });
  }
};

module.exports = { requireAuth };
