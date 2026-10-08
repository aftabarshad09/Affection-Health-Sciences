import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

export default function InventoryAdmin() {
  const { authFetch } = useAuth();
  const [products, setProducts] = useState([]);
  const [edits, setEdits] = useState({});
  const [savingId, setSavingId] = useState(null);

  const load = () => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products.filter((p) => p.commerceStatus && p.commerceStatus !== 'archived'));
        }
      });
  };

  useEffect(load, []);

  const handleSave = async (id) => {
    setSavingId(id);
    try {
      await authFetch(`/api/products/${id}/commerce`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: Number(edits[id]) }),
      });
      setEdits((e) => { const next = { ...e }; delete next[id]; return next; });
      load();
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <h1>Inventory</h1>
      <p>Products showing "Low Stock" have 10 or fewer units left.</p>
      <table className="admin-table" style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Status</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const editValue = edits[p.id];
            const isDirty = editValue !== undefined && Number(editValue) !== p.stock;
            const isLow = p.commerceStatus === 'active' && p.stock <= 10;
            return (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.sku || '—'}</td>
                <td>
                  {p.stock === 0 ? (
                    <span className="admin-badge admin-badge--cancelled">Out of Stock</span>
                  ) : isLow ? (
                    <span className="admin-badge admin-badge--low-stock">Low Stock</span>
                  ) : (
                    <span className="admin-badge admin-badge--active">In Stock</span>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    style={{ width: 90 }}
                    value={editValue !== undefined ? editValue : p.stock}
                    onChange={(e) => setEdits((edits) => ({ ...edits, [p.id]: e.target.value }))}
                  />
                </td>
                <td>
                  <button
                    className="admin-btn admin-btn--ghost"
                    disabled={!isDirty || savingId === p.id}
                    onClick={() => handleSave(p.id)}
                  >
                    {savingId === p.id ? 'Saving…' : 'Save'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
