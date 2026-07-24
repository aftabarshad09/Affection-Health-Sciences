import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../../schemas/authSchemas';
import { useCustomerAuth } from '../CustomerAuthContext';
import { apiFetch } from '../../../lib/apiClient';
import '../auth.css';

export default function RegisterPage() {
  const { register: registerAccount } = useCustomerAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async ({ fullName, email, phone, password }) => {
    setFormError('');
    try {
      const { session } = await registerAccount({ fullName, email, phone, password });
      if (session) {
        // Supabase returns a session immediately when email confirmation is
        // off; when it's on, session is null and the "check your email"
        // branch below runs instead. Depends on Supabase Dashboard →
        // Authentication → Email Auth → "Confirm email" for this project.
        apiFetch('/api/profile/welcome', { method: 'POST' }).catch(() => {});
        navigate('/account', { replace: true });
      } else {
        setDone(true);
      }
    } catch (err) {
      setFormError(err.message || 'Registration failed');
    }
  };

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-card__title">Check your email</h1>
          <div className="auth-alert auth-alert--success">
            We've sent a verification link — confirm your email, then log in.
          </div>
          <p className="auth-card__footer">
            <Link to="/login">Back to login</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Create your account</h1>
        <p className="auth-card__subtitle">Order faster next time and track your deliveries</p>

        {formError && <div className="auth-alert">{formError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-field">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" autoFocus autoComplete="name" {...register('fullName')} />
            {errors.fullName && <p className="auth-field__error">{errors.fullName.message}</p>}
          </div>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" {...register('email')} />
            {errors.email && <p className="auth-field__error">{errors.email.message}</p>}
          </div>
          <div className="auth-field">
            <label htmlFor="phone">Phone (optional)</label>
            <input id="phone" type="tel" autoComplete="tel" {...register('phone')} />
            {errors.phone && <p className="auth-field__error">{errors.phone.message}</p>}
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="new-password" {...register('password')} />
            {errors.password && <p className="auth-field__error">{errors.password.message}</p>}
          </div>
          <button className="auth-submit glass-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
