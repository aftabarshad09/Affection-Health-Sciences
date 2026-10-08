import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import '../checkout.css';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber;

  return (
    <div className="checkout-page">
      <div className="order-confirm">
        <FaCheckCircle className="order-confirm__icon" />
        <h1>Thank you! Your order is placed.</h1>
        {orderNumber && <p className="order-confirm__number">Order number: <strong>{orderNumber}</strong></p>}
        <p className="order-confirm__text">
          We've emailed your order confirmation. Our team will contact you shortly to confirm delivery.
          You'll pay in cash when your order arrives (Cash on Delivery).
        </p>
        <Link to="/products" className="cart-empty__link glass-btn">Continue Shopping</Link>
      </div>
    </div>
  );
}
