// Loads the data exported from Supabase (server/data/supabase-export.json)
// into the local SQLite database. Idempotent: clears and re-inserts the
// catalog tables (products, categories, reviews, settings). Does NOT touch
// orders. Run once after switching to SQLite: `npm run seed:sqlite`.
const fs = require('fs');
const path = require('path');
const db = require('../lib/sqlite');

const EXPORT = path.join(__dirname, '../data/supabase-export.json');
const b = (v) => (v ? 1 : 0);
const js = (v) => (v == null ? null : JSON.stringify(v));

function run() {
  const data = JSON.parse(fs.readFileSync(EXPORT, 'utf8'));

  const seed = db.transaction(() => {
    // Categories
    db.prepare('DELETE FROM categories').run();
    const insCat = db.prepare(`INSERT INTO categories (id,name,slug,image,description,status,sort_order)
      VALUES (@id,@name,@slug,@image,@description,@status,@sort_order)`);
    for (const c of data.categories || []) {
      insCat.run({ id: c.id, name: c.name, slug: c.slug, image: c.image ?? null,
        description: c.description ?? null, status: c.status ?? 'active', sort_order: c.sort_order ?? 0 });
    }

    // Products
    db.prepare('DELETE FROM products').run();
    const insProd = db.prepare(`INSERT INTO products
      (id,name,tagline,card_line,category,badge,description,benefits,ingredients,dosage,form,
       is_dual_pack,card_variant,image,image_a,image_b,sku,slug,category_id,retail_price,sale_price,
       stock,featured,commerce_status,meta_title,meta_description)
      VALUES (@id,@name,@tagline,@card_line,@category,@badge,@description,@benefits,@ingredients,@dosage,@form,
       @is_dual_pack,@card_variant,@image,@image_a,@image_b,@sku,@slug,@category_id,@retail_price,@sale_price,
       @stock,@featured,@commerce_status,@meta_title,@meta_description)`);
    for (const p of data.products || []) {
      insProd.run({
        id: p.id, name: p.name, tagline: p.tagline ?? null, card_line: p.card_line ?? null,
        category: p.category ?? null, badge: p.badge ?? null, description: p.description ?? null,
        benefits: js(p.benefits ?? []), ingredients: js(p.ingredients ?? []),
        dosage: p.dosage ?? null, form: p.form ?? null,
        is_dual_pack: b(p.is_dual_pack), card_variant: p.card_variant ?? null,
        image: p.image ?? null, image_a: p.image_a ?? null, image_b: p.image_b ?? null,
        sku: p.sku ?? null, slug: p.slug ?? null, category_id: p.category_id ?? null,
        retail_price: p.retail_price ?? null, sale_price: p.sale_price ?? null,
        stock: p.stock ?? 0, featured: b(p.featured), commerce_status: p.commerce_status ?? 'draft',
        meta_title: p.meta_title ?? null, meta_description: p.meta_description ?? null,
      });
    }

    // Reviews
    db.prepare('DELETE FROM reviews').run();
    const insRev = db.prepare(`INSERT INTO reviews (id,name,email,location,product,rating,date,verified,helpful,title,text,status,featured)
      VALUES (@id,@name,@email,@location,@product,@rating,@date,@verified,@helpful,@title,@text,@status,@featured)`);
    for (const r of data.reviews || []) {
      insRev.run({ id: r.id, name: r.name, email: r.email ?? '', location: r.location ?? '', product: r.product ?? '',
        rating: r.rating, date: r.date, verified: b(r.verified), helpful: r.helpful ?? 0,
        title: r.title ?? '', text: r.text, status: r.status ?? 'approved', featured: b(r.featured) });
    }

    // Settings
    const s = (data.settings || [])[0] || {};
    db.prepare(`UPDATE settings SET flat_shipping_rate=?, free_shipping_threshold=?, tax_rate=? WHERE id=1`).run(
      s.flat_shipping_rate ?? 200, s.free_shipping_threshold ?? 0, s.tax_rate ?? 0
    );
  });
  seed();

  console.log('✅ SQLite seeded:');
  console.log('   products:  ', db.prepare('SELECT COUNT(*) c FROM products').get().c);
  console.log('   categories:', db.prepare('SELECT COUNT(*) c FROM categories').get().c);
  console.log('   reviews:   ', db.prepare('SELECT COUNT(*) c FROM reviews').get().c);
  console.log('   active products:', db.prepare("SELECT COUNT(*) c FROM products WHERE commerce_status='active'").get().c);
}

run();
