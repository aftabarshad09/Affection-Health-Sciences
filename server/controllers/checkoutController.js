const db = require('../lib/db');

// Builds the delivery-address snapshot stored on the order (jsonb). Keys match
// what the admin order view and the email templates already read.
const addressToSnapshot = (customer, address) => ({
  receiver_name: customer.name,
  phone: customer.phone,
  email: customer.email,
  apartment: address.apartment || null,
  address_line: address.addressLine,
  area: address.area || null,
  city: address.city,
  province: address.province,
  postal_code: address.postalCode || null,
});

// Guest checkout (no login). The server computes all totals via the
// place_guest_order() function — client-submitted amounts are never trusted.
// On success it fires (fire-and-forget) the customer confirmation email, the
// admin new-order email, and the CallMeBot WhatsApp notification.
exports.placeGuestOrder = async (req, res) => {
  try {
    const { customer, address, items, notes } = req.body;

    const order = await db.orders.placeGuest({
      customer: { name: customer.name, email: customer.email, phone: customer.phone },
      address: addressToSnapshot(customer, address),
      items,
      notes,
    });

    // place_guest_order() returns the bare order row — re-fetch with items for
    // the notifications.
    db.orders.getById(order.id).then((fullOrder) => {
      const emailService = require('../services/orderEmailService');
      const whatsappService = require('../services/whatsappService');
      emailService.notifyOrderPlaced(fullOrder).catch((err) => console.error('Order confirmation email failed:', err.message));
      emailService.notifyAdminNewOrder(fullOrder).catch((err) => console.error('Admin new-order email failed:', err.message));
      whatsappService.notifyNewOrder(fullOrder).catch((err) => console.error('WhatsApp notification failed:', err.message));
    });

    res.status(201).json({ success: true, order: { orderNumber: order.orderNumber, grandTotal: order.grandTotal } });
  } catch (err) {
    const isBusinessRuleError = /no items|not found|invalid order item/i.test(err.message);
    res.status(isBusinessRuleError ? 400 : 500).json({ success: false, error: err.message });
  }
};

exports.getShippingSettings = async (req, res) => {
  try {
    const settings = await db.settings.get();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
