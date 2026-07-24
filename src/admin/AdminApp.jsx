import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import RequireAuth from './RequireAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductsAdmin from './pages/ProductsAdmin';
import ProductForm from './pages/ProductForm';
import ReviewsAdmin from './pages/ReviewsAdmin';
import OrdersAdmin from './pages/OrdersAdmin';
import OrderDetailAdmin from './pages/OrderDetailAdmin';
import CategoriesAdmin from './pages/CategoriesAdmin';
import InventoryAdmin from './pages/InventoryAdmin';
import SettingsAdmin from './pages/SettingsAdmin';
import ActivityLogsAdmin from './pages/ActivityLogsAdmin';
import CustomersAdmin from './pages/CustomersAdmin';
import './admin.css';

function AdminNav() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="admin-nav">
      <span className="admin-nav__brand">AHS Admin</span>
      <NavLink to="/admin" end>Dashboard</NavLink>
      <NavLink to="/admin/orders">Orders</NavLink>
      <NavLink to="/admin/products">Products</NavLink>
      <NavLink to="/admin/categories">Categories</NavLink>
      <NavLink to="/admin/inventory">Inventory</NavLink>
      <NavLink to="/admin/users">Users</NavLink>
      <NavLink to="/admin/activity-logs">Activity Logs</NavLink>
      <NavLink to="/admin/settings">Settings</NavLink>
      <NavLink to="/admin/reviews">Reviews</NavLink>
      <button
        className="admin-nav__logout"
        onClick={() => { logout(); navigate('/admin/login'); }}
      >
        Log out
      </button>
    </nav>
  );
}

function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <AdminNav />
      <div className="admin-main">{children}</div>
    </div>
  );
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          path="*"
          element={
            <RequireAuth>
              <AdminLayout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="orders" element={<OrdersAdmin />} />
                  <Route path="orders/:id" element={<OrderDetailAdmin />} />
                  <Route path="products" element={<ProductsAdmin />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/:id/edit" element={<ProductForm />} />
                  <Route path="categories" element={<CategoriesAdmin />} />
                  <Route path="inventory" element={<InventoryAdmin />} />
                  <Route path="users" element={<CustomersAdmin />} />
                  <Route path="activity-logs" element={<ActivityLogsAdmin />} />
                  <Route path="settings" element={<SettingsAdmin />} />
                  <Route path="reviews" element={<ReviewsAdmin />} />
                </Routes>
              </AdminLayout>
            </RequireAuth>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
