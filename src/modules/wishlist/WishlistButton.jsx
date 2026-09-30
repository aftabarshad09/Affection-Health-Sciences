import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useWishlistStore } from './wishlistStore';
import { useToast } from '../../hooks/useToastStore';

// Heart toggle. Subscribes to the wishlist items array (not the has() method)
// so it re-renders when this product's state changes.
export default function WishlistButton({ product, className = '' }) {
  const items = useWishlistStore((s) => s.items);
  const toggle = useWishlistStore((s) => s.toggle);
  const toast = useToast();
  const active = items.some((i) => i.productId === product.id);

  const handleClick = (e) => {
    e.stopPropagation();
    toggle(product);
    toast.success(active ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`);
  };

  return (
    <button
      type="button"
      className={`wishlist-btn${active ? ' active' : ''} ${className}`}
      onClick={handleClick}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      title={active ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {active ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
}
