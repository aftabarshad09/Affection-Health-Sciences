const db = require('../lib/db');

const parseJSONField = (value, fallback) => {
  if (!value) return fallback;
  try { return JSON.parse(value); } catch { return fallback; }
};

const buildProductFromBody = (body, files, existing) => {
  const isDualPack = body.isDualPack === 'true';
  const product = {
    name: body.name,
    tagline: body.tagline,
    cardLine: body.cardLine,
    category: body.category,
    badge: body.badge || null,
    description: body.description,
    benefits: parseJSONField(body.benefits, existing?.benefits || []),
    ingredients: parseJSONField(body.ingredients, existing?.ingredients || []),
    dosage: body.dosage,
    form: body.form,
  };

  if (isDualPack) {
    product.isDualPack = true;
    if (body.cardVariant) product.cardVariant = body.cardVariant;
    // req.file.path is the Cloudinary URL
    product.imageA = files?.imageA?.[0] ? files.imageA[0].path : existing?.imageA;
    product.imageB = files?.imageB?.[0] ? files.imageB[0].path : existing?.imageB;
  } else {
    product.image = files?.image?.[0] ? files.image[0].path : existing?.image;
  }

  return product;
};

exports.list = async (req, res) => {
  try {
    const products = await db.products.list();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const product = await db.products.create(buildProductFromBody(req.body, req.files));
    await db.activityLogs.record({
      adminId: req.user.id,
      action: 'product.created',
      entityType: 'product',
      entityId: product.id,
      description: `Created product "${product.name}"`,
    });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await db.products.getById(Number(req.params.id));
    if (!existing) return res.status(404).json({ success: false, error: 'Product not found' });
    const updated = await db.products.update(Number(req.params.id), buildProductFromBody(req.body, req.files, existing));
    await db.activityLogs.record({
      adminId: req.user.id,
      action: 'product.updated',
      entityType: 'product',
      entityId: updated.id,
      description: `Updated product "${updated.name}"`,
    });
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const existing = await db.products.getById(Number(req.params.id));
    await db.products.remove(Number(req.params.id));
    await db.activityLogs.record({
      adminId: req.user.id,
      action: 'product.deleted',
      entityType: 'product',
      entityId: req.params.id,
      description: `Deleted product "${existing?.name || req.params.id}"`,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Patches only the commerce columns (price/stock/sku/category/status/...) —
// a plain JSON endpoint separate from create/update above, which are
// multipart/form-data for the marketing-image upload flow.
exports.updateCommerce = async (req, res) => {
  try {
    const existing = await db.products.getById(Number(req.params.id));
    if (!existing) return res.status(404).json({ success: false, error: 'Product not found' });

    const product = await db.products.updateCommerce(Number(req.params.id), {
      ...req.body,
      updatedBy: req.user.id,
    });
    await db.activityLogs.record({
      adminId: req.user.id,
      action: 'product.commerce_updated',
      entityType: 'product',
      entityId: product.id,
      description: `Updated commerce details for "${product.name}"`,
      metadata: req.body,
    });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
