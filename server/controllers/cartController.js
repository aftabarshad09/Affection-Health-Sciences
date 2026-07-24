const db = require('../lib/db');

exports.list = async (req, res) => {
  try {
    const items = await db.cart.listItems(req.user.id);
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await db.products.getById(productId);
    if (!product || product.commerceStatus !== 'active') {
      return res.status(404).json({ success: false, error: 'This product is not available' });
    }
    const item = await db.cart.addOrUpdateItem(req.user.id, productId, quantity);
    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await db.cart.updateItemQuantity(req.user.id, Number(req.params.id), req.body.quantity);
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    await db.cart.removeItem(req.user.id, Number(req.params.id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.clear = async (req, res) => {
  try {
    await db.cart.clear(req.user.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Merges a guest's localStorage cart into their DB cart right after login —
// quantities are summed for products already in the DB cart.
exports.merge = async (req, res) => {
  try {
    const { items } = req.body; // [{productId, quantity}]
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, error: 'items must be an array' });
    }
    const existing = await db.cart.listItems(req.user.id);
    const existingByProduct = new Map(existing.map((i) => [i.productId, i]));

    for (const guestItem of items) {
      const productId = Number(guestItem.productId);
      const quantity = Number(guestItem.quantity);
      if (!productId || !quantity || quantity <= 0) continue;

      const product = await db.products.getById(productId);
      if (!product || product.commerceStatus !== 'active') continue;

      const current = existingByProduct.get(productId);
      const mergedQuantity = Math.min((current?.quantity || 0) + quantity, 50);
      await db.cart.addOrUpdateItem(req.user.id, productId, mergedQuantity);
    }

    const items_ = await db.cart.listItems(req.user.id);
    res.json({ success: true, items: items_ });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
