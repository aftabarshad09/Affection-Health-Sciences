const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required' });
  }

  if (username !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH || '');
  if (!valid) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.json({ success: true, token });
};
