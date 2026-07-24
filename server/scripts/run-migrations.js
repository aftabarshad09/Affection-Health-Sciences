// Applies every file in supabase/migrations, in filename order, against the
// Supabase Postgres database via a direct connection (DATABASE_URL). Safe to
// re-run: every migration is written with IF NOT EXISTS / OR REPLACE guards.
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MIGRATIONS_DIR = path.join(__dirname, '../../supabase/migrations');

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in server/.env — get it from Supabase Dashboard → Project Settings → Database → Connection string (URI, "Session" mode).');
    process.exit(1);
  }

  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      console.log(`▶ Applying ${file}...`);
      await client.query(sql);
      console.log(`✅ ${file} applied`);
    }
    console.log('✅ All migrations applied successfully');
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
