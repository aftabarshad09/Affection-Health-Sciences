import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileUpdateSchema, resetPasswordSchema } from '../../../schemas/authSchemas';
import { useCustomerAuth } from '../../auth/CustomerAuthContext';
import { apiFetch } from '../../../lib/apiClient';
import { useToast } from '../../../hooks/useToastStore';
import '../../auth/auth.css';

function ProfileForm() {
  const { profile, refreshProfile } = useCustomerAuth();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: { fullName: profile?.full_name || '', phone: profile?.phone || '' },
  });

  const onSubmit = async (data) => {
    try {
      await apiFetch('/api/profile', { method: 'PUT', body: JSON.stringify(data) });
      await refreshProfile();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Could not update profile');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="auth-field">
        <label htmlFor="fullName">Full name</label>
        <input id="fullName" {...register('fullName')} />
        {errors.fullName && <p className="auth-field__error">{errors.fullName.message}</p>}
      </div>
      <div className="auth-field">
        <label htmlFor="phone">Phone</label>
        <input id="phone" type="tel" {...register('phone')} />
        {errors.phone && <p className="auth-field__error">{errors.phone.message}</p>}
      </div>
      <div className="auth-field">
        <label>Email</label>
        <input value={profile?.email || ''} disabled />
      </div>
      <button className="auth-submit glass-btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  );
}

function PasswordForm() {
  const { updatePassword } = useCustomerAuth();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async ({ password }) => {
    try {
      await updatePassword(password);
      toast.success('Password updated');
      reset();
    } catch (err) {
      toast.error(err.message || 'Could not update password');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="auth-field">
        <label htmlFor="password">New password</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <p className="auth-field__error">{errors.password.message}</p>}
      </div>
      <div className="auth-field">
        <label htmlFor="confirmPassword">Confirm new password</label>
        <input id="confirmPassword" type="password" {...register('confirmPassword')} />
        {errors.confirmPassword && <p className="auth-field__error">{errors.confirmPassword.message}</p>}
      </div>
      <button className="auth-submit glass-btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating…' : 'Change Password'}
      </button>
    </form>
  );
}

export default function AccountSettingsPage() {
  return (
    <div>
      <div className="account-card">
        <h2>Profile</h2>
        <ProfileForm />
      </div>
      <div className="account-card">
        <h2>Change Password</h2>
        <PasswordForm />
      </div>
    </div>
  );
}
