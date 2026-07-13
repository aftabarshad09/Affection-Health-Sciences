import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import RequireAuth from './RequireAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductsAdmin from './pages/ProductsAdmin';
import ProductForm from './pages/ProductForm';
import BlogsAdmin from './pages/BlogsAdmin';
import BlogForm from './pages/BlogForm';
import ReviewsAdmin from './pages/ReviewsAdmin';
import './admin.css';

function AdminNav() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="admin-nav">
      <span className="admin-nav__brand">AHS Admin</span>
      <NavLink to="/admin" end>Dashboard</NavLink>
      <NavLink to="/admin/products">Products</NavLink>
      <NavLink to="/admin/blogs">Blog Posts</NavLink>
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
                  <Route path="products" element={<ProductsAdmin />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/:id/edit" element={<ProductForm />} />
                  <Route path="blogs" element={<BlogsAdmin />} />
                  <Route path="blogs/new" element={<BlogForm />} />
                  <Route path="blogs/:slug/edit" element={<BlogForm />} />
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
