import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  productCount: number;
}

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await axiosInstance.get('/db.json');
  return data.categories;
};

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
};