const db = require('../lib/db');

exports.list = async (req, res) => {
  try {
    const addresses = await db.addresses.listForUser(req.user.id);
    res.json({ success: true, addresses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const address = await db.addresses.create(req.user.id, req.body);
    res.status(201).json({ success: true, address });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const address = await db.addresses.update(Number(req.params.id), req.user.id, req.body);
    res.json({ success: true, address });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.addresses.remove(Number(req.params.id), req.user.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
