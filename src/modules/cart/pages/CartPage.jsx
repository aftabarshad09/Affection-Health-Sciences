import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../cartStore';
import { formatMoney } from '../../../utils/currency';
import '../cart.css';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="cart-page__title">Your Cart</h1>
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/products" className="cart-empty__link glass-btn">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => {
            const price = item.product?.salePrice ?? item.product?.retailPrice ?? null;
            return (
              <div className="cart-item" key={item.productId}>
                <div className="cart-item__img-wrap">
                  {(item.product?.image || item.product?.imageA) && (
                    <img src={item.product.image || item.product.imageA} alt={item.product.name} />
                  )}
                </div>
                <div>
                  <div className="cart-item__name">{item.product?.name}</div>
                  <div className="cart-item__price">{price ? `${formatMoney(price)} each` : 'Price on request'}</div>
                </div>
                <div className="cart-item__qty">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <div>
                  <div className="cart-item__name">{price ? formatMoney(price * item.quantity) : '—'}</div>
                  <button className="cart-item__remove" type="button" onClick={() => removeItem(item.productId)}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <div className="cart-summary__row cart-summary__row--total">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <p className="cart-summary__note">Shipping is calculated at checkout. Payment is Cash on Delivery.</p>
          <button className="cart-summary__checkout glass-btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
          <Link to="/products" className="cart-summary__continue">← Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
