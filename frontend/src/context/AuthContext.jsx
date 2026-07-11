import { createContext, useContext, useState, useEffect, startTransition } from 'react';
import api, { setTokens, clearTokens } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      startTransition(() => setLoading(false));
      return;
    }
    if (user) {
      startTransition(() => setLoading(false));
      return;
    }
    api.get('/auth/me/')
      .then(({ data }) => {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      })
      .catch(() => clearTokens())
      .finally(() => startTransition(() => setLoading(false)));
  }, [user]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login/', { email, password });
    setTokens(data.access, data.refresh);
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
