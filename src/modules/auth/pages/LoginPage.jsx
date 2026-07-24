import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../../schemas/authSchemas';
import { useCustomerAuth } from '../CustomerAuthContext';
import '../auth.css';

export default function LoginPage() {
  const { login } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async ({ email, password }) => {
    setFormError('');
    try {
      await login(email, password);
      navigate(location.state?.from || '/account', { replace: true });
    } catch (err) {
      setFormError(err.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__subtitle">Log in to track orders and manage your account</p>

        {formError && <div className="auth-alert">{formError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoFocus autoComplete="email" {...register('email')} />
            {errors.email && <p className="auth-field__error">{errors.email.message}</p>}
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="current-password" {...register('password')} />
            {errors.password && <p className="auth-field__error">{errors.password.message}</p>}
          </div>
          <button className="auth-submit glass-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-card__footer">
          <Link to="/forgot-password">Forgot your password?</Link>
        </p>
        <p className="auth-card__footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
