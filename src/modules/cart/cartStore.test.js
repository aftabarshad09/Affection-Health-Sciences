import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './cartStore';

const product = (overrides = {}) => ({
  id: 1,
  name: 'Gynogid',
  retailPrice: 1935,
  salePrice: null,
  stock: 50,
  commerceStatus: 'active',
  ...overrides,
});

describe('cartStore (guest mode)', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isAuthenticated: false, loading: false });
  });

  it('adds a new product with the given quantity', async () => {
    await useCartStore.getState().addItem(product(), 2);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ productId: 1, quantity: 2 });
  });

  it('merges quantities when the same product is added twice, capped at 50', async () => {
    await useCartStore.getState().addItem(product(), 30);
    await useCartStore.getState().addItem(product(), 30);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(50);
  });

  it('updates quantity for a specific product without touching others', async () => {
    await useCartStore.getState().addItem(product({ id: 1 }), 1);
    await useCartStore.getState().addItem(product({ id: 2, name: 'Hepatovital' }), 1);
    await useCartStore.getState().updateQuantity(1, 5);
    const { items } = useCartStore.getState();
    expect(items.find((i) => i.productId === 1).quantity).toBe(5);
    expect(items.find((i) => i.productId === 2).quantity).toBe(1);
  });

  it('removes only the targeted product', async () => {
    await useCartStore.getState().addItem(product({ id: 1 }), 1);
    await useCartStore.getState().addItem(product({ id: 2 }), 1);
    await useCartStore.getState().removeItem(1);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe(2);
  });

  it('computes subtotal using salePrice when present, else retailPrice', async () => {
    await useCartStore.getState().addItem(product({ id: 1, retailPrice: 1000, salePrice: 800 }), 2);
    await useCartStore.getState().addItem(product({ id: 2, retailPrice: 500, salePrice: null }), 1);
    expect(useCartStore.getState().subtotal()).toBe(800 * 2 + 500 * 1);
  });

  it('computes itemCount as the sum of quantities, not the number of distinct products', async () => {
    await useCartStore.getState().addItem(product({ id: 1 }), 3);
    await useCartStore.getState().addItem(product({ id: 2 }), 2);
    expect(useCartStore.getState().itemCount()).toBe(5);
  });

  it('clear() empties the cart', async () => {
    await useCartStore.getState().addItem(product(), 1);
    await useCartStore.getState().clear();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('resetToGuest() clears items and authentication flag', async () => {
    await useCartStore.getState().addItem(product(), 1);
    useCartStore.setState({ isAuthenticated: true });
    useCartStore.getState().resetToGuest();
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.isAuthenticated).toBe(false);
  });
});
