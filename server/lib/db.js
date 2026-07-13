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

module.exports = { blogs, products, reviews };
