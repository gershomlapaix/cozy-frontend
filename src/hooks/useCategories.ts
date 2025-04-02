
// hooks/useCategories.ts
import { useState, useEffect } from 'react';
import api from '@/services/api';

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

interface CategoriesResponse {
  content: Category[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get<CategoriesResponse>('/categories');
      setCategories(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories
  };
};
