import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import CommerceFieldsSection from './CommerceFieldsSection';

const emptyProduct = {
  name: '',
  tagline: '',
  cardLine: '',
  category: '',
  badge: '',
  description: '',
  benefits: [''],
  ingredients: [{ name: '', amount: '' }],
  dosage: '',
  form: '',
  isDualPack: false,
  cardVariant: '',
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { authFetch } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState(null);
  const [imageAFile, setImageAFile] = useState(null);
  const [imageBFile, setImageBFile] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        const existing = data.products.find((p) => p.id === Number(id));
        if (existing) {
          setProduct({
            ...emptyProduct,
            ...existing,
            badge: existing.badge || '',
            cardVariant: existing.cardVariant || '',
          });
        }
      });
  }, [id, isEdit]);

  const setField = (field, value) => setProduct((p) => ({ ...p, [field]: value }));

  const setListItem = (field, index, value) =>
    setProduct((p) => ({ ...p, [field]: p[field].map((v, i) => (i === index ? value : v)) }));

  const addListItem = (field, blank) => setProduct((p) => ({ ...p, [field]: [...p[field], blank] }));

  const removeListItem = (field, index) =>
    setProduct((p) => ({ ...p, [field]: p[field].filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('tagline', product.tagline);
    formData.append('cardLine', product.cardLine);
    formData.append('category', product.category);
    formData.append('badge', product.badge);
    formData.append('description', product.description);
    formData.append('benefits', JSON.stringify(product.benefits.filter(Boolean)));
    formData.append('ingredients', JSON.stringify(product.ingredients.filter((i) => i.name)));
    formData.append('dosage', product.dosage);
    formData.append('form', product.form);
    formData.append('isDualPack', String(product.isDualPack));
    if (product.cardVariant) formData.append('cardVariant', product.cardVariant);
    if (imageFile) formData.append('image', imageFile);
    if (imageAFile) formData.append('imageA', imageAFile);
    if (imageBFile) formData.append('imageB', imageBFile);

    try {
      const url = isEdit ? `/api/products/${id}` : '/api/products';
      const res = await authFetch(url, { method: isEdit ? 'PUT' : 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Save failed');
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>{isEdit ? 'Edit Product' : 'New Product'}</h1>
      <form className="admin-card" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label>Name</label>
          <input value={product.name} onChange={(e) => setField('name', e.target.value)} required />
        </div>
        <div className="admin-field">
          <label>Tagline</label>
          <input value={product.tagline} onChange={(e) => setField('tagline', e.target.value)} required />
        </div>
        <div className="admin-field">
          <label>Card line (short summary shown on the product grid)</label>
          <input value={product.cardLine} onChange={(e) => setField('cardLine', e.target.value)} required />
        </div>
        <div className="admin-field">
          <label>Category</label>
          <input value={product.category} onChange={(e) => setField('category', e.target.value)} required />
        </div>
        <div className="admin-field">
          <label>Badge (optional, e.g. "New", "Bestseller")</label>
          <input value={product.badge} onChange={(e) => setField('badge', e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Description</label>
          <textarea rows={4} value={product.description} onChange={(e) => setField('description', e.target.value)} required />
        </div>

        <div className="admin-field">
          <label>Benefits</label>
          {product.benefits.map((b, i) => (
            <div className="admin-list-field" key={i}>
              <input value={b} onChange={(e) => setListItem('benefits', i, e.target.value)} />
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => removeListItem('benefits', i)}>Remove</button>
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => addListItem('benefits', '')}>+ Add benefit</button>
        </div>

        <div className="admin-field">
          <label>Ingredients</label>
          {product.ingredients.map((ing, i) => (
            <div className="admin-list-field" key={i}>
              <input
                placeholder="Name"
                value={ing.name}
                onChange={(e) => setListItem('ingredients', i, { ...ing, name: e.target.value })}
              />
              <input
                placeholder="Amount"
                value={ing.amount}
                onChange={(e) => setListItem('ingredients', i, { ...ing, amount: e.target.value })}
              />
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => removeListItem('ingredients', i)}>Remove</button>
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => addListItem('ingredients', { name: '', amount: '' })}>+ Add ingredient</button>
        </div>

        <div className="admin-field">
          <label>Dosage</label>
          <input value={product.dosage} onChange={(e) => setField('dosage', e.target.value)} required />
        </div>
        <div className="admin-field">
          <label>Form (e.g. "Capsules — 30 count")</label>
          <input value={product.form} onChange={(e) => setField('form', e.target.value)} required />
        </div>

        <div className="admin-field">
          <label>
            <input
              type="checkbox"
              checked={product.isDualPack}
              onChange={(e) => setField('isDualPack', e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Dual-pack image (two images that alternate on the card)
          </label>
        </div>

        {product.isDualPack ? (
          <>
            <div className="admin-field">
              <label>Card color variant (optional, e.g. "emerald", "amber", "teal")</label>
              <input value={product.cardVariant} onChange={(e) => setField('cardVariant', e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Image A {product.imageA && <span>(current: {product.imageA})</span>}</label>
              <input type="file" accept="image/*" onChange={(e) => setImageAFile(e.target.files[0])} />
            </div>
            <div className="admin-field">
              <label>Image B {product.imageB && <span>(current: {product.imageB})</span>}</label>
              <input type="file" accept="image/*" onChange={(e) => setImageBFile(e.target.files[0])} />
            </div>
          </>
        ) : (
          <div className="admin-field">
            <label>Image {product.image && <span>(current: {product.image})</span>}</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          </div>
        )}

        {error && <p className="admin-error">{error}</p>}
        <button className="admin-btn" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save Product'}
        </button>
      </form>

      {isEdit ? (
        <CommerceFieldsSection productId={Number(id)} initial={product} />
      ) : (
        <p className="admin-card" style={{ marginTop: '1rem', color: '#6b7280' }}>
          Save this product first — pricing, stock, and category can be set once it exists.
        </p>
      )}
    </div>
  );
}
