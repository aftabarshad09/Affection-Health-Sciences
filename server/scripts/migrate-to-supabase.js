/**
 * One-time migration: seeds existing JSON data into Supabase and uploads
 * local images from server/uploads/ to Cloudinary.
 *
 * Run AFTER adding credentials to server/.env:
 *   node server/scripts/migrate-to-supabase.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;

// ── Init ──────────────────────────────────────────────────────────────────────

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Helpers ───────────────────────────────────────────────────────────────────

const readJSON = (name) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, '../data', `${name}.json`), 'utf-8'));

// Uploads a local /uploads/... path to Cloudinary, returns the secure URL.
// If the file doesn't exist locally, returns the original path unchanged.
const uploadToCloudinary = async (localUrl, folder) => {
  if (!localUrl) return null;
  const filename = path.basename(localUrl);
  const localPath = path.join(__dirname, '../uploads', folder, filename);
  if (!fs.existsSync(localPath)) {
    console.warn(`  ⚠  File not found locally, keeping original URL: ${localUrl}`);
    return localUrl;
  }
  const result = await cloudinary.uploader.upload(localPath, {
    folder: `affection-health/${folder}`,
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });
  console.log(`  ✓  Uploaded ${filename} → ${result.secure_url}`);
  return result.secure_url;
};

// ── Products ──────────────────────────────────────────────────────────────────

const migrateProducts = async () => {
  console.log('\n📦 Migrating products...');
  const products = readJSON('products');

  for (const p of products) {
    const image = await uploadToCloudinary(p.image, 'products');
    const imageA = await uploadToCloudinary(p.imageA, 'products');
    const imageB = await uploadToCloudinary(p.imageB, 'products');

    const { error } = await supabase.from('products').upsert({
      id: p.id,
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
      image: image || null,
      image_a: imageA || null,
      image_b: imageB || null,
    });

    if (error) console.error(`  ✗  ${p.name}: ${error.message}`);
    else console.log(`  ✓  Product: ${p.name}`);
  }
};

// ── Blogs ─────────────────────────────────────────────────────────────────────

const migrateBlogs = async () => {
  console.log('\n📝 Migrating blogs...');
  const blogs = readJSON('blogs');

  for (const b of blogs) {
    // Upload featuredImage
    const featuredImage = await uploadToCloudinary(b.featuredImage, 'blogs');

    // Upload any inline image sections
    const sections = await Promise.all(
      (b.sections || []).map(async (s) => {
        if (s.type !== 'image') return s;
        const src = await uploadToCloudinary(s.src, 'blogs');
        return { ...s, src };
      })
    );

    const { error } = await supabase.from('blogs').upsert({
      id: b.id,
      slug: b.slug,
      title: b.title,
      author: b.author,
      date: b.date,
      read_time: b.readTime,
      category: b.category,
      category_color: b.categoryColor,
      featured_image: featuredImage,
      sections,
    });

    if (error) console.error(`  ✗  ${b.slug}: ${error.message}`);
    else console.log(`  ✓  Blog: ${b.slug}`);
  }
};

// ── Reviews ───────────────────────────────────────────────────────────────────

const migrateReviews = async () => {
  console.log('\n⭐ Migrating reviews...');
  const reviews = readJSON('reviews');

  for (const r of reviews) {
    const { error } = await supabase.from('reviews').upsert({
      id: r.id,
      name: r.name,
      email: r.email || '',
      location: r.location || '',
      product: r.product || '',
      rating: r.rating,
      date: r.date,
      verified: r.verified || false,
      helpful: r.helpful || 0,
      title: r.title || '',
      text: r.text,
      status: r.status || 'approved',
      featured: r.featured || false,
    });

    if (error) console.error(`  ✗  ${r.name}: ${error.message}`);
    else console.log(`  ✓  Review: ${r.name}`);
  }
};

// ── Run ───────────────────────────────────────────────────────────────────────

(async () => {
  console.log('🚀 Starting migration to Supabase + Cloudinary...');

  const missing = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
    .filter((k) => !process.env[k]);

  if (missing.length) {
    console.error(`\n❌ Missing env vars: ${missing.join(', ')}`);
    console.error('Add them to server/.env and try again.');
    process.exit(1);
  }

  try {
    await migrateProducts();
    await migrateBlogs();
    await migrateReviews();
    console.log('\n✅ Migration complete!');
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
  }
})();
