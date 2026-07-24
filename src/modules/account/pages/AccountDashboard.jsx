import { Link } from 'react-router-dom';
import { useCustomerAuth } from '../../auth/CustomerAuthContext';

export default function AccountDashboard() {
  const { profile } = useCustomerAuth();

  return (
    <div>
      <h1 className="account-welcome">Hi, {profile?.full_name || 'there'} 👋</h1>
      <p>Manage your orders, addresses, and account details here.</p>

      <div className="account-quick-links">
        <Link className="account-quick-link glass-btn" to="/orders">My Orders</Link>
        <Link className="account-quick-link glass-btn" to="/account/addresses">Addresses</Link>
        <Link className="account-quick-link glass-btn" to="/account/settings">Account Settings</Link>
        <Link className="account-quick-link glass-btn" to="/products">Continue Shopping</Link>
      </div>
    </div>
  );
}
