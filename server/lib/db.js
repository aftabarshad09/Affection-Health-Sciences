const crypto = require('crypto');
const db = require('./sqlite');

// ── helpers ───────────────────────────────────────────────────────────────
const bool = (v) => (v ? 1 : 0);
const parseJSON = (v, fallback) => {
  if (v == null) return fallback;
  if (typeof v !== 'string') return v;
  try { return JSON.parse(v); } catch { return fallback; }
};

// ── Mappers (row → camelCase JS) ────────────────────────────────────────────
const productFromRow = (row) => {
  if (!row) return null;
  const p = {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    cardLine: row.card_line,
    category: row.category,
    badge: row.badge,
    description: row.description,
    benefits: parseJSON(row.benefits, []),
    ingredients: parseJSON(row.ingredients, []),
    dosage: row.dosage,
    form: row.form,
    sku: row.sku,
    slug: row.slug,
    categoryId: row.category_id,
    retailPrice: row.retail_price,
    salePrice: row.sale_price,
    stock: row.stock,
    featured: !!row.featured,
    commerceStatus: row.commerce_status,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
  };
  if (row.is_dual_pack) {
    p.isDualPack = true;
    if (row.card_variant) p.cardVariant = row.card_variant;
    p.imageA = row.image_a;
    p.imageB = row.image_b;
  } else {
    p.image = row.image;
  }
  return p;
};

const categoryFromRow = (row) => row && ({
  id: row.id, name: row.name, slug: row.slug, image: row.image,
  description: row.description, status: row.status, sortOrder: row.sort_order,
});

const reviewFromRow = (row) => row && ({
  id: row.id, name: row.name, email: row.email, location: row.location,
  product: row.product, rating: row.rating, date: row.date,
  verified: !!row.verified, helpful: row.helpful, title: row.title,
  text: row.text, status: row.status, featured: !!row.featured,
});

const orderItemFromRow = (row) => ({
  id: row.id, orderId: row.order_id, productId: row.product_id,
  title: row.title, sku: row.sku, price: row.price, quantity: row.quantity, subtotal: row.subtotal,
});

const timelineFromRow = (row) => ({
  id: row.id, orderId: row.order_id, status: row.status,
  updatedBy: row.updated_by, notes: row.notes, createdAt: row.created_at,
});

const orderFromRow = (row, { items, timeline } = {}) => {
  if (!row) return null;
  return {
    id: row.id,
    orderNumber: row.order_number,
    trackToken: row.track_token,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    address: parseJSON(row.address, {}),
    subtotal: row.subtotal,
    shipping: row.shipping,
    discount: row.discount,
    tax: row.tax,
    grandTotal: row.grand_total,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    orderStatus: row.order_status,
    notes: row.notes,
    createdAt: row.created_at,
    items: items ? items.map(orderItemFromRow) : undefined,
    timeline: timeline ? timeline.map(timelineFromRow) : undefined,
  };
};

const settingsFromRow = (row) => ({
  flatShippingRate: row.flat_shipping_rate,
  freeShippingThreshold: row.free_shipping_threshold,
  taxRate: row.tax_rate,
  updatedAt: row.updated_at,
});

// ── Products ────────────────────────────────────────────────────────────────
const productToInsert = (p) => ({
  name: p.name, tagline: p.tagline, card_line: p.cardLine, category: p.category,
  badge: p.badge || null, description: p.description,
  benefits: JSON.stringify(p.benefits || []), ingredients: JSON.stringify(p.ingredients || []),
  dosage: p.dosage, form: p.form,
  is_dual_pack: bool(p.isDualPack), card_variant: p.cardVariant || null,
  image: p.image || null, image_a: p.imageA || null, image_b: p.imageB || null,
});

const products = {
  list() {
    return db.prepare('SELECT * FROM products ORDER BY id').all().map(productFromRow);
  },
  listActive() {
    return db.prepare("SELECT * FROM products WHERE commerce_status='active' ORDER BY featured DESC, id").all().map(productFromRow);
  },
  getById(id) {
    return productFromRow(db.prepare('SELECT * FROM products WHERE id = ?').get(id));
  },
  getBySlug(slug) {
    return productFromRow(db.prepare('SELECT * FROM products WHERE slug = ?').get(slug));
  },
  create(product) {
    const r = productToInsert(product);
    const info = db.prepare(`INSERT INTO products
      (name,tagline,card_line,category,badge,description,benefits,ingredients,dosage,form,is_dual_pack,card_variant,image,image_a,image_b)
      VALUES (@name,@tagline,@card_line,@category,@badge,@description,@benefits,@ingredients,@dosage,@form,@is_dual_pack,@card_variant,@image,@image_a,@image_b)`).run(r);
    return products.getById(info.lastInsertRowid);
  },
  update(id, product) {
    const r = productToInsert(product);
    db.prepare(`UPDATE products SET
      name=@name,tagline=@tagline,card_line=@card_line,category=@category,badge=@badge,description=@description,
      benefits=@benefits,ingredients=@ingredients,dosage=@dosage,form=@form,is_dual_pack=@is_dual_pack,
      card_variant=@card_variant,image=@image,image_a=@image_a,image_b=@image_b,updated_at=datetime('now')
      WHERE id=@id`).run({ ...r, id });
    return products.getById(id);
  },
  updateCommerce(id, patch) {
    const map = {
      sku: 'sku', slug: 'slug', categoryId: 'category_id', retailPrice: 'retail_price',
      salePrice: 'sale_price', stock: 'stock', featured: 'featured', commerceStatus: 'commerce_status',
      metaTitle: 'meta_title', metaDescription: 'meta_description',
    };
    const sets = [];
    const vals = {};
    for (const [k, col] of Object.entries(map)) {
      if (patch[k] !== undefined) {
        sets.push(`${col} = @${col}`);
        vals[col] = col === 'featured' ? bool(patch[k]) : patch[k];
      }
    }
    if (sets.length) {
      db.prepare(`UPDATE products SET ${sets.join(', ')}, updated_at=datetime('now') WHERE id=@id`).run({ ...vals, id });
    }
    return products.getById(id);
  },
  remove(id) {
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
  },
};

// ── Categories ──────────────────────────────────────────────────────────────
const categories = {
  list() {
    return db.prepare('SELECT * FROM categories ORDER BY sort_order, name').all().map(categoryFromRow);
  },
  listActive() {
    return db.prepare("SELECT * FROM categories WHERE status='active' ORDER BY sort_order, name").all().map(categoryFromRow);
  },
  getBySlug(slug) {
    return categoryFromRow(db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug));
  },
  create(c) {
    const info = db.prepare(`INSERT INTO categories (name,slug,image,description,status,sort_order)
      VALUES (@name,@slug,@image,@description,@status,@sort_order)`).run({
      name: c.name, slug: c.slug, image: c.image || null, description: c.description || null,
      status: c.status || 'active', sort_order: c.sortOrder || 0,
    });
    return categoryFromRow(db.prepare('SELECT * FROM categories WHERE id = ?').get(info.lastInsertRowid));
  },
  update(id, c) {
    const cur = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!cur) return null;
    db.prepare(`UPDATE categories SET name=@name,slug=@slug,image=@image,description=@description,status=@status,sort_order=@sort_order,updated_at=datetime('now') WHERE id=@id`).run({
      name: c.name ?? cur.name, slug: c.slug ?? cur.slug, image: c.image ?? cur.image,
      description: c.description ?? cur.description, status: c.status ?? cur.status,
      sort_order: c.sortOrder ?? cur.sort_order, id,
    });
    return categoryFromRow(db.prepare('SELECT * FROM categories WHERE id = ?').get(id));
  },
  remove(id) {
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  },
};

// ── Reviews ─────────────────────────────────────────────────────────────────
const reviews = {
  list(filter = {}) {
    let sql = 'SELECT * FROM reviews';
    const where = [];
    const params = {};
    if (filter.status) { where.push('status = @status'); params.status = filter.status; }
    if (filter.featured === true) { where.push('featured = 1'); }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY id';
    return db.prepare(sql).all(params).map(reviewFromRow);
  },
  create(r) {
    const info = db.prepare(`INSERT INTO reviews (name,email,location,product,rating,date,verified,helpful,title,text,status,featured)
      VALUES (@name,@email,@location,@product,@rating,@date,@verified,@helpful,@title,@text,@status,@featured)`).run({
      name: r.name, email: r.email || '', location: r.location || '', product: r.product || '',
      rating: r.rating, date: r.date, verified: bool(r.verified), helpful: r.helpful || 0,
      title: r.title || '', text: r.text, status: r.status || 'pending', featured: bool(r.featured),
    });
    return reviewFromRow(db.prepare('SELECT * FROM reviews WHERE id = ?').get(info.lastInsertRowid));
  },
  update(id, updates) {
    const cur = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    if (!cur) return null;
    const allowed = ['name', 'location', 'product', 'rating', 'title', 'text', 'status', 'email'];
    const sets = [];
    const vals = { id };
    for (const k of allowed) if (updates[k] !== undefined) { sets.push(`${k} = @${k}`); vals[k] = updates[k]; }
    for (const k of ['verified', 'featured']) if (updates[k] !== undefined) { sets.push(`${k} = @${k}`); vals[k] = bool(updates[k]); }
    if (updates.helpful !== undefined) { sets.push('helpful = @helpful'); vals.helpful = updates.helpful; }
    if (sets.length) db.prepare(`UPDATE reviews SET ${sets.join(', ')} WHERE id = @id`).run(vals);
    return reviewFromRow(db.prepare('SELECT * FROM reviews WHERE id = ?').get(id));
  },
  remove(id) {
    db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
  },
};

// ── Settings ────────────────────────────────────────────────────────────────
const settings = {
  get() {
    return settingsFromRow(db.prepare('SELECT * FROM settings WHERE id = 1').get());
  },
  update(patch) {
    const cur = db.prepare('SELECT * FROM settings WHERE id = 1').get();
    db.prepare(`UPDATE settings SET flat_shipping_rate=@f, free_shipping_threshold=@t, tax_rate=@x, updated_at=datetime('now') WHERE id = 1`).run({
      f: patch.flatShippingRate ?? cur.flat_shipping_rate,
      t: patch.freeShippingThreshold ?? cur.free_shipping_threshold,
      x: patch.taxRate ?? cur.tax_rate,
    });
    return settings.get();
  },
};

// ── Orders ──────────────────────────────────────────────────────────────────
const loadOrder = (row) => {
  if (!row) return null;
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ? ORDER BY id').all(row.id);
  const timeline = db.prepare('SELECT * FROM order_timeline WHERE order_id = ? ORDER BY created_at, id').all(row.id);
  return orderFromRow(row, { items, timeline });
};

const orders = {
  // Guest checkout — computes all totals server-side (never trusts the client),
  // generates a human-readable order number + a secret tracking token, and
  // writes the order + snapshot items + initial timeline, all in one
  // transaction. Unpriced ("price on request") items contribute 0.
  placeGuest: db.transaction(({ customer, address, items, notes }) => {
    if (!items || !items.length) throw new Error('Cannot place an order with no items');
    const cfg = settings.get();
    let subtotal = 0;
    const lines = [];
    for (const it of items) {
      const qty = Number(it.quantity);
      if (!it.productId || !qty || qty <= 0) throw new Error('Invalid order item');
      const p = db.prepare('SELECT * FROM products WHERE id = ?').get(it.productId);
      if (!p) throw new Error('Product ' + it.productId + ' not found');
      const price = p.sale_price ?? p.retail_price ?? 0;
      subtotal += price * qty;
      lines.push({ product_id: p.id, title: p.name, sku: p.sku, price, quantity: qty, subtotal: price * qty });
    }
    let shipping = cfg.flatShippingRate;
    if (cfg.freeShippingThreshold > 0 && subtotal >= cfg.freeShippingThreshold) shipping = 0;
    const tax = Math.round((subtotal * (cfg.taxRate || 0)) / 100);
    const grand = subtotal + shipping + tax;

    const seq = db.prepare('UPDATE order_counter SET value = value + 1 WHERE id = 1 RETURNING value').get().value;
    const now = new Date();
    const ymd = now.toISOString().slice(0, 10).replace(/-/g, '');
    const orderNumber = `ORD-${ymd}-${String(seq).padStart(6, '0')}`;
    const trackToken = crypto.randomBytes(16).toString('hex');

    const info = db.prepare(`INSERT INTO orders
      (order_number,track_token,customer_name,customer_email,customer_phone,address,subtotal,shipping,discount,tax,grand_total,notes)
      VALUES (@order_number,@track_token,@name,@email,@phone,@address,@subtotal,@shipping,0,@tax,@grand,@notes)`).run({
      order_number: orderNumber, track_token: trackToken,
      name: customer.name, email: customer.email, phone: customer.phone,
      address: JSON.stringify(address), subtotal, shipping, tax, grand, notes: notes || null,
    });
    const orderId = info.lastInsertRowid;
    const insItem = db.prepare(`INSERT INTO order_items (order_id,product_id,title,sku,price,quantity,subtotal)
      VALUES (@order_id,@product_id,@title,@sku,@price,@quantity,@subtotal)`);
    for (const l of lines) insItem.run({ order_id: orderId, ...l });
    db.prepare(`INSERT INTO order_timeline (order_id,status,updated_by,notes) VALUES (?,?,?,?)`).run(orderId, 'pending', 'customer', 'Order placed by customer');

    return loadOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId));
  }),

  listAll(filter = {}) {
    let sql = 'SELECT * FROM orders';
    const params = {};
    if (filter.status) { sql += ' WHERE order_status = @status'; params.status = filter.status; }
    sql += ' ORDER BY created_at DESC, id DESC';
    return db.prepare(sql).all(params).map((row) => loadOrder(row));
  },
  getById(id) {
    return loadOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(id));
  },
  getByOrderNumber(orderNumber) {
    return loadOrder(db.prepare('SELECT * FROM orders WHERE order_number = ?').get(orderNumber));
  },
  getByTrackToken(token) {
    return loadOrder(db.prepare('SELECT * FROM orders WHERE track_token = ?').get(token));
  },
  updateStatus(id, status, updatedBy, notes) {
    db.prepare(`UPDATE orders SET order_status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, id);
    orderTimeline.add(id, status, updatedBy, notes);
    return orders.getById(id);
  },
  updatePaymentStatus(id, paymentStatus) {
    db.prepare(`UPDATE orders SET payment_status = ?, updated_at = datetime('now') WHERE id = ?`).run(paymentStatus, id);
    return orders.getById(id);
  },
  remove(id) {
    db.prepare('DELETE FROM orders WHERE id = ?').run(id);
  },
};

// ── Order timeline ──────────────────────────────────────────────────────────
const orderTimeline = {
  listForOrder(orderId) {
    return db.prepare('SELECT * FROM order_timeline WHERE order_id = ? ORDER BY created_at, id').all(orderId).map(timelineFromRow);
  },
  add(orderId, status, updatedBy, notes) {
    const info = db.prepare(`INSERT INTO order_timeline (order_id,status,updated_by,notes) VALUES (?,?,?,?)`).run(orderId, status, updatedBy || null, notes || null);
    return timelineFromRow(db.prepare('SELECT * FROM order_timeline WHERE id = ?').get(info.lastInsertRowid));
  },
};

// ── Admin activity logs ─────────────────────────────────────────────────────
const activityLogs = {
  list(limit = 100) {
    return db.prepare('SELECT * FROM admin_activity_logs ORDER BY created_at DESC, id DESC LIMIT ?').all(limit).map((row) => ({
      id: row.id, admin: row.admin, action: row.action, entityType: row.entity_type,
      entityId: row.entity_id, description: row.description, metadata: parseJSON(row.metadata, null), createdAt: row.created_at,
    }));
  },
  record({ admin, adminId, action, entityType, entityId, description, metadata }) {
    db.prepare(`INSERT INTO admin_activity_logs (admin,action,entity_type,entity_id,description,metadata) VALUES (?,?,?,?,?,?)`).run(
      admin || adminId || null, action, entityType || null, entityId != null ? String(entityId) : null,
      description || null, metadata ? JSON.stringify(metadata) : null
    );
  },
};

// ── Dashboard ───────────────────────────────────────────────────────────────
const LOW_STOCK = 10;
const dashboard = {
  getStats() {
    const totalOrders = db.prepare('SELECT COUNT(*) c FROM orders').get().c;
    const pendingOrders = db.prepare("SELECT COUNT(*) c FROM orders WHERE order_status='pending'").get().c;
    const revenue = db.prepare("SELECT COALESCE(SUM(grand_total),0) s FROM orders WHERE order_status NOT IN ('cancelled','returned')").get().s;
    const productsCount = db.prepare("SELECT COUNT(*) c FROM products WHERE commerce_status='active'").get().c;
    const recentOrders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC, id DESC LIMIT 6').all().map((r) => loadOrder(r));
    const topSellingProducts = db.prepare(`SELECT product_id as productId, title, SUM(quantity) as quantitySold
      FROM order_items GROUP BY product_id, title ORDER BY quantitySold DESC LIMIT 5`).all();
    const lowStockProducts = db.prepare("SELECT * FROM products WHERE commerce_status='active' AND stock <= ? ORDER BY stock").all(LOW_STOCK).map(productFromRow);
    return {
      totalOrders, pendingOrders, revenue, productsCount,
      usersCount: 0, // no customer accounts in this store
      recentOrders, topSellingProducts, lowStockProducts, latestCustomers: [],
    };
  },
};

module.exports = {
  products, categories, reviews, settings,
  orders, orderTimeline, activityLogs, dashboard,
};
