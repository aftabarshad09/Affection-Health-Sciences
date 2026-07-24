import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch } from '../../lib/apiClient';

// Cart items look the same whether the shopper is a guest or logged in:
// { id?, productId, quantity, product }. `id` only exists once an item is
// backed by a DB row (logged-in) — guest items are local-only until login
// triggers mergeGuestCartIntoServer(). Product snapshots keep the cart
// renderable offline; checkout always re-validates real price/stock
// server-side via place_order, so staleness here is cosmetic only.
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isAuthenticated: false,
      loading: false,

      setAuthenticated(value) {
        set({ isAuthenticated: value });
      },

      async addItem(product, quantity = 1) {
        if (get().isAuthenticated) {
          const { item } = await apiFetch('/api/cart/items', {
            method: 'POST',
            body: JSON.stringify({ productId: product.id, quantity }),
          });
          set((state) => ({
            items: [...state.items.filter((i) => i.productId !== product.id), { ...item, product }],
          }));
        } else {
          set((state) => {
            const existing = state.items.find((i) => i.productId === product.id);
            if (existing) {
              const nextQuantity = Math.min(existing.quantity + quantity, 50);
              return {
                items: state.items.map((i) =>
                  i.productId === product.id ? { ...i, quantity: nextQuantity } : i
                ),
              };
            }
            return { items: [...state.items, { productId: product.id, quantity, product }] };
          });
        }
      },

      async updateQuantity(productId, quantity) {
        if (get().isAuthenticated) {
          const item = get().items.find((i) => i.productId === productId);
          if (item?.id) {
            await apiFetch(`/api/cart/items/${item.id}`, {
              method: 'PUT',
              body: JSON.stringify({ quantity }),
            });
          }
        }
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        }));
      },

      async removeItem(productId) {
        if (get().isAuthenticated) {
          const item = get().items.find((i) => i.productId === productId);
          if (item?.id) await apiFetch(`/api/cart/items/${item.id}`, { method: 'DELETE' });
        }
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));
      },

      async clear() {
        if (get().isAuthenticated) {
          await apiFetch('/api/cart', { method: 'DELETE' });
        }
        set({ items: [] });
      },

      async loadFromServer() {
        set({ loading: true });
        try {
          const { items } = await apiFetch('/api/cart');
          set({ items, isAuthenticated: true });
        } finally {
          set({ loading: false });
        }
      },

      // Called right after login: pushes whatever was in the guest cart into
      // the user's DB cart (summing quantities server-side), then reloads
      // the merged result as the new source of truth.
      async mergeGuestCartIntoServer() {
        const guestItems = get().items.filter((i) => !i.id);
        if (guestItems.length > 0) {
          await apiFetch('/api/cart/merge', {
            method: 'POST',
            body: JSON.stringify({
              items: guestItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
            }),
          });
        }
        await get().loadFromServer();
      },

      // Called on logout so a shared device doesn't show the previous
      // account's cart to the next guest.
      resetToGuest() {
        set({ items: [], isAuthenticated: false });
      },

      subtotal() {
        return get().items.reduce((sum, i) => {
          const price = i.product?.salePrice ?? i.product?.retailPrice ?? 0;
          return sum + price * i.quantity;
        }, 0);
      },

      itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: 'ahs-guest-cart',
      // Never persist server-backed state to localStorage — while logged
      // in, the DB is the source of truth and re-fetched on load anyway.
      partialize: (state) => (state.isAuthenticated ? { items: [] } : { items: state.items }),
    }
  )
);
