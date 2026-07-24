import '@testing-library/jest-dom/vitest';

// The real client throws immediately if VITE_SUPABASE_URL/ANON_KEY are
// unset, which is the case in the test environment — stub it out so unit
// tests that import modules touching supabaseClient.js don't crash on
// import alone (network-touching behavior itself is out of scope for unit
// tests; those are covered by manual/integration verification instead).
import { vi } from 'vitest';

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null }),
    })),
  },
}));
