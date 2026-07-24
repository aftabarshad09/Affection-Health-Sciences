import { NavLink, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../auth/CustomerAuthContext';
import './account.css';

export default function AccountLayout({ children }) {
  const { logout } = useCustomerAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="account-shell">
      <nav className="account-nav">
        <NavLink to="/account" end className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>
        <NavLink to="/orders" className={({ isActive }) => (isActive ? 'active' : '')}>My Orders</NavLink>
        <NavLink to="/account/addresses" className={({ isActive }) => (isActive ? 'active' : '')}>Addresses</NavLink>
        <NavLink to="/account/settings" className={({ isActive }) => (isActive ? 'active' : '')}>Account Settings</NavLink>
        <button className="account-nav__logout" onClick={handleLogout}>Log out</button>
      </nav>
      <div>{children}</div>
    </div>
  );
}
