const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

// Service-role client: bypasses RLS for all backend data access. Auth-session
// persistence is disabled because this client instance is a shared singleton
// across every request — persisting a session here would leak between
// unrelated requests (see supabaseAuth.js for the per-request auth flow).
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    realtime: { transport: WebSocket },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  }
);

module.exports = supabase;
