import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../../../lib/apiClient';
import { formatMoney } from '../../../utils/currency';
import OrderTimelineView from '../OrderTimelineView';
import '../orders.css';

export default function OrderDetailPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/api/orders/${orderNumber}`)
      .then((res) => setOrder(res.order))
      .catch((err) => setError(err.message || 'Order not found'));
  }, [orderNumber]);

  if (error) {
    return (
      <div className="order-detail-page">
        <p>{error}</p>
        <Link to="/account/orders">Back to my orders</Link>
      </div>
    );
  }

  if (!order) return <div className="order-detail-page">Loading…</div>;

  return (
    <div className="order-detail-page">
      <div className="order-detail__header">
        <h1>Order {order.orderNumber}</h1>
        <span className="order-detail__status-badge">{order.orderStatus.replace(/_/g, ' ')}</span>
      </div>

      <div className="order-detail__section">
        <h2>Tracking</h2>
        <OrderTimelineView status={order.orderStatus} />
      </div>

      <div className="order-detail__section">
        <h2>Items</h2>
        {order.items.map((item) => (
          <div className="order-detail__item-row" key={item.id}>
            <span>{item.title} × {item.quantity}</span>
            <span>{formatMoney(item.subtotal)}</span>
          </div>
        ))}
      </div>

      <div className="order-detail__section">
        <h2>Delivery Address</h2>
        <p>
          {order.address.receiver_name} — {order.address.phone}
          <br />
          {order.address.address_line}, {order.address.area ? `${order.address.area}, ` : ''}
          {order.address.city}, {order.address.province} {order.address.postal_code}
        </p>
      </div>

      <div className="order-detail__section">
        <h2>Payment Summary</h2>
        <div className="order-detail__item-row"><span>Subtotal</span><span>{formatMoney(order.subtotal)}</span></div>
        <div className="order-detail__item-row"><span>Shipping</span><span>{formatMoney(order.shipping)}</span></div>
        {order.tax > 0 && <div className="order-detail__item-row"><span>Tax</span><span>{formatMoney(order.tax)}</span></div>}
        <div className="order-detail__item-row"><strong>Grand Total</strong><strong>{formatMoney(order.grandTotal)}</strong></div>
        <div className="order-detail__item-row"><span>Payment Method</span><span>Cash on Delivery</span></div>
        <div className="order-detail__item-row"><span>Payment Status</span><span style={{ textTransform: 'capitalize' }}>{order.paymentStatus}</span></div>
      </div>
    </div>
  );
}
