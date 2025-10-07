import { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      if (savedToken) {
        setToken(savedToken);
        if (savedUser) {
          try { setUser(JSON.parse(savedUser)); }
          catch { setUser(null); }
        } else {
          try {
            const res = await apiClient.get('/auth/me');
            if (res?.data) {
              setUser(res.data);
              localStorage.setItem('user', JSON.stringify(res.data));
            }
          } catch (err) {
            console.warn('No se pudo obtener user desde /auth/me', err);
          }
        }
      }
      setLoading(false);
    };
    restore();
  }, []);

  const login = async (username, password) => {
    const res = await apiClient.post('/auth/login', { username, password });
    const data = res.data ?? {};
    const t = data.token ?? data.accessToken ?? null;
    const u = data.user ?? data.userData ?? null;

    if (!t) throw new Error('Login: token no recibido');

    localStorage.setItem('token', t);
    setToken(t);

    if (u) {
      localStorage.setItem('user', JSON.stringify(u));
      setUser(u);
    }
    return { token: t, user: u };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};