import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Manage the content that's shown on the public site without touching any code.</p>
      <div className="admin-card" style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
        <Link to="/admin/products" className="admin-btn">Manage Products</Link>
        <Link to="/admin/blogs" className="admin-btn">Manage Blog Posts</Link>
        <Link to="/admin/reviews" className="admin-btn">Manage Reviews</Link>
      </div>
    </div>
  );
}
