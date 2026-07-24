import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

export default function OrderDetailAdmin() {
  const { id } = useParams();
  const { authFetch } = useAuth();
  const [order, setOrder] = useState(null);
  const [nextStatus, setNextStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    authFetch(`/api/admin/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.order);
          setNextStatus(data.order.orderStatus);
        }
      });
  };

  useEffect(load, [id]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await authFetch(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, notes }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Update failed');
      setNotes('');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!order) return <p>Loading…</p>;

  return (
    <div>
      <div className="admin-page-head">
        <h1>Order {order.orderNumber}</h1>
        <Link to="/admin/orders" className="admin-btn admin-btn--ghost">← Back to Orders</Link>
      </div>

      <div className="admin-two-col">
        <div className="admin-card">
          <h2>Items</h2>
          <ul className="admin-mini-list">
            {order.items.map((item) => (
              <li key={item.id}>
                <span>{item.title} × {item.quantity}</span>
                <span>Rs. {item.subtotal}</span>
              </li>
            ))}
          </ul>
          <ul className="admin-mini-list" style={{ marginTop: '1rem' }}>
            <li><span>Subtotal</span><span>Rs. {order.subtotal}</span></li>
            <li><span>Shipping</span><span>Rs. {order.shipping}</span></li>
            {order.tax > 0 && <li><span>Tax</span><span>Rs. {order.tax}</span></li>}
            <li><strong>Grand Total</strong><strong>Rs. {order.grandTotal}</strong></li>
          </ul>
        </div>

        <div className="admin-card">
          <h2>Customer & Delivery</h2>
          <p>
            {order.address.receiver_name} — {order.address.phone}<br />
            {order.address.address_line}, {order.address.area ? `${order.address.area}, ` : ''}
            {order.address.city}, {order.address.province} {order.address.postal_code}
          </p>
          <p style={{ marginTop: '0.75rem' }}>Payment: Cash on Delivery ({order.paymentStatus})</p>
          {order.notes && <p style={{ marginTop: '0.75rem' }}><strong>Customer notes:</strong> {order.notes}</p>}
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Update Status</h2>
        <form onSubmit={handleUpdateStatus}>
          <div className="admin-field">
            <label htmlFor="order-status">Status</label>
            <select id="order-status" value={nextStatus} onChange={(e) => setNextStatus(e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="order-notes">Notes (optional, shown to customer)</label>
            <textarea id="order-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button className="admin-btn" type="submit" disabled={saving || nextStatus === order.orderStatus}>
            {saving ? 'Updating…' : 'Update Status'}
          </button>
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Timeline</h2>
        <ul className="admin-mini-list">
          {order.timeline.map((t) => (
            <li key={t.id}>
              <span>{t.status.replace(/_/g, ' ')} {t.notes ? `— ${t.notes}` : ''}</span>
              <span>{new Date(t.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
