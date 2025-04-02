// hooks/useAccommodations.ts
import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Service } from '@/components/auth';

interface AccommodationsFilter {
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  location?: string;
  rating?: number;
  searchTerm?: string;
}

interface AccommodationsResponse {
  content: Service[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const useAccommodations = (initialPage = 0, initialSize = 10) => {
  const [accommodations, setAccommodations] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState<AccommodationsFilter>({});

  const fetchAccommodations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('size', size.toString());
      
      if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.category) params.append('categoryId', filters.category);
      if (filters.location) params.append('locationId', filters.location);
      if (filters.rating) params.append('minRating', filters.rating.toString());
      if (filters.searchTerm) params.append('keyword', filters.searchTerm);
      
      const response = await api.get<AccommodationsResponse>(`/services/type/ACCOMMODATION?${params}`);
      setAccommodations(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch accommodations'));
      console.error('Error fetching accommodations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update accommodations when page, size or filters change
  useEffect(() => {
    fetchAccommodations();
  }, [page, size, filters]);

  const updateFilters = (newFilters: Partial<AccommodationsFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reset to first page when filters change
    setPage(0);
  };

  return {
    accommodations,
    isLoading,
    error,
    page,
    size,
    totalPages,
    totalElements,
    setPage,
    setSize,
    filters,
    updateFilters,
    refetch: fetchAccommodations
  };
};