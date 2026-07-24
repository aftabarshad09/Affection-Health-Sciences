import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Falls back to a non-functional placeholder instead of throwing, so
  // pages that don't touch auth (Home, Blog, Contact, ...) still render —
  // createClient() throws synchronously on a missing URL, which would
  // otherwise take down every page since CustomerAuthProvider wraps the
  // whole public site. Any actual auth call will fail with a clear network
  // error until VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY are set for real.
  console.error(
    '⚠️ VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set — customer auth, cart, and account features will not work until they are configured in .env.'
  );
}

// Customer-facing Supabase client — uses the public anon key (safe to ship
// to the browser; access control is enforced by RLS policies + the backend,
// never by this key). Handles register/login/logout/session refresh for
// every shopper; the admin panel uses this same client + role check.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
