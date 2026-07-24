import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../../../schemas/authSchemas';
import { useCustomerAuth } from '../CustomerAuthContext';
import '../auth.css';

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useCustomerAuth();
  const [formError, setFormError] = useState('');
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async ({ email }) => {
    setFormError('');
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setFormError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Reset your password</h1>
        <p className="auth-card__subtitle">We'll email you a link to set a new one</p>

        {formError && <div className="auth-alert">{formError}</div>}
        {sent && (
          <div className="auth-alert auth-alert--success">
            If an account exists for that email, a reset link is on its way.
          </div>
        )}

        {!sent && (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" autoFocus autoComplete="email" {...register('email')} />
              {errors.email && <p className="auth-field__error">{errors.email.message}</p>}
            </div>
            <button className="auth-submit glass-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="auth-card__footer">
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
