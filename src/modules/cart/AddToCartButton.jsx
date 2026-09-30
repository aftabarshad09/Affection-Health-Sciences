import { useCartStore } from './cartStore';
import { useToast } from '../../hooks/useToastStore';

// Every product is orderable via WhatsApp — even ones priced "on request" —
// so there is no availability gating here; the cart + WhatsApp message handle
// unpriced items gracefully.
export default function AddToCartButton({ product, className = '', quantity = 1, children }) {
  const addItem = useCartStore((s) => s.addItem);
  const toast = useToast();

  const handleClick = (e) => {
    e.stopPropagation();
    addItem(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children || 'Add to Cart'}
    </button>
  );
}
