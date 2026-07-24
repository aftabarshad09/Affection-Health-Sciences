const db = require('../lib/db');

exports.getMe = async (req, res) => {
  res.json({ success: true, profile: req.user });
};

exports.updateMe = async (req, res) => {
  try {
    const profile = await db.profiles.update(req.user.id, req.body);
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Called once by the frontend right after a successful sign-up — registration
// itself goes straight through Supabase Auth from the browser, so this is the
// backend's only hook to notify the admin of a new customer.
exports.notifyWelcome = async (req, res) => {
  try {
    const emailService = require('../services/orderEmailService');
    emailService.notifyAdminNewCustomer(req.user).catch((err) => console.error('New customer email failed:', err.message));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
