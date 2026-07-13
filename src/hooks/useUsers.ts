import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive';
  joined: string;
}

const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axiosInstance.get('/db.json');
  return data.users;
};

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};