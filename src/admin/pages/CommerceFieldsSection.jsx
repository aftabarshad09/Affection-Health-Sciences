import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

export default function CommerceFieldsSection({ productId, initial }) {
  const { authFetch } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    sku: initial.sku || '',
    slug: initial.slug || '',
    categoryId: initial.categoryId || '',
    retailPrice: initial.retailPrice ?? '',
    salePrice: initial.salePrice ?? '',
    stock: initial.stock ?? 0,
    featured: initial.featured || false,
    commerceStatus: initial.commerceStatus || 'draft',
    metaTitle: initial.metaTitle || '',
    metaDescription: initial.metaDescription || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    authFetch('/api/categories?all=true')
      .then((res) => res.json())
      .then((data) => { if (data.success) setCategories(data.categories); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      const res = await authFetch(`/api/products/${productId}/commerce`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          categoryId: form.categoryId ? Number(form.categoryId) : undefined,
          retailPrice: form.retailPrice === '' ? undefined : Number(form.retailPrice),
          salePrice: form.salePrice === '' ? null : Number(form.salePrice),
          stock: Number(form.stock),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Save failed');
      setMessage('Commerce details saved');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="admin-card" style={{ marginTop: '1rem' }} onSubmit={handleSubmit}>
      <h2>Commerce Details</h2>
      <div className="admin-field">
        <label htmlFor="commerce-sku">SKU</label>
        <input id="commerce-sku" value={form.sku} onChange={(e) => setField('sku', e.target.value)} placeholder="AHS-0001" />
      </div>
      <div className="admin-field">
        <label htmlFor="commerce-slug">Slug (used in the product URL)</label>
        <input id="commerce-slug" value={form.slug} onChange={(e) => setField('slug', e.target.value)} placeholder="gynogid" />
      </div>
      <div className="admin-field">
        <label htmlFor="commerce-category">Category</label>
        <select id="commerce-category" value={form.categoryId} onChange={(e) => setField('categoryId', e.target.value)}>
          <option value="">— Select category —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="admin-field">
        <label htmlFor="commerce-retail-price">Retail Price (Rs.)</label>
        <input id="commerce-retail-price" type="number" min="0" step="0.01" value={form.retailPrice} onChange={(e) => setField('retailPrice', e.target.value)} />
      </div>
      <div className="admin-field">
        <label htmlFor="commerce-sale-price">Sale Price (Rs., optional — leave blank for no discount)</label>
        <input id="commerce-sale-price" type="number" min="0" step="0.01" value={form.salePrice} onChange={(e) => setField('salePrice', e.target.value)} />
      </div>
      <div className="admin-field">
        <label htmlFor="commerce-stock">Stock</label>
        <input id="commerce-stock" type="number" min="0" value={form.stock} onChange={(e) => setField('stock', e.target.value)} />
      </div>
      <div className="admin-field">
        <label htmlFor="commerce-status">Status</label>
        <select id="commerce-status" value={form.commerceStatus} onChange={(e) => setField('commerceStatus', e.target.value)}>
          <option value="draft">Draft (hidden, not purchasable)</option>
          <option value="active">Active (visible + purchasable)</option>
          <option value="archived">Archived (hidden)</option>
        </select>
      </div>
      <div className="admin-field">
        <label>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setField('featured', e.target.checked)}
            style={{ marginRight: '0.5rem' }}
          />
          Featured (shown first in the shop)
        </label>
      </div>
      <div className="admin-field">
        <label htmlFor="commerce-meta-title">Meta Title (SEO)</label>
        <input id="commerce-meta-title" value={form.metaTitle} onChange={(e) => setField('metaTitle', e.target.value)} />
      </div>
      <div className="admin-field">
        <label htmlFor="commerce-meta-description">Meta Description (SEO)</label>
        <textarea id="commerce-meta-description" rows={2} value={form.metaDescription} onChange={(e) => setField('metaDescription', e.target.value)} />
      </div>

      {error && <p className="admin-error">{error}</p>}
      {message && <p className="admin-success">{message}</p>}
      <button className="admin-btn" type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Save Commerce Details'}
      </button>
    </form>
  );
}
