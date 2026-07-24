import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

export default function CustomersAdmin() {
  const { authFetch, user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('customer');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    authFetch(`/api/admin/users?role=${roleFilter}`)
      .then((res) => res.json())
      .then((data) => { if (data.success) setUsers(data.users); })
      .finally(() => setLoading(false));
  };

  useEffect(load, [roleFilter]);

  const handleStatusToggle = async (u) => {
    const nextStatus = u.status === 'active' ? 'suspended' : 'active';
    await authFetch(`/api/admin/users/${u.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    load();
  };

  const handleRoleChange = async (u, role) => {
    if (!window.confirm(`Change ${u.email}'s role to ${role}?`)) return;
    await authFetch(`/api/admin/users/${u.id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    load();
  };

  return (
    <div>
      <div className="admin-page-head">
        <h1>Users</h1>
      </div>

      <div className="admin-filter-bar">
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="customer">Customers</option>
          <option value="admin">Admins</option>
          <option value="super_admin">Super Admins</option>
        </select>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.fullName || '—'}</td>
                <td>{u.email}</td>
                <td>{u.phone || '—'}</td>
                <td>
                  {isSuperAdmin ? (
                    <select value={u.role} onChange={(e) => handleRoleChange(u, e.target.value)}>
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  ) : (
                    u.role
                  )}
                </td>
                <td><span className={`admin-badge admin-badge--${u.status === 'active' ? 'active' : 'cancelled'}`}>{u.status}</span></td>
                <td>
                  <button className="admin-btn admin-btn--ghost" onClick={() => handleStatusToggle(u)}>
                    {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
