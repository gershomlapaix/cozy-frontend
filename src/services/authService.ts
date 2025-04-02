// services/authService.ts
import { AuthResponse, LoginRequest, RegisterRequest } from '@/components/auth';
import api from './api';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', response.data?.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    
    return response.data;
  },
  
  register: async (userData: RegisterRequest): Promise<void> => {
    await api.post('/auth/register', userData);
  },
  
  logout: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    window.location.href = '/login'; // Redirect to login page
  },
  
  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
    
    // Store the new token
    localStorage.setItem('accessToken', response.data.token);
    
    return response.data;
  },
}