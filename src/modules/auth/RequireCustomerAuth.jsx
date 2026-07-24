import { Navigate, useLocation } from 'react-router-dom';
import { useCustomerAuth } from './CustomerAuthContext';

export default function RequireCustomerAuth({ children }) {
  const { isAuthenticated, loading } = useCustomerAuth();
  const location = useLocation();

  if (loading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
