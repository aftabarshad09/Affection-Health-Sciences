import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '../../../schemas/authSchemas';
import { useCustomerAuth } from '../CustomerAuthContext';
import '../auth.css';

// Reached via the link in the "reset password" email — Supabase puts the
// user into a recovery session automatically when the link is followed, so
// updatePassword() here just needs the new password, nothing else.
export default function ResetPasswordPage() {
  const { updatePassword } = useCustomerAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async ({ password }) => {
    setFormError('');
    try {
      await updatePassword(password);
      navigate('/account', { replace: true });
    } catch (err) {
      setFormError(err.message || 'Could not update your password');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Set a new password</h1>

        {formError && <div className="auth-alert">{formError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-field">
            <label htmlFor="password">New password</label>
            <input id="password" type="password" autoFocus autoComplete="new-password" {...register('password')} />
            {errors.password && <p className="auth-field__error">{errors.password.message}</p>}
          </div>
          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input id="confirmPassword" type="password" autoComplete="new-password" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="auth-field__error">{errors.confirmPassword.message}</p>}
          </div>
          <button className="auth-submit glass-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}
