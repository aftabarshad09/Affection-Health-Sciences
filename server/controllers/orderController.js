const db = require('../lib/db');

exports.listMine = async (req, res) => {
  try {
    const orders = await db.orders.listForUser(req.user.id);
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMineByOrderNumber = async (req, res) => {
  try {
    const order = await db.orders.getByOrderNumber(req.params.orderNumber, req.user.id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
