import { useState } from 'react';
import { useCartStore } from './cartStore';
import { useToast } from '../../hooks/useToastStore';

export default function AddToCartButton({ product, className = '', quantity = 1, children }) {
  const addItem = useCartStore((s) => s.addItem);
  const toast = useToast();
  const [adding, setAdding] = useState(false);

  const unavailable = product.commerceStatus !== 'active' || !product.retailPrice;
  const outOfStock = product.stock <= 0;
  const disabled = unavailable || outOfStock || adding;

  const handleClick = async (e) => {
    e.stopPropagation();
    if (disabled) return;
    setAdding(true);
    try {
      await addItem(product, quantity);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err.message || 'Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  let label = 'Add to Cart';
  if (unavailable) label = 'Coming Soon';
  else if (outOfStock) label = 'Out of Stock';
  else if (adding) label = 'Adding…';

  return (
    <button type="button" className={className} onClick={handleClick} disabled={disabled}>
      {children || label}
    </button>
  );
}
