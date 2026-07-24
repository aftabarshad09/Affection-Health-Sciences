const supabaseAuth = require('../lib/supabaseAuth');
const db = require('../lib/db');

// Admin/Super Admin login. Authenticates against real Supabase Auth accounts
// (no more hardcoded env-var credentials) and then checks the caller's role
// from `profiles` — a valid Supabase session alone is not enough to reach
// the admin panel, only admin/super_admin roles are let through.
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });
  if (error || !data?.session) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const profile = await db.profiles.getById(data.user.id);
  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return res.status(403).json({ success: false, error: 'This account is not authorized for admin access' });
  }
  if (profile.status === 'suspended') {
    return res.status(403).json({ success: false, error: 'This account has been suspended' });
  }

  res.json({
    success: true,
    token: data.session.access_token,
    user: { id: profile.id, fullName: profile.fullName, email: profile.email, role: profile.role },
  });
};

// Returns the currently authenticated admin's profile — lets the frontend
// verify a stored token is still a valid admin session on app load/refresh.
exports.me = async (req, res) => {
  res.json({ success: true, user: req.user });
};
