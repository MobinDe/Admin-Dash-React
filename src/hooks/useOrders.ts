import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface Order {
  id: number;
  customer: string;
  total: number;
  status: string;
  date: string;
}

const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await axiosInstance.get('/db.json');
  return data.orders;
};

export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });
};