import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatMoney } from '../../../utils/currency';
import '../tracking.css';

const FLOW = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

function StatusTimeline({ status }) {
  if (status === 'cancelled' || status === 'returned') {
    return (
      <div className="track-terminal">
        <span className={`track-terminal__badge track-terminal__badge--${status}`}>
          {status === 'cancelled' ? 'Order Cancelled' : 'Order Returned'}
        </span>
      </div>
    );
  }
  const current = FLOW.findIndex((s) => s.key === status);
  return (
    <div className="track-flow">
      {FLOW.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'upcoming';
        return (
          <div className={`track-step track-step--${state}`} key={s.key}>
            <span className="track-step__dot">{state === 'done' ? '✓' : i + 1}</span>
            <span className="track-step__label">{s.label}</span>
            {i < FLOW.length - 1 && <span className="track-step__line" />}
          </div>
        );
      })}
    </div>
  );
}

export default function TrackOrderPage() {
  const { token } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/track/${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setOrder(d.order);
        else setError(d.error || 'Order not found');
      })
      .catch(() => setError('Could not load your order'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="track-page"><p>Loading your order…</p></div>;
  if (error) {
    return (
      <div className="track-page">
        <div className="track-card track-card--center">
          <h1>Order not found</h1>
          <p>This tracking link may be incorrect or expired.</p>
          <Link to="/products" className="cart-empty__link glass-btn">Browse Products</Link>
        </div>
      </div>
    );
  }

  const a = order.address || {};

  return (
    <div className="track-page">
      <div className="track-head">
        <h1>Track Order</h1>
        <div className="track-head__meta">
          <span className="track-ordernum">{order.orderNumber}</span>
          <span className={`track-status-badge track-status-badge--${order.orderStatus}`}>
            {order.orderStatus.replace(/_/g, ' ')}
          </span>
        </div>
        <p className="track-placed">Placed on {new Date(order.createdAt + 'Z').toLocaleString()}</p>
      </div>

      <div className="track-card">
        <h2>Status</h2>
        <StatusTimeline status={order.orderStatus} />
      </div>

      <div className="track-card">
        <h2>Order History</h2>
        <ul className="track-history">
          {order.timeline.map((t) => (
            <li key={t.id}>
              <strong>{t.status.replace(/_/g, ' ')}</strong>
              {t.notes ? ` — ${t.notes}` : ''}
              <span className="track-history__time">{new Date(t.createdAt + 'Z').toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="track-card">
        <h2>Items</h2>
        {order.items.map((it) => (
          <div className="track-item" key={it.id}>
            <span>{it.title} × {it.quantity}</span>
            <span>{it.price ? formatMoney(it.subtotal) : 'Price on request'}</span>
          </div>
        ))}
        <div className="track-item track-item--sum"><span>Subtotal</span><span>{formatMoney(order.subtotal)}</span></div>
        <div className="track-item track-item--sum"><span>Shipping</span><span>{formatMoney(order.shipping)}</span></div>
        {order.tax > 0 && <div className="track-item track-item--sum"><span>Tax</span><span>{formatMoney(order.tax)}</span></div>}
        <div className="track-item track-item--total"><span>Total</span><span>{formatMoney(order.grandTotal)}</span></div>
        <div className="track-item track-item--sum"><span>Payment</span><span>Cash on Delivery ({order.paymentStatus})</span></div>
      </div>

      <div className="track-card">
        <h2>Delivery Address</h2>
        <p className="track-address">
          {a.receiver_name} — {a.phone}<br />
          {a.apartment ? `${a.apartment}, ` : ''}{a.address_line}<br />
          {a.area ? `${a.area}, ` : ''}{a.city}, {a.province} {a.postal_code || ''}
        </p>
        {order.notes && <p className="track-notes"><strong>Notes:</strong> {order.notes}</p>}
      </div>
    </div>
  );
}
