import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'ahs_admin_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Wraps fetch with the auth header and clears the session on 401, so a
  // stale/expired token bounces the user back to the login screen instead of
  // silently failing requests.
  const authFetch = useCallback(
    async (url, options = {}) => {
      const res = await fetch(url, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        logout();
        throw new Error('Session expired — please log in again');
      }
      return res;
    },
    [token, logout]
  );

  const login = useCallback(async (email, password) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Login failed');
    sessionStorage.setItem(STORAGE_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  // On a page refresh the token survives in sessionStorage but `user` does
  // not (it's only ever set in-memory) — re-fetch it once so role-gated UI
  // (e.g. the super_admin-only user management page) still works.
  useEffect(() => {
    if (token && !user) {
      authFetch('/api/admin/me')
        .then((res) => res.json())
        .then((data) => { if (data.success) setUser(data.user); })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- context + hook live together intentionally
export const useAuth = () => useContext(AuthContext);
