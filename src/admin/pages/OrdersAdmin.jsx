import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

export default function OrdersAdmin() {
  const { authFetch } = useAuth();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const url = statusFilter ? `/api/admin/orders?status=${statusFilter}` : '/api/admin/orders';
    authFetch(url)
      .then((res) => res.json())
      .then((data) => { if (data.success) setOrders(data.orders); })
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter]);

  return (
    <div>
      <div className="admin-page-head">
        <h1>Orders ({orders.length})</h1>
      </div>

      <div className="admin-filter-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.orderNumber}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>{o.items?.length || 0}</td>
                <td>Rs. {o.grandTotal}</td>
                <td><span className={`admin-badge admin-badge--${o.orderStatus}`}>{o.orderStatus.replace(/_/g, ' ')}</span></td>
                <td>
                  <Link to={`/admin/orders/${o.id}`} className="admin-btn admin-btn--ghost">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
