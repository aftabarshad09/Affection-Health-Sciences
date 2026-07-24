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
            const price = item.product?.salePrice ?? item.product?.retailPrice ?? 0;
            const lineTotal = price * item.quantity;
            const atMax = item.quantity >= (item.product?.stock ?? 50);
            return (
              <div className="cart-item" key={item.productId}>
                <div className="cart-item__img-wrap">
                  {item.product?.image && <img src={item.product.image} alt={item.product.name} />}
                </div>
                <div>
                  <div className="cart-item__name">{item.product?.name}</div>
                  <div className="cart-item__price">{formatMoney(price)} each</div>
                </div>
                <div className="cart-item__qty">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={atMax}
                  >
                    +
                  </button>
                </div>
                <div>
                  <div className="cart-item__name">{formatMoney(lineTotal)}</div>
                  <button className="cart-item__remove" type="button" onClick={() => removeItem(item.productId)}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="cart-summary__row cart-summary__row--total">
            <span>Estimated Total</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <button className="cart-summary__checkout glass-btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
