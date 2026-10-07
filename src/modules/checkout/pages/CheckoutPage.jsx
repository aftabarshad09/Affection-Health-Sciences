import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '../../../schemas/checkoutSchema';
import { useCartStore } from '../../cart/cartStore';
import { useToast } from '../../../hooks/useToastStore';
import { formatMoney } from '../../../utils/currency';
import '../checkout.css';

const PROVINCES = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir', 'Islamabad Capital Territory'];

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);
  const navigate = useNavigate();
  const toast = useToast();
  const [settings, setSettings] = useState({ flatShippingRate: 200, freeShippingThreshold: 0, taxRate: 0 });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(checkoutSchema) });

  useEffect(() => {
    fetch('/api/checkout/settings')
      .then((r) => r.json())
      .then((d) => { if (d.success) setSettings(d.settings); })
      .catch(() => {});
  }, []);

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

  const shipping = settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold ? 0 : settings.flatShippingRate;
  const tax = Math.round((subtotal * (settings.taxRate || 0)) / 100);
  const grandTotal = subtotal + shipping + tax;
  const hasUnpriced = items.some((i) => !(i.product?.salePrice ?? i.product?.retailPrice));

  const onSubmit = async (data) => {
    const payload = {
      customer: { name: data.name, email: data.email, phone: data.phone },
      address: {
        apartment: data.apartment,
        addressLine: data.addressLine,
        area: data.area,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
      },
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      notes: data.notes,
    };
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || 'Could not place your order');
      clear();
      navigate('/order-confirmation', { replace: true, state: { orderNumber: result.order.orderNumber } });
    } catch (err) {
      toast.error(err.message || 'Could not place your order');
    }
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__title">Checkout</h1>
      <form className="checkout-layout" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="checkout-main">
          <section className="checkout-section">
            <h2>Contact Details</h2>
            <div className="checkout-grid">
              <div className="auth-field">
                <label htmlFor="name">Full name *</label>
                <input id="name" autoComplete="name" {...register('name')} />
                {errors.name && <p className="auth-field__error">{errors.name.message}</p>}
              </div>
              <div className="auth-field">
                <label htmlFor="phone">Phone *</label>
                <input id="phone" type="tel" autoComplete="tel" {...register('phone')} />
                {errors.phone && <p className="auth-field__error">{errors.phone.message}</p>}
              </div>
              <div className="auth-field checkout-grid__full">
                <label htmlFor="email">Email *</label>
                <input id="email" type="email" autoComplete="email" {...register('email')} />
                {errors.email && <p className="auth-field__error">{errors.email.message}</p>}
              </div>
            </div>
          </section>

          <section className="checkout-section">
            <h2>Delivery Address</h2>
            <div className="checkout-grid">
              <div className="auth-field">
                <label htmlFor="province">Province *</label>
                <select id="province" {...register('province')}>
                  <option value="">Select province</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.province && <p className="auth-field__error">{errors.province.message}</p>}
              </div>
              <div className="auth-field">
                <label htmlFor="city">City *</label>
                <input id="city" {...register('city')} />
                {errors.city && <p className="auth-field__error">{errors.city.message}</p>}
              </div>
              <div className="auth-field">
                <label htmlFor="area">Area / Town</label>
                <input id="area" {...register('area')} />
              </div>
              <div className="auth-field">
                <label htmlFor="apartment">Apartment / House no.</label>
                <input id="apartment" {...register('apartment')} />
              </div>
              <div className="auth-field">
                <label htmlFor="postalCode">Postal code</label>
                <input id="postalCode" {...register('postalCode')} />
              </div>
              <div className="auth-field checkout-grid__full">
                <label htmlFor="addressLine">Street address *</label>
                <input id="addressLine" autoComplete="street-address" placeholder="House/street, landmark" {...register('addressLine')} />
                {errors.addressLine && <p className="auth-field__error">{errors.addressLine.message}</p>}
              </div>
              <div className="auth-field checkout-grid__full">
                <label htmlFor="notes">Order notes (optional)</label>
                <textarea id="notes" rows={2} {...register('notes')} />
              </div>
            </div>
          </section>

          <section className="checkout-section">
            <h2>Payment</h2>
            <label className="checkout-cod">
              <input type="radio" checked readOnly />
              <span><strong>Cash on Delivery</strong> — pay in cash when your order arrives.</span>
            </label>
          </section>
        </div>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>
          <div className="checkout-summary__items">
            {items.map((item) => {
              const price = item.product?.salePrice ?? item.product?.retailPrice ?? null;
              return (
                <div className="checkout-summary__item" key={item.productId}>
                  <span>{item.product?.name} × {item.quantity}</span>
                  <span>{price ? formatMoney(price * item.quantity) : 'On request'}</span>
                </div>
              );
            })}
          </div>
          <div className="cart-summary__row"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
          <div className="cart-summary__row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatMoney(shipping)}</span></div>
          {tax > 0 && <div className="cart-summary__row"><span>Tax</span><span>{formatMoney(tax)}</span></div>}
          <div className="cart-summary__row cart-summary__row--total"><span>Total</span><span>{formatMoney(grandTotal)}</span></div>
          {hasUnpriced && <p className="checkout-summary__note">Some items are priced on request — we'll confirm the final total with you.</p>}
          <button className="checkout-place-btn glass-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Placing Order…' : 'Place Order (COD)'}
          </button>
          <Link to="/cart" className="checkout-back">← Back to cart</Link>
        </aside>
      </form>
    </div>
  );
}
