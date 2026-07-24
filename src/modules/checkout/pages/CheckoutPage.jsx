import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../../../lib/apiClient';
import { useCartStore } from '../../cart/cartStore';
import { useToast } from '../../../hooks/useToastStore';
import { formatMoney } from '../../../utils/currency';
import AddressForm from '../AddressForm';
import '../checkout.css';

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const loadFromServer = useCartStore((s) => s.loadFromServer);
  const navigate = useNavigate();
  const toast = useToast();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [settings, setSettings] = useState({ flatShippingRate: 200, freeShippingThreshold: 0, taxRate: 0 });
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [addrRes, settingsRes] = await Promise.all([
          apiFetch('/api/addresses'),
          apiFetch('/api/checkout/settings'),
        ]);
        setAddresses(addrRes.addresses);
        setSettings(settingsRes.settings);
        const defaultAddress = addrRes.addresses.find((a) => a.isDefault) || addrRes.addresses[0];
        if (defaultAddress) setSelectedAddressId(defaultAddress.id);
        else setShowNewAddressForm(true);
      } catch (err) {
        toast.error(err.message || 'Could not load checkout details');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shipping = settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold
    ? 0
    : settings.flatShippingRate;
  const tax = Math.round((subtotal * (settings.taxRate || 0)) / 100);
  const grandTotal = subtotal + shipping + tax;

  const submitOrder = async (inlineAddress) => {
    setPlacing(true);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        notes,
        ...(inlineAddress
          ? { address: inlineAddress, saveAddress: true }
          : { addressId: selectedAddressId }),
      };
      const { order } = await apiFetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      await loadFromServer();
      toast.success('Order placed!');
      navigate(`/orders/${order.orderNumber}`, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Could not place your order');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <p>Your cart is empty — add something before checking out.</p>
          <Link to="/products" className="cart-empty__link glass-btn">Browse Products</Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="checkout-page"><p>Loading checkout…</p></div>;

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__title">Checkout</h1>

      <div className="checkout-layout">
        <div className="checkout-main">
          <section className="checkout-section">
            <h2>1. Delivery Address</h2>
            {!showNewAddressForm && addresses.length > 0 && (
              <div className="checkout-address-list">
                {addresses.map((a) => (
                  <label key={a.id} className={`checkout-address-card${selectedAddressId === a.id ? ' selected' : ''}`}>
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === a.id}
                      onChange={() => setSelectedAddressId(a.id)}
                    />
                    <div>
                      <strong>{a.receiverName}</strong> — {a.phone}
                      <p>{a.addressLine}, {a.area ? `${a.area}, ` : ''}{a.city}, {a.province} {a.postalCode}</p>
                    </div>
                  </label>
                ))}
                <button type="button" className="checkout-link-btn" onClick={() => setShowNewAddressForm(true)}>
                  + Use a new address
                </button>
              </div>
            )}

            {(showNewAddressForm || addresses.length === 0) && (
              <>
                {addresses.length > 0 && (
                  <button type="button" className="checkout-link-btn" onClick={() => setShowNewAddressForm(false)}>
                    ← Use a saved address
                  </button>
                )}
                <AddressForm submitLabel="Continue to Review" onSubmit={(data) => submitOrder(data)} submitting={placing} />
              </>
            )}
          </section>

          {!showNewAddressForm && addresses.length > 0 && (
            <section className="checkout-section">
              <h2>2. Order Notes (optional)</h2>
              <textarea
                className="checkout-notes"
                placeholder="Delivery instructions, landmark, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
              />
            </section>
          )}
        </div>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>
          <div className="checkout-summary__items">
            {items.map((item) => (
              <div className="checkout-summary__item" key={item.productId}>
                <span>{item.product?.name} × {item.quantity}</span>
                <span>{formatMoney((item.product?.salePrice ?? item.product?.retailPrice ?? 0) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatMoney(shipping)}</span>
          </div>
          {tax > 0 && (
            <div className="cart-summary__row">
              <span>Tax</span>
              <span>{formatMoney(tax)}</span>
            </div>
          )}
          <div className="cart-summary__row cart-summary__row--total">
            <span>Grand Total</span>
            <span>{formatMoney(grandTotal)}</span>
          </div>
          <div className="checkout-payment-note">Payment: Cash on Delivery</div>

          {!showNewAddressForm && addresses.length > 0 && (
            <button
              className="cart-summary__checkout glass-btn"
              onClick={() => submitOrder(null)}
              disabled={placing || !selectedAddressId}
            >
              {placing ? 'Placing Order…' : 'Place Order'}
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
