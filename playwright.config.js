import { defineConfig } from '@playwright/test';

// Runs against the real dev stack (Vite + Express), which in turn talks to
// the real Supabase project — there's no mocked backend here, so these
// specs create real (throwaway) accounts/orders. See e2e/README.md for
// what to clean up if a run is interrupted mid-test.
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'npm run dev',
      cwd: './server',
      port: 5000,
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: 'npm run dev',
      port: 5173,
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
});
