# E2E Tests

Runs Playwright against the real dev stack (`npm run dev` in both the root and `server/`) and a real Supabase project — there's no mock backend, so `full-purchase-flow.spec.js` creates a real (throwaway) customer account and a real order.

## Running

```
npm run test:e2e
```

Playwright starts both dev servers automatically (see `playwright.config.js`). Make sure `.env` (root) and `server/.env` are configured first.

## Cleanup

If a run is interrupted mid-test, you may be left with:
- A test customer account (`e2e-playwright-*@example.com`) in Supabase Auth
- A test order (`ORD-YYYYMMDD-*`) and address in the database

Clean these up from the Supabase dashboard, or adapt the cleanup pattern used during development (delete the order/address, restore decremented stock, delete the auth user via `supabase.auth.admin.deleteUser`).
