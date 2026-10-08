import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Dashboard() {
  const { authFetch } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    authFetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((data) => { if (data.success) setStats(data.stats); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stats) return <p>Loading dashboard…</p>;

  const maxSold = Math.max(...stats.topSellingProducts.map((p) => p.quantitySold), 1);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Manage the content and store that power the public site.</p>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Total Orders</div>
          <div className="admin-stat-card__value">{stats.totalOrders}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Pending Orders</div>
          <div className="admin-stat-card__value">{stats.pendingOrders}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Revenue</div>
          <div className="admin-stat-card__value">Rs. {stats.revenue.toLocaleString()}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Active Products</div>
          <div className="admin-stat-card__value">{stats.productsCount}</div>
        </div>
      </div>

      <div className="admin-two-col">
        <div className="admin-card">
          <h2>Top Selling Products</h2>
          {stats.topSellingProducts.length === 0 ? (
            <p>No sales yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.75rem' }}>
              {stats.topSellingProducts.map((p) => (
                <div key={p.productId}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span>{p.title}</span>
                    <span>{p.quantitySold} sold</span>
                  </div>
                  <div style={{ background: '#f0f0f0', borderRadius: 999, height: 8 }}>
                    <div
                      style={{
                        width: `${(p.quantitySold / maxSold) * 100}%`,
                        background: '#1b4332',
                        height: 8,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-card">
          <h2>Low Stock Products</h2>
          {stats.lowStockProducts.length === 0 ? (
            <p>Nothing is running low.</p>
          ) : (
            <ul className="admin-mini-list">
              {stats.lowStockProducts.map((p) => (
                <li key={p.id}>
                  <span>{p.name}</span>
                  <span className="admin-badge admin-badge--low-stock">{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Recent Orders</h2>
        {stats.recentOrders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <ul className="admin-mini-list">
            {stats.recentOrders.map((o) => (
              <li key={o.id}>
                <span><Link to={`/admin/orders/${o.id}`}>{o.orderNumber}</Link> — {o.customerName} · Rs. {o.grandTotal}</span>
                <span className={`admin-badge admin-badge--${o.orderStatus}`}>{o.orderStatus.replace(/_/g, ' ')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="admin-card" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <Link to="/admin/products" className="admin-btn">Manage Products</Link>
        <Link to="/admin/orders" className="admin-btn">Manage Orders</Link>
        <Link to="/admin/categories" className="admin-btn">Manage Categories</Link>
        <Link to="/admin/inventory" className="admin-btn">Inventory</Link>
        <Link to="/admin/reviews" className="admin-btn">Manage Reviews</Link>
      </div>
    </div>
  );
}
