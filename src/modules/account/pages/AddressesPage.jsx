import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/apiClient';
import { useToast } from '../../../hooks/useToastStore';
import AddressForm from '../../checkout/AddressForm';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const load = () => apiFetch('/api/addresses').then((res) => setAddresses(res.addresses));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleSave = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        await apiFetch(`/api/addresses/${editing.id}`, { method: 'PUT', body: JSON.stringify(data) });
        toast.success('Address updated');
      } else {
        await apiFetch('/api/addresses', { method: 'POST', body: JSON.stringify(data) });
        toast.success('Address added');
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      toast.error(err.message || 'Could not save address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await apiFetch(`/api/addresses/${id}`, { method: 'DELETE' });
      toast.success('Address deleted');
      await load();
    } catch (err) {
      toast.error(err.message || 'Could not delete address');
    }
  };

  const handleSetDefault = async (address) => {
    try {
      await apiFetch(`/api/addresses/${address.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...address, isDefault: true }),
      });
      await load();
    } catch (err) {
      toast.error(err.message || 'Could not update address');
    }
  };

  if (loading) return <div className="account-card">Loading…</div>;

  return (
    <div>
      <div className="account-card">
        <h2>My Addresses</h2>
        {addresses.length === 0 && !showForm && <p>You haven't saved any addresses yet.</p>}

        {!showForm &&
          addresses.map((a) => (
            <div className="account-address-card" key={a.id}>
              <strong>{a.receiverName}</strong> — {a.phone}
              {a.isDefault && <span className="account-default-badge">Default</span>}
              <p>{a.addressLine}, {a.area ? `${a.area}, ` : ''}{a.city}, {a.province} {a.postalCode}</p>
              <div className="account-address-card__actions">
                <button className="edit-btn" onClick={() => { setEditing(a); setShowForm(true); }}>Edit</button>
                {!a.isDefault && <button className="edit-btn" onClick={() => handleSetDefault(a)}>Set as default</button>}
                <button className="delete-btn" onClick={() => handleDelete(a.id)}>Delete</button>
              </div>
            </div>
          ))}

        {!showForm && (
          <button className="cart-empty__link glass-btn" style={{ marginTop: 14 }} onClick={() => { setEditing(null); setShowForm(true); }}>
            + Add New Address
          </button>
        )}

        {showForm && (
          <>
            <AddressForm
              defaultValues={editing || undefined}
              submitLabel={editing ? 'Update Address' : 'Save Address'}
              submitting={submitting}
              onSubmit={handleSave}
            />
            <button className="account-cancel-btn" onClick={() => { setShowForm(false); setEditing(null); }}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
