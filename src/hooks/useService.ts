// hooks/useServices.ts
import useSWR from 'swr';
import api from '@/services/api';

const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data;
};

export function useServices(type?: string, page = 1, limit = 10) {
  const url = type 
    ? `/services/type/${type}?page=${page-1}&size=${limit}` 
    : `/services?page=${page-1}&size=${limit}`;
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    services: data?.content || [],
    totalPages: data?.totalPages || 0,
    totalElements: data?.totalElements || 0,
    isLoading,
    isError: error,
    mutate
  };
}

export function useServiceDetails(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/services/${id}` : null,
    fetcher
  );

  return {
    service: data,
    isLoading,
    isError: error
  };
}