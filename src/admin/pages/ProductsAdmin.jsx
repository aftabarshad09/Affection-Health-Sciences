import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function ProductsAdmin() {
  const { authFetch } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => { if (data.success) setProducts(data.products); });
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      const res = await authFetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="admin-page-head">
        <h1>Products ({products.length})</h1>
        <Link to="/admin/products/new" className="admin-btn">+ New Product</Link>
      </div>
      {error && <p className="admin-error">{error}</p>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Shop Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td><img src={p.isDualPack ? p.imageA : p.image} alt={p.name} /></td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.retailPrice ? `Rs. ${p.retailPrice}` : '—'}</td>
              <td>
                {p.commerceStatus === 'active' && p.stock <= 10 ? (
                  <span className="admin-badge admin-badge--low-stock">{p.stock} left</span>
                ) : (
                  p.stock ?? '—'
                )}
              </td>
              <td><span className={`admin-badge admin-badge--${p.commerceStatus || 'draft'}`}>{p.commerceStatus || 'draft'}</span></td>
              <td>
                <div className="admin-row-actions">
                  <Link to={`/admin/products/${p.id}/edit`} className="admin-btn admin-btn--ghost">Edit</Link>
                  <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
