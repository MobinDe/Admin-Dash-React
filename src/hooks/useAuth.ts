import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import type { User } from './useUsers';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    // وقتی صفحه رفرش میشه، user رو از localStorage بازیابی کن
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.get('/db.json');
      const foundUser = data.users.find(
        (u: User & { password: string }) =>
          u.email === email && u.password === password
      );
      if (!foundUser) {
        throw new Error('ایمیل یا رمز عبور اشتباه است');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _unused, ...safeUser } = foundUser;

      // ✅ توکن بساز و ذخیره کن
      const fakeToken = `token-${safeUser.id}-${Date.now()}`;
      localStorage.setItem(TOKEN_KEY, fakeToken);
      localStorage.setItem(USER_KEY, JSON.stringify(safeUser));

      setUser(safeUser as User);
      return safeUser;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای ناشناخته';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  return { user, loading, error, login, logout };
};