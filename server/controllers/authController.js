const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Local admin login (no external auth service). Credentials come from
// server/.env: ADMIN_USERNAME + ADMIN_PASSWORD (or ADMIN_PASSWORD_HASH).
exports.login = async (req, res) => {
  const user = req.body.email || req.body.username;
  const { password } = req.body;

  if (!user || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }
  if (user !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  let valid = false;
  if (process.env.ADMIN_PASSWORD_HASH) {
    valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  }
  if (!valid && process.env.ADMIN_PASSWORD) {
    valid = password === process.env.ADMIN_PASSWORD;
  }
  if (!valid) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user, role: 'super_admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, user: { id: user, email: user, fullName: 'Admin', role: 'super_admin' } });
};

exports.me = (req, res) => {
  res.json({ success: true, user: req.user });
};
