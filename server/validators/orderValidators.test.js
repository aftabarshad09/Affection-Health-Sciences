import { describe, it, expect } from 'vitest';
import { updateOrderStatusSchema, ORDER_STATUSES } from './orderValidators.js';

describe('updateOrderStatusSchema', () => {
  it('accepts every real order status', () => {
    for (const status of ORDER_STATUSES) {
      expect(updateOrderStatusSchema.safeParse({ status }).success).toBe(true);
    }
  });

  it('rejects a status that is not part of the defined lifecycle', () => {
    const result = updateOrderStatusSchema.safeParse({ status: 'shipped_by_drone' });
    expect(result.success).toBe(false);
  });

  it('rejects a missing status', () => {
    const result = updateOrderStatusSchema.safeParse({ notes: 'no status here' });
    expect(result.success).toBe(false);
  });
});
