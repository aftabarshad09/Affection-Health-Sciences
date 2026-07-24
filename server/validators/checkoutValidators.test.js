import { describe, it, expect } from 'vitest';
import { checkoutSchema } from './checkoutValidators.js';

describe('checkoutSchema', () => {
  const validAddress = {
    receiverName: 'Jane Doe',
    phone: '03001234567',
    province: 'Punjab',
    city: 'Rawalpindi',
    addressLine: 'B-109, B-Block',
  };

  it('accepts a valid payload with an inline address', () => {
    const result = checkoutSchema.safeParse({
      address: validAddress,
      items: [{ productId: 1, quantity: 2 }],
    });
    expect(result.success).toBe(true);
  });

  it('accepts a valid payload with an existing addressId instead of an inline address', () => {
    const result = checkoutSchema.safeParse({
      addressId: 5,
      items: [{ productId: 1, quantity: 1 }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects an empty cart — never let a customer place a zero-item order', () => {
    const result = checkoutSchema.safeParse({ address: validAddress, items: [] });
    expect(result.success).toBe(false);
  });

  it('rejects when neither addressId nor an inline address is provided', () => {
    const result = checkoutSchema.safeParse({ items: [{ productId: 1, quantity: 1 }] });
    expect(result.success).toBe(false);
  });

  it('rejects a non-positive quantity — this is what stops a client from requesting -1 or 0 items', () => {
    const result = checkoutSchema.safeParse({
      address: validAddress,
      items: [{ productId: 1, quantity: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects a quantity above the 50-item cap', () => {
    const result = checkoutSchema.safeParse({
      address: validAddress,
      items: [{ productId: 1, quantity: 51 }],
    });
    expect(result.success).toBe(false);
  });
});
