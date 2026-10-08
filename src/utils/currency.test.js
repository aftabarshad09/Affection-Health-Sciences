import { describe, it, expect } from 'vitest';
import { formatMoney } from './currency';

describe('formatMoney', () => {
  it('formats a positive number with the Rs. prefix and thousands separators', () => {
    expect(formatMoney(1935)).toBe('Rs. 1,935');
    expect(formatMoney(200)).toBe('Rs. 200');
    expect(formatMoney(100000)).toBe('Rs. 100,000');
  });

  it('treats null/undefined/NaN as zero rather than throwing', () => {
    expect(formatMoney(null)).toBe('Rs. 0');
    expect(formatMoney(undefined)).toBe('Rs. 0');
    expect(formatMoney('not a number')).toBe('Rs. 0');
  });

  it('drops fractional cents (store prices are whole rupees)', () => {
    expect(formatMoney(1935.7)).toBe('Rs. 1,936');
    expect(formatMoney(1935.2)).toBe('Rs. 1,935');
  });
});
