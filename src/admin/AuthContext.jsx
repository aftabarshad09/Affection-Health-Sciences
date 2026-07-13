import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'ahs_admin_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_KEY));

  const login = useCallback(async (username, password) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Login failed');
    sessionStorage.setItem(STORAGE_KEY, data.token);
    setToken(data.token);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
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

  return (
    <AuthContext.Provider value={{ token, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- context + hook live together intentionally
export const useAuth = () => useContext(AuthContext);
