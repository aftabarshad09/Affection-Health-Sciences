import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

export default function OrderDetailAdmin() {
  const { id } = useParams();
  const { authFetch } = useAuth();
  const [order, setOrder] = useState(null);
  const [nextStatus, setNextStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const load = () => {
    authFetch(`/api/admin/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) { setOrder(data.order); setNextStatus(data.order.orderStatus); }
        else setError(data.error || 'Not found');
      });
  };

  useEffect(load, [id]);

  const call = async (label, url, options) => {
    setBusy(label); setError('');
    try {
      const res = await authFetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Action failed');
      load();
      return true;
    } catch (err) { setError(err.message); return false; }
    finally { setBusy(''); }
  };

  const updateStatus = () => call('status', `/api/admin/orders/${id}/status`, {
    method: 'PUT', body: JSON.stringify({ status: nextStatus, notes: statusNote }),
  }).then((ok) => ok && setStatusNote(''));

  const setPayment = (paymentStatus) => call('payment', `/api/admin/orders/${id}/payment`, {
    method: 'PUT', body: JSON.stringify({ paymentStatus }),
  });

  const addNote = async () => {
    if (!note.trim()) return;
    const ok = await call('note', `/api/admin/orders/${id}/note`, { method: 'POST', body: JSON.stringify({ notes: note }) });
    if (ok) setNote('');
  };

  const deleteOrder = async () => {
    if (!window.confirm('Delete this order permanently? This cannot be undone.')) return;
    const ok = await call('delete', `/api/admin/orders/${id}`, { method: 'DELETE' });
    if (ok) window.location.href = '/admin/orders';
  };

  if (error && !order) return <div><p className="admin-error">{error}</p><Link to="/admin/orders">← Back</Link></div>;
  if (!order) return <p>Loading…</p>;

  const a = order.address || {};
  const trackUrl = `${window.location.origin}/track/${order.trackToken}`;

  return (
    <div>
      <div className="admin-page-head">
        <h1>Order {order.orderNumber}</h1>
        <Link to="/admin/orders" className="admin-btn admin-btn--ghost">← Back to Orders</Link>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-order-badges">
        <span className={`admin-badge admin-badge--${order.orderStatus}`}>Status: {order.orderStatus.replace(/_/g, ' ')}</span>
        <span className={`admin-badge admin-badge--${order.paymentStatus === 'paid' ? 'active' : 'pending'}`}>Payment: {order.paymentStatus}</span>
        <span className="admin-badge admin-badge--draft">COD</span>
        <span style={{ color: '#6b7280', fontSize: '0.85rem', alignSelf: 'center' }}>
          Placed {new Date(order.createdAt + 'Z').toLocaleString()}
        </span>
      </div>

      <div className="admin-two-col">
        <div className="admin-card">
          <h2>Customer</h2>
          <p><strong>{order.customerName}</strong></p>
          <p>📞 {order.customerPhone}</p>
          <p>✉️ {order.customerEmail}</p>
          <h2 style={{ marginTop: '1rem' }}>Delivery Address</h2>
          <p>
            {a.apartment ? `${a.apartment}, ` : ''}{a.address_line}<br />
            {a.area ? `${a.area}, ` : ''}{a.city}, {a.province} {a.postal_code || ''}
          </p>
          {order.notes && <p style={{ marginTop: '0.75rem' }}><strong>Customer notes:</strong> {order.notes}</p>}
        </div>

        <div className="admin-card">
          <h2>Items</h2>
          <ul className="admin-mini-list">
            {order.items.map((it) => (
              <li key={it.id}>
                <span>{it.title} × {it.quantity}</span>
                <span>{it.price ? `Rs. ${it.subtotal}` : 'Price on request'}</span>
              </li>
            ))}
          </ul>
          <ul className="admin-mini-list" style={{ marginTop: '0.75rem' }}>
            <li><span>Subtotal</span><span>Rs. {order.subtotal}</span></li>
            <li><span>Shipping</span><span>Rs. {order.shipping}</span></li>
            {order.tax > 0 && <li><span>Tax</span><span>Rs. {order.tax}</span></li>}
            <li><strong>Grand Total</strong><strong>Rs. {order.grandTotal}</strong></li>
          </ul>
        </div>
      </div>

      <div className="admin-two-col" style={{ marginTop: '1.5rem' }}>
        <div className="admin-card">
          <h2>Update Status</h2>
          <div className="admin-field">
            <label htmlFor="order-status">Status (customer is emailed)</label>
            <select id="order-status" value={nextStatus} onChange={(e) => setNextStatus(e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="order-status-note">Note for this update (optional)</label>
            <input id="order-status-note" value={statusNote} onChange={(e) => setStatusNote(e.target.value)} placeholder="e.g. Dispatched via TCS" />
          </div>
          <button className="admin-btn" onClick={updateStatus} disabled={busy === 'status'}>
            {busy === 'status' ? 'Updating…' : 'Update Status & Email Customer'}
          </button>

          <h2 style={{ marginTop: '1.5rem' }}>Payment</h2>
          <div className="admin-row-actions">
            <button className="admin-btn admin-btn--ghost" onClick={() => setPayment('paid')} disabled={busy === 'payment' || order.paymentStatus === 'paid'}>Mark Paid</button>
            <button className="admin-btn admin-btn--ghost" onClick={() => setPayment('pending')} disabled={busy === 'payment' || order.paymentStatus === 'pending'}>Mark Pending</button>
          </div>

          <h2 style={{ marginTop: '1.5rem' }}>Danger Zone</h2>
          <button className="admin-btn admin-btn--danger" onClick={deleteOrder} disabled={busy === 'delete'}>Delete Order</button>
        </div>

        <div className="admin-card">
          <h2>Timeline</h2>
          <ul className="admin-mini-list">
            {order.timeline.map((t) => (
              <li key={t.id}>
                <span>{t.status.replace(/_/g, ' ')}{t.notes ? ` — ${t.notes}` : ''}{t.updatedBy ? ` · ${t.updatedBy}` : ''}</span>
                <span>{new Date(t.createdAt + 'Z').toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="admin-field" style={{ marginTop: '1rem' }}>
            <label htmlFor="order-note">Add internal note to timeline</label>
            <input id="order-note" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <button className="admin-btn admin-btn--ghost" onClick={addNote} disabled={busy === 'note'}>Add Note</button>

          <h2 style={{ marginTop: '1.5rem' }}>Customer Tracking Link</h2>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', wordBreak: 'break-all' }}>{trackUrl}</p>
          <button
            className="admin-btn admin-btn--ghost"
            onClick={() => { navigator.clipboard?.writeText(trackUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          >
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </div>
    </div>
  );
}
