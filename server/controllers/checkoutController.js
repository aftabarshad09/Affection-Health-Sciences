const db = require('../lib/db');

const addressToSnapshot = (a) => ({
  receiver_name: a.receiverName,
  phone: a.phone,
  province: a.province,
  city: a.city,
  area: a.area || null,
  postal_code: a.postalCode || null,
  address_line: a.addressLine,
});

// Places an order via the atomic place_order() Postgres function — this
// controller never computes or trusts a total from the client; it only
// resolves the address and forwards items to be priced/validated server-side.
exports.placeOrder = async (req, res) => {
  try {
    const { addressId, address, saveAddress, items, notes } = req.body;

    let addressSnapshot;
    if (addressId) {
      const existing = await db.addresses.getById(addressId);
      if (!existing || existing.userId !== req.user.id) {
        return res.status(404).json({ success: false, error: 'Address not found' });
      }
      addressSnapshot = addressToSnapshot(existing);
    } else {
      if (saveAddress) {
        const saved = await db.addresses.create(req.user.id, address);
        addressSnapshot = addressToSnapshot(saved);
      } else {
        addressSnapshot = addressToSnapshot(address);
      }
    }

    const order = await db.orders.place({
      userId: req.user.id,
      address: addressSnapshot,
      items,
      notes,
    });

    // place_order() returns the bare orders row (no items) — re-fetch with
    // the joined order_items for the confirmation/notification emails.
    const emailService = require('../services/orderEmailService');
    db.orders.getById(order.id).then((fullOrder) => {
      emailService.notifyOrderPlaced(fullOrder).catch((err) => console.error('Order confirmation email failed:', err.message));
      emailService.notifyAdminNewOrder(fullOrder).catch((err) => console.error('Admin new-order email failed:', err.message));
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    // place_order() raises plain exceptions for business-rule failures
    // (out of stock, unavailable product, empty cart) — surface those as
    // 400s instead of generic 500s.
    const isBusinessRuleError = /stock|available|no items/i.test(err.message);
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
