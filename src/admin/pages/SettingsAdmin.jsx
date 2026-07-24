import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

export default function SettingsAdmin() {
  const { authFetch } = useAuth();
  const [form, setForm] = useState({ flatShippingRate: 200, freeShippingThreshold: 0, taxRate: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    authFetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => { if (data.success) setForm(data.settings); })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flatShippingRate: Number(form.flatShippingRate),
          freeShippingThreshold: Number(form.freeShippingThreshold),
          taxRate: Number(form.taxRate),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Save failed');
      setMessage('Settings saved');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1>Store Settings</h1>
      <form className="admin-card" style={{ marginTop: '1rem', maxWidth: 480 }} onSubmit={handleSubmit}>
        <div className="admin-field">
          <label htmlFor="flat-shipping-rate">Flat Shipping Rate (Rs.)</label>
          <input id="flat-shipping-rate" type="number" min="0" value={form.flatShippingRate} onChange={(e) => setField('flatShippingRate', e.target.value)} />
        </div>
        <div className="admin-field">
          <label htmlFor="free-shipping-threshold">Free Shipping Threshold (Rs., 0 = disabled)</label>
          <input id="free-shipping-threshold" type="number" min="0" value={form.freeShippingThreshold} onChange={(e) => setField('freeShippingThreshold', e.target.value)} />
        </div>
        <div className="admin-field">
          <label htmlFor="tax-rate">Tax Rate (%, 0 = none)</label>
          <input id="tax-rate" type="number" min="0" max="100" value={form.taxRate} onChange={(e) => setField('taxRate', e.target.value)} />
        </div>
        {error && <p className="admin-error">{error}</p>}
        {message && <p className="admin-success">{message}</p>}
        <button className="admin-btn" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</button>
      </form>
    </div>
  );
}
