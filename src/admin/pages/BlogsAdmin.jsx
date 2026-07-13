import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function BlogsAdmin() {
  const { authFetch } = useAuth();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => { if (data.success) setPosts(data.posts); });
  };

  useEffect(load, []);

  const handleDelete = async (slug) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      const res = await authFetch(`/api/blogs/${slug}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="admin-page-head">
        <h1>Blog Posts ({posts.length})</h1>
        <Link to="/admin/blogs/new" className="admin-btn">+ New Post</Link>
      </div>
      {error && <p className="admin-error">{error}</p>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.slug}>
              <td><img src={p.featuredImage} alt={p.title} /></td>
              <td>{p.title}</td>
              <td>{p.category}</td>
              <td>{p.date}</td>
              <td>
                <div className="admin-row-actions">
                  <Link to={`/admin/blogs/${p.slug}/edit`} className="admin-btn admin-btn--ghost">Edit</Link>
                  <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(p.slug)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
