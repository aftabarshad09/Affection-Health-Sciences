import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

export default function ReviewsAdmin() {
  const { authFetch } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    authFetch('/api/reviews/admin')
      .then((res) => res.json())
      .then((data) => { if (data.success) setReviews(data.reviews); })
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const update = async (id, patch) => {
    try {
      const res = await authFetch(`/api/reviews/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error('Update failed');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const res = await authFetch(`/api/reviews/admin/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Reviews ({reviews.length})</h1>
      {error && <p className="admin-error">{error}</p>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Product</th>
            <th>Rating</th>
            <th>Text</th>
            <th>Featured</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id}>
              <td>
                <span className={`admin-badge admin-badge--${r.status}`}>{r.status}</span>
              </td>
              <td>{r.name}<br /><small>{r.email}</small></td>
              <td>{r.product || '—'}</td>
              <td>{r.rating}/5</td>
              <td style={{ maxWidth: 320 }}>{r.text}</td>
              <td>
                <input
                  type="checkbox"
                  checked={r.featured}
                  onChange={(e) => update(r.id, { featured: e.target.checked })}
                />
              </td>
              <td>
                <div className="admin-row-actions">
                  {r.status === 'pending' && (
                    <button className="admin-btn" onClick={() => update(r.id, { status: 'approved' })}>Approve</button>
                  )}
                  <button className="admin-btn admin-btn--danger" onClick={() => remove(r.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
