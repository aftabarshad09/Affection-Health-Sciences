const db = require('../lib/db');

// Public order tracking — the customer opens a personal link from their email
// (/track/:token). The token is the secret; no login required. Returns a
// customer-safe view of the order with its current status + timeline.
exports.getByToken = (req, res) => {
  try {
    const order = db.orders.getByTrackToken(req.params.token);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        address: order.address,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        discount: order.discount,
        tax: order.tax,
        grandTotal: order.grandTotal,
        notes: order.notes,
        timeline: order.timeline,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
