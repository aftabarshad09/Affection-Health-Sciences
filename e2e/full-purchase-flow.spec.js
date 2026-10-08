import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../server/.env') });

// Covers the flow explicitly requested for this project: register -> login
// -> add to cart -> checkout -> order -> admin status update. Runs against
// the real dev stack and a real (throwaway) Supabase account/order.
//
// The customer account is provisioned directly via the service-role Admin
// API in beforeAll (pre-confirmed, no email sent) rather than through the
// /register UI: this project's Supabase Auth uses its default mailer for
// confirmation emails, which has a very low shared rate limit — repeatedly
// registering through the UI in test runs would burn that quota and could
// block real customers from confirming their accounts. The /register form
// itself (including its Supabase error handling) was verified manually
// instead; see the PR/commit notes for that verification.
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'sheraz@affectionhealthsciences.com';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || 'Sheraz@1122';

const testEmail = `e2e-playwright-${Date.now()}@example.com`;
const testPassword = 'TestPass123!';
let sharedOrderNumber;
let testUserId;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

test.beforeAll(async () => {
  const { data, error } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: { full_name: 'Playwright Tester' },
  });
  if (error) throw error;
  testUserId = data.user.id;
});

test.afterAll(async () => {
  // Best-effort cleanup — restores the DB to how this test found it.
  if (sharedOrderNumber) {
    const { data: order } = await supabase.from('orders').select('id, order_items(product_id, quantity)').eq('order_number', sharedOrderNumber).maybeSingle();
    if (order) {
      for (const item of order.order_items || []) {
        const { data: p } = await supabase.from('products').select('stock').eq('id', item.product_id).single();
        if (p) await supabase.from('products').update({ stock: p.stock + item.quantity }).eq('id', item.product_id);
      }
      await supabase.from('orders').delete().eq('id', order.id);
    }
  }
  if (testUserId) {
    await supabase.from('addresses').delete().eq('user_id', testUserId);
    await supabase.auth.admin.deleteUser(testUserId);
  }
});

test.describe.serial('customer purchase flow', () => {
  test('login, add a product to cart, and check out', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(testEmail);
    await page.getByLabel('Password').fill(testPassword);
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page).toHaveURL(/\/account/, { timeout: 10_000 });

    await page.goto('/products');
    const addToCartButtons = page.getByRole('button', { name: 'Add to Cart' });
    await expect(addToCartButtons.first()).toBeVisible({ timeout: 10_000 });
    await addToCartButtons.first().click();

    await page.goto('/cart');
    await expect(page.locator('.cart-item')).toHaveCount(1);
    await page.getByRole('button', { name: /proceed to checkout/i }).click();
    await expect(page).toHaveURL(/\/checkout/);

    await page.getByLabel('Receiver name').fill('Playwright Tester');
    await page.getByLabel('Phone').fill('03001234567');
    await page.getByLabel('Province').selectOption('Punjab');
    await page.getByLabel('City').fill('Rawalpindi');
    await page.getByLabel('Full address').fill('B-109, B-Block, Satellite Town');
    await page.getByRole('button', { name: /continue to review/i }).click();

    await expect(page).toHaveURL(/\/orders\/ORD-\d{8}-\d{6}/, { timeout: 15_000 });
    sharedOrderNumber = page.url().split('/orders/')[1];
    await expect(page.getByText(sharedOrderNumber)).toBeVisible();
  });

  test('admin can see and update the new order', async ({ page }) => {
    test.skip(!sharedOrderNumber, 'previous test did not produce an order number');

    await page.goto('/admin/login');
    await page.getByLabel('Email').fill(ADMIN_EMAIL);
    await page.getByLabel('Password').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page).toHaveURL(/\/admin$/, { timeout: 10_000 });

    await page.goto('/admin/orders');
    await expect(page.getByText(sharedOrderNumber)).toBeVisible({ timeout: 10_000 });

    await page.getByText(sharedOrderNumber).locator('..').getByRole('link', { name: /view/i }).click();
    await expect(page).toHaveURL(/\/admin\/orders\/\d+/);

    await page.getByLabel('Status').selectOption('confirmed');
    const updateButton = page.getByRole('button', { name: /update status/i });
    await updateButton.click();
    // The update button re-disables once the order's actual status catches
    // up to the selected one — a change-detected round trip, not just a
    // static "confirmed" text match (which is ambiguous with the <option>).
    await expect(updateButton).toBeDisabled({ timeout: 10_000 });
  });
});
