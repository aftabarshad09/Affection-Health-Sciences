import { supabase } from './supabaseClient';

// Thin fetch wrapper mirroring the admin panel's authFetch pattern: attaches
// the current Supabase session's access token (if any) and unwraps the
// backend's standard { success, error } envelope, throwing on failure so
// callers can just await + try/catch.
export async function apiFetch(path, options = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;

  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.success === false) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}
