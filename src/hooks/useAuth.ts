import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import type { User } from './useUsers';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
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
      setUser(safeUser as User);
      localStorage.setItem('user', JSON.stringify(safeUser));
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
    localStorage.removeItem('user');
  };

  return { user, loading, error, login, logout };
};