const supabase = require('./supabase');

// ── Mappers ──────────────────────────────────────────────────────────────────

const blogFromRow = (row) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  author: row.author,
  date: row.date,
  readTime: row.read_time,
  category: row.category,
  categoryColor: row.category_color,
  featuredImage: row.featured_image,
  sections: row.sections || [],
});

const productFromRow = (row) => {
  const p = {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    cardLine: row.card_line,
    category: row.category,
    badge: row.badge,
    description: row.description,
    benefits: row.benefits || [],
    ingredients: row.ingredients || [],
    dosage: row.dosage,
    form: row.form,
    // Commerce fields — null/undefined until a product is curated into the shop.
    sku: row.sku,
    slug: row.slug,
    categoryId: row.category_id,
    retailPrice: row.retail_price,
    salePrice: row.sale_price,
    stock: row.stock,
    featured: row.featured,
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

const productToRow = (p) => ({
  name: p.name,
  tagline: p.tagline,
  card_line: p.cardLine,
  category: p.category,
  badge: p.badge || null,
  description: p.description,
  benefits: p.benefits || [],
  ingredients: p.ingredients || [],
  dosage: p.dosage,
  form: p.form,
  is_dual_pack: p.isDualPack || false,
  card_variant: p.cardVariant || null,
  image: p.image || null,
  image_a: p.imageA || null,
  image_b: p.imageB || null,
});

// Commerce-only field patch — used by the admin product form's commerce
// section instead of productToRow, which stays scoped to marketing fields.
const productCommerceToRow = (p) => {
  const row = {};
  if (p.sku !== undefined) row.sku = p.sku;
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.categoryId !== undefined) row.category_id = p.categoryId;
  if (p.retailPrice !== undefined) row.retail_price = p.retailPrice;
  if (p.salePrice !== undefined) row.sale_price = p.salePrice;
  if (p.stock !== undefined) row.stock = p.stock;
  if (p.featured !== undefined) row.featured = p.featured;
  if (p.commerceStatus !== undefined) row.commerce_status = p.commerceStatus;
  if (p.metaTitle !== undefined) row.meta_title = p.metaTitle;
  if (p.metaDescription !== undefined) row.meta_description = p.metaDescription;
  if (p.updatedBy !== undefined) row.updated_by = p.updatedBy;
  return row;
};

const categoryFromRow = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  image: row.image,
  description: row.description,
  status: row.status,
  sortOrder: row.sort_order,
});

const addressFromRow = (row) => ({
  id: row.id,
  userId: row.user_id,
  receiverName: row.receiver_name,
  phone: row.phone,
  province: row.province,
  city: row.city,
  area: row.area,
  postalCode: row.postal_code,
  addressLine: row.address_line,
  isDefault: row.is_default,
});

const addressToRow = (a) => ({
  receiver_name: a.receiverName,
  phone: a.phone,
  province: a.province,
  city: a.city,
  area: a.area || null,
  postal_code: a.postalCode || null,
  address_line: a.addressLine,
  is_default: a.isDefault || false,
});

const cartItemFromRow = (row) => ({
  id: row.id,
  cartId: row.cart_id,
  productId: row.product_id,
  quantity: row.quantity,
  product: row.products ? productFromRow(row.products) : undefined,
});

const orderFromRow = (row) => ({
  id: row.id,
  orderNumber: row.order_number,
  userId: row.user_id,
  address: row.address,
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
  items: row.order_items ? row.order_items.map(orderItemFromRow) : undefined,
  timeline: row.order_timeline ? row.order_timeline.map(timelineFromRow) : undefined,
});

const orderItemFromRow = (row) => ({
  id: row.id,
  orderId: row.order_id,
  productId: row.product_id,
  title: row.title,
  sku: row.sku,
  price: row.price,
  quantity: row.quantity,
  subtotal: row.subtotal,
});

const timelineFromRow = (row) => ({
  id: row.id,
  orderId: row.order_id,
  status: row.status,
  updatedBy: row.updated_by,
  notes: row.notes,
  createdAt: row.created_at,
});

const activityLogFromRow = (row) => ({
  id: row.id,
  adminId: row.admin_id,
  action: row.action,
  entityType: row.entity_type,
  entityId: row.entity_id,
  description: row.description,
  metadata: row.metadata,
  createdAt: row.created_at,
});

const settingsFromRow = (row) => ({
  flatShippingRate: row.flat_shipping_rate,
  freeShippingThreshold: row.free_shipping_threshold,
  taxRate: row.tax_rate,
  updatedAt: row.updated_at,
});

const profileFromRow = (row) => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  phone: row.phone,
  avatarUrl: row.avatar_url,
  role: row.role,
  status: row.status,
  createdAt: row.created_at,
});

const reviewFromRow = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  location: row.location,
  product: row.product,
  rating: row.rating,
  date: row.date,
  verified: row.verified,
  helpful: row.helpful,
  title: row.title,
  text: row.text,
  status: row.status,
  featured: row.featured,
});

// ── Blogs ─────────────────────────────────────────────────────────────────────

const blogs = {
  async list() {
    const { data, error } = await supabase.from('blogs').select('*').order('id');
    if (error) throw error;
    return data.map(blogFromRow);
  },

  async getBySlug(slug) {
    const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).single();
    if (error) return null;
    return blogFromRow(data);
  },

  async create(post) {
    const { data, error } = await supabase.from('blogs').insert({
      slug: post.slug,
      title: post.title,
      author: post.author,
      date: post.date,
      read_time: post.readTime,
      category: post.category,
      category_color: post.categoryColor,
      featured_image: post.featuredImage,
      sections: post.sections || [],
    }).select().single();
    if (error) throw error;
    return blogFromRow(data);
  },

  async update(slug, post) {
    const { data, error } = await supabase.from('blogs').update({
      slug: post.slug,
      title: post.title,
      author: post.author,
      date: post.date,
      read_time: post.readTime,
      category: post.category,
      category_color: post.categoryColor,
      featured_image: post.featuredImage,
      sections: post.sections || [],
    }).eq('slug', slug).select().single();
    if (error) throw error;
    return blogFromRow(data);
  },

  async remove(slug) {
    const { error } = await supabase.from('blogs').delete().eq('slug', slug);
    if (error) throw error;
  },
};

// ── Products ──────────────────────────────────────────────────────────────────

const products = {
  async list() {
    const { data, error } = await supabase.from('products').select('*').order('id');
    if (error) throw error;
    return data.map(productFromRow);
  },

  async getById(id) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) return null;
    return productFromRow(data);
  },

  async create(product) {
    const { data, error } = await supabase.from('products').insert(productToRow(product)).select().single();
    if (error) throw error;
    return productFromRow(data);
  },

  async update(id, product) {
    const { data, error } = await supabase.from('products').update(productToRow(product)).eq('id', id).select().single();
    if (error) throw error;
    return productFromRow(data);
  },

  async remove(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  // Shop-facing listing: only products a curator has actually published.
  async listActive() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('commerce_status', 'active')
      .order('featured', { ascending: false })
      .order('id');
    if (error) throw error;
    return data.map(productFromRow);
  },

  async getBySlug(slug) {
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
    if (error) return null;
    return productFromRow(data);
  },

  // Patches only the commerce columns (price/stock/sku/category/status/...),
  // leaving the marketing fields (name/tagline/benefits/...) untouched.
  async updateCommerce(id, patch) {
    const { data, error } = await supabase
      .from('products')
      .update(productCommerceToRow(patch))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return productFromRow(data);
  },
};

// ── Categories ────────────────────────────────────────────────────────────────

const categories = {
  async list() {
    const { data, error } = await supabase.from('categories').select('*').order('sort_order').order('name');
    if (error) throw error;
    return data.map(categoryFromRow);
  },

  async listActive() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('status', 'active')
      .order('sort_order')
      .order('name');
    if (error) throw error;
    return data.map(categoryFromRow);
  },

  async getBySlug(slug) {
    const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single();
    if (error) return null;
    return categoryFromRow(data);
  },

  async create(category) {
    const { data, error } = await supabase.from('categories').insert({
      name: category.name,
      slug: category.slug,
      image: category.image || null,
      description: category.description || null,
      status: category.status || 'active',
      sort_order: category.sortOrder || 0,
    }).select().single();
    if (error) throw error;
    return categoryFromRow(data);
  },

  async update(id, category) {
    const row = {};
    if (category.name !== undefined) row.name = category.name;
    if (category.slug !== undefined) row.slug = category.slug;
    if (category.image !== undefined) row.image = category.image;
    if (category.description !== undefined) row.description = category.description;
    if (category.status !== undefined) row.status = category.status;
    if (category.sortOrder !== undefined) row.sort_order = category.sortOrder;
    const { data, error } = await supabase.from('categories').update(row).eq('id', id).select().single();
    if (error) throw error;
    return categoryFromRow(data);
  },

  async remove(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  },
};

// ── Product Images ────────────────────────────────────────────────────────────

const productImages = {
  async listForProduct(productId) {
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order');
    if (error) throw error;
    return data;
  },

  async create(productId, image) {
    const { data, error } = await supabase.from('product_images').insert({
      product_id: productId,
      url: image.url,
      alt_text: image.altText || null,
      sort_order: image.sortOrder || 0,
      is_primary: image.isPrimary || false,
    }).select().single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from('product_images').delete().eq('id', id);
    if (error) throw error;
  },
};

// ── Addresses ─────────────────────────────────────────────────────────────────

const addresses = {
  async listForUser(userId) {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('id', { ascending: false });
    if (error) throw error;
    return data.map(addressFromRow);
  },

  async getById(id) {
    const { data, error } = await supabase.from('addresses').select('*').eq('id', id).single();
    if (error) return null;
    return addressFromRow(data);
  },

  async create(userId, address) {
    if (address.isDefault) await addresses.clearDefault(userId);
    const { data, error } = await supabase
      .from('addresses')
      .insert({ ...addressToRow(address), user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return addressFromRow(data);
  },

  async update(id, userId, address) {
    if (address.isDefault) await addresses.clearDefault(userId);
    const { data, error } = await supabase
      .from('addresses')
      .update(addressToRow(address))
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return addressFromRow(data);
  },

  async remove(id, userId) {
    const { error } = await supabase.from('addresses').delete().eq('id', id).eq('user_id', userId);
    if (error) throw error;
  },

  async clearDefault(userId) {
    const { error } = await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
    if (error) throw error;
  },
};

// ── Cart ──────────────────────────────────────────────────────────────────────

const cart = {
  async getOrCreateForUser(userId) {
    const { data: existing, error: findErr } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (findErr) throw findErr;
    if (existing) return existing;

    const { data, error } = await supabase.from('carts').insert({ user_id: userId }).select().single();
    if (error) throw error;
    return data;
  },

  async listItems(userId) {
    const userCart = await cart.getOrCreateForUser(userId);
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('cart_id', userCart.id)
      .order('id');
    if (error) throw error;
    return data.map(cartItemFromRow);
  },

  async addOrUpdateItem(userId, productId, quantity) {
    const userCart = await cart.getOrCreateForUser(userId);
    const { data, error } = await supabase
      .from('cart_items')
      .upsert(
        { cart_id: userCart.id, product_id: productId, quantity },
        { onConflict: 'cart_id,product_id' }
      )
      .select()
      .single();
    if (error) throw error;
    return cartItemFromRow(data);
  },

  async updateItemQuantity(userId, itemId, quantity) {
    const userCart = await cart.getOrCreateForUser(userId);
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .eq('cart_id', userCart.id)
      .select()
      .single();
    if (error) throw error;
    return cartItemFromRow(data);
  },

  async removeItem(userId, itemId) {
    const userCart = await cart.getOrCreateForUser(userId);
    const { error } = await supabase.from('cart_items').delete().eq('id', itemId).eq('cart_id', userCart.id);
    if (error) throw error;
  },

  async clear(userId) {
    const userCart = await cart.getOrCreateForUser(userId);
    const { error } = await supabase.from('cart_items').delete().eq('cart_id', userCart.id);
    if (error) throw error;
  },
};

// ── Orders ────────────────────────────────────────────────────────────────────

const orders = {
  // Places the order atomically via the place_order() Postgres function —
  // stock validation, total calculation, and the order/items/timeline writes
  // all happen server-side in one transaction. See supabase/migrations/0006.
  async place({ userId, address, items, notes }) {
    const { data, error } = await supabase.rpc('place_order', {
      p_user_id: userId,
      p_address: address,
      p_items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
      p_notes: notes || null,
    });
    if (error) throw error;
    return orderFromRow(data);
  },

  async listForUser(userId) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(orderFromRow);
  },

  async listAll(filter = {}) {
    let query = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    if (filter.status) query = query.eq('order_status', filter.status);
    const { data, error } = await query;
    if (error) throw error;
    return data.map(orderFromRow);
  },

  async getByOrderNumber(orderNumber, userId = null) {
    let query = supabase
      .from('orders')
      .select('*, order_items(*), order_timeline(*)')
      .eq('order_number', orderNumber);
    if (userId) query = query.eq('user_id', userId);
    const { data, error } = await query.single();
    if (error) return null;
    return orderFromRow(data);
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), order_timeline(*)')
      .eq('id', id)
      .single();
    if (error) return null;
    return orderFromRow(data);
  },

  async updateStatus(id, status, updatedBy, notes) {
    const { data, error } = await supabase
      .from('orders')
      .update({ order_status: status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    await orderTimeline.add(id, status, updatedBy, notes);
    return orderFromRow(data);
  },
};

// ── Order Timeline ────────────────────────────────────────────────────────────

const orderTimeline = {
  async listForOrder(orderId) {
    const { data, error } = await supabase
      .from('order_timeline')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at');
    if (error) throw error;
    return data.map(timelineFromRow);
  },

  async add(orderId, status, updatedBy, notes) {
    const { data, error } = await supabase
      .from('order_timeline')
      .insert({ order_id: orderId, status, updated_by: updatedBy || null, notes: notes || null })
      .select()
      .single();
    if (error) throw error;
    return timelineFromRow(data);
  },
};

// ── Admin Activity Logs ───────────────────────────────────────────────────────

const activityLogs = {
  async list(limit = 100) {
    const { data, error } = await supabase
      .from('admin_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data.map(activityLogFromRow);
  },

  async record({ adminId, action, entityType, entityId, description, metadata }) {
    const { error } = await supabase.from('admin_activity_logs').insert({
      admin_id: adminId || null,
      action,
      entity_type: entityType || null,
      entity_id: entityId ? String(entityId) : null,
      description: description || null,
      metadata: metadata || null,
    });
    if (error) throw error;
  },
};

// ── Settings ──────────────────────────────────────────────────────────────────

const settings = {
  async get() {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (error) throw error;
    return settingsFromRow(data);
  },

  async update(patch, updatedBy) {
    const row = {};
    if (patch.flatShippingRate !== undefined) row.flat_shipping_rate = patch.flatShippingRate;
    if (patch.freeShippingThreshold !== undefined) row.free_shipping_threshold = patch.freeShippingThreshold;
    if (patch.taxRate !== undefined) row.tax_rate = patch.taxRate;
    row.updated_by = updatedBy || null;
    const { data, error } = await supabase.from('settings').update(row).eq('id', 1).select().single();
    if (error) throw error;
    return settingsFromRow(data);
  },
};

// ── Wishlist ──────────────────────────────────────────────────────────────────

const wishlist = {
  async listForUser(userId) {
    const { data, error } = await supabase
      .from('wishlists')
      .select('*, products(*)')
      .eq('user_id', userId);
    if (error) throw error;
    return data.map((row) => ({ id: row.id, product: productFromRow(row.products) }));
  },

  async add(userId, productId) {
    const { error } = await supabase
      .from('wishlists')
      .upsert({ user_id: userId, product_id: productId }, { onConflict: 'user_id,product_id' });
    if (error) throw error;
  },

  async remove(userId, productId) {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    if (error) throw error;
  },
};

// ── Profiles ──────────────────────────────────────────────────────────────────

const profiles = {
  async getById(id) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error) return null;
    return profileFromRow(data);
  },

  async list(filter = {}) {
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (filter.role) query = query.eq('role', filter.role);
    const { data, error } = await query;
    if (error) throw error;
    return data.map(profileFromRow);
  },

  // Self-service profile fields only — role/status are never editable here.
  async update(id, patch) {
    const row = {};
    if (patch.fullName !== undefined) row.full_name = patch.fullName;
    if (patch.phone !== undefined) row.phone = patch.phone;
    if (patch.avatarUrl !== undefined) row.avatar_url = patch.avatarUrl;
    const { data, error } = await supabase.from('profiles').update(row).eq('id', id).select().single();
    if (error) throw error;
    return profileFromRow(data);
  },

  // Privileged: only ever called from super_admin-gated controller paths.
  async setRole(id, role) {
    const { data, error } = await supabase.from('profiles').update({ role }).eq('id', id).select().single();
    if (error) throw error;
    return profileFromRow(data);
  },

  async setStatus(id, status) {
    const { data, error } = await supabase.from('profiles').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return profileFromRow(data);
  },
};

// ── Reviews ───────────────────────────────────────────────────────────────────

const reviews = {
  async list(filter = {}) {
    let query = supabase.from('reviews').select('*').order('id');
    if (filter.status) query = query.eq('status', filter.status);
    if (filter.featured === true) query = query.eq('featured', true);
    const { data, error } = await query;
    if (error) throw error;
    return data.map(reviewFromRow);
  },

  async create(review) {
    const { data, error } = await supabase.from('reviews').insert({
      name: review.name,
      email: review.email || '',
      location: review.location || '',
      product: review.product || '',
      rating: review.rating,
      date: review.date,
      verified: review.verified || false,
      helpful: review.helpful || 0,
      title: review.title || '',
      text: review.text,
      status: review.status || 'pending',
      featured: review.featured || false,
    }).select().single();
    if (error) throw error;
    return reviewFromRow(data);
  },

  async update(id, updates) {
    const allowed = ['name', 'location', 'product', 'rating', 'title', 'text', 'status', 'featured', 'verified', 'helpful', 'email'];
    const row = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) row[key] = updates[key];
    }
    const { data, error } = await supabase.from('reviews').update(row).eq('id', id).select().single();
    if (error) throw error;
    return reviewFromRow(data);
  },

  async remove(id) {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) throw error;
  },
};

// ── Admin Dashboard ───────────────────────────────────────────────────────────

const LOW_STOCK_THRESHOLD = 10;

const dashboard = {
  async getStats() {
    const [
      { count: totalOrders },
      { count: pendingOrders },
      { count: productsCount },
      { count: usersCount },
      { data: revenueOrders },
      { data: recentOrders },
      { data: orderItemsForTopSellers },
      { data: lowStockProducts },
      { data: latestCustomers },
    ] = await Promise.all([
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('order_status', 'pending'),
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('commerce_status', 'active'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
      supabase.from('orders').select('grand_total').not('order_status', 'in', '(cancelled,returned)'),
      supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(5),
      supabase.from('order_items').select('product_id, title, quantity'),
      supabase.from('products').select('*').eq('commerce_status', 'active').lte('stock', LOW_STOCK_THRESHOLD).order('stock'),
      supabase.from('profiles').select('*').eq('role', 'customer').order('created_at', { ascending: false }).limit(5),
    ]);

    const revenue = (revenueOrders || []).reduce((sum, o) => sum + Number(o.grand_total), 0);

    const salesByProduct = new Map();
    for (const item of orderItemsForTopSellers || []) {
      const key = item.product_id;
      const entry = salesByProduct.get(key) || { productId: key, title: item.title, quantitySold: 0 };
      entry.quantitySold += item.quantity;
      salesByProduct.set(key, entry);
    }
    const topSellingProducts = [...salesByProduct.values()]
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5);

    return {
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      revenue,
      productsCount: productsCount || 0,
      usersCount: usersCount || 0,
      recentOrders: (recentOrders || []).map(orderFromRow),
      topSellingProducts,
      lowStockProducts: (lowStockProducts || []).map(productFromRow),
      latestCustomers: (latestCustomers || []).map(profileFromRow),
    };
  },
};

module.exports = {
  blogs,
  products,
  reviews,
  categories,
  productImages,
  addresses,
  cart,
  orders,
  orderTimeline,
  activityLogs,
  settings,
  wishlist,
  profiles,
  dashboard,
};
