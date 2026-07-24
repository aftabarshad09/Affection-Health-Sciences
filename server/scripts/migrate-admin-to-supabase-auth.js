// One-time: creates a real Supabase Auth account for the store's first
// Super Admin, replacing the old hardcoded ADMIN_USERNAME/ADMIN_PASSWORD
// env-var login. Requires SUPER_ADMIN_EMAIL/SUPER_ADMIN_PASSWORD in
// server/.env. Safe to re-run — if the account already exists it just
// makes sure the profile's role is set correctly.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const supabase = require('../lib/supabase');
const db = require('../lib/db');

(async () => {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in server/.env first.');
    process.exit(1);
  }

  let userId;
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Super Admin' },
  });

  if (createErr) {
    if (!/already registered|already exists/i.test(createErr.message)) {
      console.error('❌ Failed to create account:', createErr.message);
      process.exit(1);
    }
    console.log('ℹ️  Account already exists — looking it up instead');
    const { data: list, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) throw listErr;
    const existing = list.users.find((u) => u.email === email);
    if (!existing) throw new Error('Could not find the existing user by email');
    userId = existing.id;
  } else {
    userId = created.user.id;
    console.log(`✅ Created Supabase Auth account for ${email}`);
  }

  // The handle_new_user trigger auto-creates a 'customer' profile row on
  // signup — promote it to super_admin now.
  await db.profiles.setRole(userId, 'super_admin');
  console.log(`✅ ${email} is now a super_admin — log in to /admin/login with this email/password`);
})().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
