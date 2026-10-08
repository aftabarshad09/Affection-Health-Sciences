import { Link } from 'react-router-dom';
import { useWishlistStore } from '../wishlistStore';
import { useCartStore } from '../../cart/cartStore';
import { useToast } from '../../../hooks/useToastStore';
import { formatMoney } from '../../../utils/currency';
import { optimizedImage } from '../../../utils/image';
import '../../cart/cart.css';
import '../wishlist.css';

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);
  const toast = useToast();

  const moveToCart = (product) => {
    addItem(product, 1);
    remove(product.id);
    toast.success(`${product.name} moved to cart`);
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="cart-page__title">Your Wishlist</h1>
        <div className="cart-empty">
          <p>Your wishlist is empty.</p>
          <Link to="/products" className="cart-empty__link glass-btn">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">Your Wishlist</h1>
      <div className="wishlist-grid">
        {items.map(({ product }) => {
          const price = product?.salePrice ?? product?.retailPrice ?? null;
          return (
            <div className="wishlist-card" key={product.id}>
              <div className="wishlist-card__img">
                {(product?.image || product?.imageA) && (
                  <img src={optimizedImage(product.image || product.imageA, 300)} alt={product.name} loading="lazy" />
                )}
              </div>
              <div className="wishlist-card__body">
                <div className="wishlist-card__name">{product.name}</div>
                <div className="wishlist-card__price">{price ? formatMoney(price) : 'Price on request'}</div>
                <div className="wishlist-card__actions">
                  <button className="wishlist-card__add glass-btn" onClick={() => moveToCart(product)}>
                    Move to Cart
                  </button>
                  <button className="wishlist-card__remove" onClick={() => remove(product.id)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
