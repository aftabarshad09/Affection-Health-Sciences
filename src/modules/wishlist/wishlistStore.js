import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Guest wishlist, persisted to localStorage. Same shape as the cart's product
// snapshot so items can be moved to the cart directly. No login required.
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [], // [{ productId, product }]

      toggle(product) {
        set((state) => {
          const exists = state.items.some((i) => i.productId === product.id);
          return exists
            ? { items: state.items.filter((i) => i.productId !== product.id) }
            : { items: [...state.items, { productId: product.id, product }] };
        });
      },

      remove(productId) {
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));
      },

      has(productId) {
        return get().items.some((i) => i.productId === productId);
      },

      count() {
        return get().items.length;
      },
    }),
    { name: 'ahs-wishlist' }
  )
);
