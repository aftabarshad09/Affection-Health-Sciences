import { describe, it, expect } from 'vitest';
import { guestCheckoutSchema } from './guestCheckoutValidators.js';

const valid = {
  customer: { name: 'Jane Doe', email: 'jane@example.com', phone: '03001234567' },
  address: { addressLine: 'House 12, Street 5', city: 'Rawalpindi', province: 'Punjab' },
  items: [{ productId: 1, quantity: 2 }],
};

describe('guestCheckoutSchema', () => {
  it('accepts a valid guest order with optional apartment/area/postal omitted', () => {
    expect(guestCheckoutSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts optional apartment + postal code when provided', () => {
    const r = guestCheckoutSchema.safeParse({
      ...valid,
      address: { ...valid.address, apartment: 'Flat 4B', area: 'Satellite Town', postalCode: '46000' },
    });
    expect(r.success).toBe(true);
  });

  it('rejects a missing/invalid email', () => {
    expect(guestCheckoutSchema.safeParse({ ...valid, customer: { ...valid.customer, email: 'nope' } }).success).toBe(false);
  });

  it('rejects an empty cart', () => {
    expect(guestCheckoutSchema.safeParse({ ...valid, items: [] }).success).toBe(false);
  });

  it('rejects a too-short street address', () => {
    expect(guestCheckoutSchema.safeParse({ ...valid, address: { ...valid.address, addressLine: 'x' } }).success).toBe(false);
  });

  it('rejects a non-positive quantity', () => {
    expect(guestCheckoutSchema.safeParse({ ...valid, items: [{ productId: 1, quantity: 0 }] }).success).toBe(false);
  });
});
