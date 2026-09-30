import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './cartStore';

const product = (overrides = {}) => ({
  id: 1,
  name: 'Gynogid',
  retailPrice: 1935,
  salePrice: null,
  ...overrides,
});

describe('cartStore (WhatsApp store, localStorage-only)', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('adds a new product with the given quantity', () => {
    useCartStore.getState().addItem(product(), 2);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ productId: 1, quantity: 2 });
  });

  it('merges quantities when the same product is added twice, capped at 99', () => {
    useCartStore.getState().addItem(product(), 60);
    useCartStore.getState().addItem(product(), 60);
    expect(useCartStore.getState().items[0].quantity).toBe(99);
  });

  it('updates and clamps quantity to at least 1', () => {
    useCartStore.getState().addItem(product(), 1);
    useCartStore.getState().updateQuantity(1, 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
    useCartStore.getState().updateQuantity(1, 0);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it('removes only the targeted product', () => {
    useCartStore.getState().addItem(product({ id: 1 }), 1);
    useCartStore.getState().addItem(product({ id: 2 }), 1);
    useCartStore.getState().removeItem(1);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe(2);
  });

  it('subtotal uses salePrice when present, else retailPrice, and ignores unpriced items', () => {
    useCartStore.getState().addItem(product({ id: 1, retailPrice: 1000, salePrice: 800 }), 2);
    useCartStore.getState().addItem(product({ id: 2, retailPrice: 500, salePrice: null }), 1);
    useCartStore.getState().addItem(product({ id: 3, retailPrice: null, salePrice: null }), 4); // price on request
    expect(useCartStore.getState().subtotal()).toBe(800 * 2 + 500 * 1);
  });

  it('itemCount sums quantities across products', () => {
    useCartStore.getState().addItem(product({ id: 1 }), 3);
    useCartStore.getState().addItem(product({ id: 2 }), 2);
    expect(useCartStore.getState().itemCount()).toBe(5);
  });
});
