import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../../lib/apiClient';
import { formatMoney } from '../../../utils/currency';
import '../orders.css';

export default function OrderListPage() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    apiFetch('/api/orders').then((res) => setOrders(res.orders));
  }, []);

  if (!orders) return <div className="order-list-page">Loading…</div>;

  if (orders.length === 0) {
    return (
      <div className="order-list-page">
        <h1>My Orders</h1>
        <p>You haven't placed any orders yet.</p>
        <Link to="/products" className="cart-empty__link glass-btn">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="order-list-page">
      <h1>My Orders</h1>
      {orders.map((order) => (
        <Link className="order-list-card" to={`/orders/${order.orderNumber}`} key={order.id}>
          <div className="order-list-card__top">
            <span>{order.orderNumber}</span>
            <span>{formatMoney(order.grandTotal)}</span>
          </div>
          <div className="order-list-card__meta">
            {new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} item(s) ·{' '}
            <span style={{ textTransform: 'capitalize' }}>{order.orderStatus.replace(/_/g, ' ')}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
