// One-time backfill: populates the new commerce columns on the 27 products
// that already exist in Supabase (verified live via `products.list()` — the
// catalog was already trimmed to exactly these 27, so nothing gets archived).
// Safe to re-run: categories are upserted by slug, products updated by id.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../lib/db');

const slugify = (s) => s.toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

// name -> {slug, sortOrder} — the 14 categories already in use, in a sensible
// storefront order (life-stage/popular groups first).
const CATEGORIES = [
  "Women's Health",
  'Baby Nutrition',
  'Metabolic Support',
  'Energy & Performance',
  'Sports Nutrition',
  'Gut Health',
  'Liver Health',
  'Bone Health',
  'Skin & Antioxidant Care',
  'Immune Support',
  'Stress & Sleep',
  'Hormonal Health',
  'Brain Health',
  'Amino Acids',
].map((name, i) => ({ name, slug: slugify(name), sortOrder: i }));

// Matched against the attached distributor price list. Entries with
// retailPrice: null had no corresponding price-list row — they're seeded as
// 'draft' (in the catalog, not purchasable) until a real price is set.
const PRODUCT_COMMERCE = {
  1: { name: 'Gynogid', category: "Women's Health", retailPrice: 1935 },
  2: { name: 'MCT Lipdrop', category: 'Metabolic Support', retailPrice: null },
  3: { name: 'Glumin SR', category: 'Metabolic Support', retailPrice: 3171 },
  4: { name: 'MCT Lip', category: 'Metabolic Support', retailPrice: null },
  5: { name: 'Energid Plus', category: 'Energy & Performance', retailPrice: 2688 },
  6: { name: 'Best Protein', category: 'Sports Nutrition', retailPrice: 6396 },
  7: { name: 'Lactilus', category: 'Gut Health', retailPrice: 650 },
  8: { name: 'Hepatovital', category: 'Liver Health', retailPrice: 4515 },
  9: { name: 'MultiSoft', category: 'Bone Health', retailPrice: 450 },
  10: { name: 'Cabot-D3', category: 'Bone Health', retailPrice: 1500 },
  11: { name: 'Lipolite', category: 'Metabolic Support', retailPrice: 2000 },
  12: { name: 'Lactilus (2)', category: 'Gut Health', retailPrice: null }, // duplicate name of #7 in the DB — flagged, needs a distinguishing name + real price
  13: { name: 'PicWhite L-Glutathione', category: 'Skin & Antioxidant Care', retailPrice: null },
  14: { name: 'Hurma', category: 'Skin & Antioxidant Care', retailPrice: 1500 },
  15: { name: 'MagnaCalm', category: 'Stress & Sleep', retailPrice: null },
  16: { name: 'Vitamin-C Chewable', category: 'Immune Support', retailPrice: 1050 },
  17: { name: 'Vitamin-C 500', category: 'Immune Support', retailPrice: 1050 },
  18: { name: 'Mecsil-SL', category: 'Liver Health', retailPrice: 950 },
  19: { name: 'ThyroBalance', category: 'Hormonal Health', retailPrice: null },
  20: { name: 'Infantin AR', category: 'Baby Nutrition', retailPrice: 2033 },
  21: { name: 'Infantin Pre', category: 'Baby Nutrition', retailPrice: 2033 },
  22: { name: 'Infantin 3', category: 'Baby Nutrition', retailPrice: 1707 },
  23: { name: 'Infantin 1', category: 'Baby Nutrition', retailPrice: 1707 },
  24: { name: 'CollagenElite', category: 'Bone Health', retailPrice: null },
  25: { name: 'Infantin 2', category: 'Baby Nutrition', retailPrice: 1707 },
  26: { name: 'Mega-3', category: 'Brain Health', retailPrice: 1500 },
  27: { name: 'Babyline Cereal', category: 'Baby Nutrition', retailPrice: 495 }, // best-guess match to MyCereal — confirm in admin
};

async function upsertCategories() {
  const existing = await db.categories.list();
  const bySlug = new Map(existing.map((c) => [c.slug, c]));
  const result = new Map();

  for (const def of CATEGORIES) {
    let category = bySlug.get(def.slug);
    if (!category) {
      category = await db.categories.create(def);
      console.log(`✅ Created category "${def.name}"`);
    }
    result.set(def.name, category);
  }
  return result;
}

async function seedProducts(categoriesByName) {
  const products = await db.products.list();
  const byId = new Map(products.map((p) => [p.id, p]));
  let seeded = 0;
  let draft = 0;
  let skipped = 0;

  for (const [idStr, def] of Object.entries(PRODUCT_COMMERCE)) {
    const id = Number(idStr);
    const product = byId.get(id);
    if (!product) {
      console.warn(`⚠️  Product id ${id} ("${def.name}") not found — skipping`);
      skipped += 1;
      continue;
    }

    const category = categoriesByName.get(def.category);
    const slug = `${slugify(product.name)}-${id}`;
    const sku = `AHS-${String(id).padStart(4, '0')}`;
    const hasPrice = def.retailPrice != null;

    await db.products.updateCommerce(id, {
      sku,
      slug,
      categoryId: category.id,
      retailPrice: hasPrice ? def.retailPrice : null,
      // Placeholder starting stock so the shop isn't "out of stock" on day
      // one — correct the real quantity per product in Admin → Inventory.
      stock: hasPrice ? 50 : 0,
      commerceStatus: hasPrice ? 'active' : 'draft',
    });

    if (hasPrice) {
      seeded += 1;
      console.log(`✅ #${id} ${product.name} → active, Rs. ${def.retailPrice}`);
    } else {
      draft += 1;
      console.log(`⏸️  #${id} ${product.name} → draft (no price-list match, needs pricing)`);
    }
  }

  console.log(`\nDone: ${seeded} active, ${draft} draft, ${skipped} skipped.`);
}

async function seedSettings() {
  await db.settings.update({ flatShippingRate: 200, freeShippingThreshold: 0, taxRate: 0 });
  console.log('✅ Settings row confirmed (flat shipping Rs. 200)');
}

(async () => {
  try {
    const categoriesByName = await upsertCategories();
    await seedProducts(categoriesByName);
    await seedSettings();
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
})();
