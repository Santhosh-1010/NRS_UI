import { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

const STORAGE_KEY = 'task_manager_auth';

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (username, password) => {
    const { token, username: name } = await authApi.login(username, password);
    const nextAuth = { token, username: name };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token: auth?.token ?? null, username: auth?.username ?? null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
