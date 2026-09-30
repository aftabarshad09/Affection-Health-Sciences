import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Guest-only cart, persisted to localStorage. There is no login or server
// cart — ordering happens over WhatsApp from the cart page, so the cart only
// ever lives in the shopper's browser. Each item: { productId, quantity,
// product } where `product` is a snapshot used for display and the WhatsApp
// message. Items priced "on request" (no retail/sale price) are allowed;
// they simply don't contribute to the subtotal.
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem(product, quantity = 1) {
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          if (existing) {
            const nextQuantity = Math.min(existing.quantity + quantity, 99);
            return {
              items: state.items.map((i) =>
                i.productId === product.id ? { ...i, quantity: nextQuantity, product } : i
              ),
            };
          }
          return { items: [...state.items, { productId: product.id, quantity, product }] };
        });
      },

      updateQuantity(productId, quantity) {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(quantity, 99)) } : i
          ),
        }));
      },

      removeItem(productId) {
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));
      },

      clear() {
        set({ items: [] });
      },

      // Only priced items contribute; "price on request" items are excluded.
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
    { name: 'ahs-cart' }
  )
);
