import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const emptyCategory = { name: '', slug: '', image: '', description: '', status: 'active', sortOrder: 0 };

export default function CategoriesAdmin() {
  const { authFetch } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyCategory);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    authFetch('/api/categories?all=true')
      .then((res) => res.json())
      .then((data) => { if (data.success) setCategories(data.categories); });
  };

  useEffect(load, []);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const res = await authFetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Save failed');
      setForm(emptyCategory);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setForm({ name: c.name, slug: c.slug, image: c.image || '', description: c.description || '', status: c.status, sortOrder: c.sortOrder });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Products using it keep their reference but will need reassigning.')) return;
    await authFetch(`/api/categories/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <h1>Categories ({categories.length})</h1>

      <div className="admin-two-col" style={{ marginTop: '1.5rem' }}>
        <form className="admin-card" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Edit Category' : 'New Category'}</h2>
          <div className="admin-field">
            <label htmlFor="cat-name">Name</label>
            <input id="cat-name" value={form.name} onChange={(e) => setField('name', e.target.value)} required />
          </div>
          <div className="admin-field">
            <label htmlFor="cat-slug">Slug</label>
            <input id="cat-slug" value={form.slug} onChange={(e) => setField('slug', e.target.value)} required />
          </div>
          <div className="admin-field">
            <label htmlFor="cat-description">Description</label>
            <textarea id="cat-description" rows={2} value={form.description} onChange={(e) => setField('description', e.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="cat-image">Image URL</label>
            <input id="cat-image" value={form.image} onChange={(e) => setField('image', e.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="cat-status">Status</label>
            <select id="cat-status" value={form.status} onChange={(e) => setField('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="cat-sort-order">Sort Order</label>
            <input id="cat-sort-order" type="number" value={form.sortOrder} onChange={(e) => setField('sortOrder', Number(e.target.value))} />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <div className="admin-row-actions">
            <button className="admin-btn" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            {editingId && (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { setEditingId(null); setForm(emptyCategory); }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td><span className={`admin-badge admin-badge--${c.status === 'active' ? 'active' : 'draft'}`}>{c.status}</span></td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="admin-btn admin-btn--ghost" onClick={() => handleEdit(c)}>Edit</button>
                      <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(c.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
