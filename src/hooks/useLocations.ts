import { useState, useEffect } from 'react';
import api from '@/services/api';

export interface Location {
  id: number;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  description?: string;
  thumbnail?: string;
}

interface LocationsResponse {
  content: Location[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get<LocationsResponse>('/locations');      
      setLocations(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch locations'));
      console.error('Error fetching locations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return {
    locations,
    isLoading,
    error,
    refetch: fetchLocations
  };
};