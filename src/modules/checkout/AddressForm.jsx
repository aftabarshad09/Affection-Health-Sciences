import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema } from '../../schemas/addressSchema';
import '../auth/auth.css';

const PROVINCES = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir', 'Islamabad Capital Territory'];

export default function AddressForm({ defaultValues, onSubmit, submitLabel = 'Save Address', submitting = false }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(addressSchema), defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="auth-field">
        <label htmlFor="receiverName">Receiver name</label>
        <input id="receiverName" {...register('receiverName')} />
        {errors.receiverName && <p className="auth-field__error">{errors.receiverName.message}</p>}
      </div>
      <div className="auth-field">
        <label htmlFor="phone">Phone</label>
        <input id="phone" type="tel" {...register('phone')} />
        {errors.phone && <p className="auth-field__error">{errors.phone.message}</p>}
      </div>
      <div className="auth-field">
        <label htmlFor="province">Province</label>
        <select id="province" {...register('province')}>
          <option value="">Select province</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors.province && <p className="auth-field__error">{errors.province.message}</p>}
      </div>
      <div className="auth-field">
        <label htmlFor="city">City</label>
        <input id="city" {...register('city')} />
        {errors.city && <p className="auth-field__error">{errors.city.message}</p>}
      </div>
      <div className="auth-field">
        <label htmlFor="area">Area (optional)</label>
        <input id="area" {...register('area')} />
      </div>
      <div className="auth-field">
        <label htmlFor="postalCode">Postal code (optional)</label>
        <input id="postalCode" {...register('postalCode')} />
      </div>
      <div className="auth-field">
        <label htmlFor="addressLine">Full address</label>
        <input id="addressLine" {...register('addressLine')} />
        {errors.addressLine && <p className="auth-field__error">{errors.addressLine.message}</p>}
      </div>
      <button className="auth-submit glass-btn" type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
