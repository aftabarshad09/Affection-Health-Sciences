const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

// Our own local database — a single SQLite file that lives with the app and
// is ALWAYS available (no external service, nothing to "activate", never
// pauses). Products, orders, reviews, categories and settings all live here.
// Product images still live on Cloudinary (a CDN that doesn't pause).
const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'store.db'));
db.pragma('journal_mode = WAL'); // better concurrency + durability
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  image TEXT,
  description TEXT,
  status TEXT DEFAULT 'active',
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  card_line TEXT,
  category TEXT,
  badge TEXT,
  description TEXT,
  benefits TEXT,
  ingredients TEXT,
  dosage TEXT,
  form TEXT,
  is_dual_pack INTEGER DEFAULT 0,
  card_variant TEXT,
  image TEXT,
  image_a TEXT,
  image_b TEXT,
  sku TEXT,
  slug TEXT,
  category_id INTEGER,
  retail_price REAL,
  sale_price REAL,
  stock INTEGER DEFAULT 0,
  featured INTEGER DEFAULT 0,
  commerce_status TEXT DEFAULT 'draft',
  meta_title TEXT,
  meta_description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY,
  name TEXT, email TEXT, location TEXT, product TEXT,
  rating INTEGER, date TEXT, verified INTEGER DEFAULT 0,
  helpful INTEGER DEFAULT 0, title TEXT, text TEXT,
  status TEXT DEFAULT 'pending', featured INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  flat_shipping_rate REAL DEFAULT 200,
  free_shipping_threshold REAL DEFAULT 0,
  tax_rate REAL DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);
INSERT OR IGNORE INTO settings (id) VALUES (1);

CREATE TABLE IF NOT EXISTS order_counter (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  value INTEGER NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO order_counter (id, value) VALUES (1, 0);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT UNIQUE NOT NULL,
  track_token TEXT UNIQUE NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  address TEXT,
  subtotal REAL DEFAULT 0,
  shipping REAL DEFAULT 0,
  discount REAL DEFAULT 0,
  tax REAL DEFAULT 0,
  grand_total REAL DEFAULT 0,
  payment_method TEXT DEFAULT 'cod',
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER,
  title TEXT,
  sku TEXT,
  price REAL,
  quantity INTEGER,
  subtotal REAL
);

CREATE TABLE IF NOT EXISTS order_timeline (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  updated_by TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  description TEXT,
  metadata TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_track ON orders(track_token);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_timeline_order ON order_timeline(order_id);
CREATE INDEX IF NOT EXISTS idx_products_commerce ON products(commerce_status);
`);

module.exports = db;
