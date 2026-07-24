const db = require('../lib/db');

exports.list = async (req, res) => {
  try {
    const orders = await db.orders.listAll({ status: req.query.status });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const order = await db.orders.getById(Number(req.params.id));
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Updates order status, appends a timeline entry, and logs the admin action.
// Email notification to the customer is wired in via emailService (Phase 7).
exports.updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const order = await db.orders.updateStatus(Number(req.params.id), status, req.user.id, notes);

    await db.activityLogs.record({
      adminId: req.user.id,
      action: 'order.status_updated',
      entityType: 'order',
      entityId: order.id,
      description: `Order ${order.orderNumber} status changed to "${status}"`,
    });

    const emailService = require('../services/orderEmailService');
    db.orders.getById(order.id).then((fullOrder) => {
      emailService.notifyOrderStatusChanged(fullOrder).catch((err) => console.error('Order status email failed:', err.message));
      if (status === 'cancelled') {
        emailService.notifyAdminOrderCancelled(fullOrder).catch((err) => console.error('Admin cancellation email failed:', err.message));
      }
    });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
