const db = require('../lib/db');
const emailService = require('../services/orderEmailService');

exports.list = (req, res) => {
  try {
    const orders = db.orders.listAll({ status: req.query.status });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getById = (req, res) => {
  try {
    const order = db.orders.getById(Number(req.params.id));
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Updates order status, appends a timeline entry, logs the action, and emails
// the customer. The customer's live tracking page reflects it immediately.
exports.updateStatus = (req, res) => {
  try {
    const { status, notes } = req.body;
    const order = db.orders.updateStatus(Number(req.params.id), status, req.user.username, notes);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

    db.activityLogs.record({
      admin: req.user.username,
      action: 'order.status_updated',
      entityType: 'order',
      entityId: order.id,
      description: `Order ${order.orderNumber} → "${status}"${notes ? ` (${notes})` : ''}`,
    });

    // Fire-and-forget emails (order already includes items + address).
    emailService.notifyOrderStatusChanged(order).catch((err) => console.error('Order status email failed:', err.message));
    if (status === 'cancelled') {
      emailService.notifyAdminOrderCancelled(order).catch((err) => console.error('Admin cancellation email failed:', err.message));
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Mark COD payment collected / pending.
exports.updatePaymentStatus = (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = db.orders.updatePaymentStatus(Number(req.params.id), paymentStatus);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    db.activityLogs.record({
      admin: req.user.username,
      action: 'order.payment_updated',
      entityType: 'order',
      entityId: order.id,
      description: `Order ${order.orderNumber} payment → "${paymentStatus}"`,
    });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Add an internal/customer-facing note to the timeline without changing status.
exports.addNote = (req, res) => {
  try {
    const order = db.orders.getById(Number(req.params.id));
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    db.orderTimeline.add(order.id, order.orderStatus, req.user.username, req.body.notes);
    res.json({ success: true, order: db.orders.getById(order.id) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.remove = (req, res) => {
  try {
    const order = db.orders.getById(Number(req.params.id));
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    db.orders.remove(order.id);
    db.activityLogs.record({
      admin: req.user.username,
      action: 'order.deleted',
      entityType: 'order',
      entityId: order.id,
      description: `Deleted order ${order.orderNumber}`,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
