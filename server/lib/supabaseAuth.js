const { createClient } = require('@supabase/supabase-js');

if (!process.env.SUPABASE_ANON_KEY) {
  // Doesn't throw here — createClient() would throw synchronously on a
  // missing URL/key and take the whole server down at require-time (every
  // route, not just login). Falls back to a non-functional placeholder so
  // the rest of the API keeps working; only admin login itself will fail,
  // with a clear error, until SUPABASE_ANON_KEY is set in server/.env.
  console.error('⚠️ SUPABASE_ANON_KEY is not set in server/.env — admin/customer login will not work until it is configured.');
}

// Dedicated anon-key client used only for password-grant sign-in on behalf
// of a request. `persistSession: false` means no shared/global session state
// is written on this singleton, so concurrent logins from different users
// can't bleed into each other — each signInWithPassword() call is stateless
// and its result is read straight off the returned `data`.
const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key',
  {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  }
);

module.exports = supabaseAuth;
