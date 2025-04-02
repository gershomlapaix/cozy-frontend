import axios from 'axios';

const API_URL = process.env.API_URL;

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 (Unauthorized) and not already retrying
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Here you would typically refresh the token
      // For now, just redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username: string, password: string) => {
    return api.post('/auth/login', { username, password });
  },
  
  register: (data: any) => {
    return api.post('/auth/register', data);
  },
};

// User API
export const userAPI = {
  getCurrentUser: () => {
    return api.get('/users/me');
  },
  
  updateProfile: (data: any) => {
    return api.put('/users/me', data);
  },
};

// Service API
export const serviceAPI = {
  getServices: (params?: any) => {
    return api.get('/services', { params });
  },
  
  getServiceById: (id: number) => {
    return api.get(`/services/${id}`);
  },
  
  getServicesByType: (type: string, params?: any) => {
    return api.get(`/services/type/${type}`, { params });
  },
  
  searchServices: (keyword: string, params?: any) => {
    return api.get('/services/search', { 
      params: { 
        keyword,
        ...params 
      } 
    });
  },
  
  createService: (data: any) => {
    return api.post('/services', data);
  },
  
  updateService: (id: string, data: any) => {
    return api.put(`/services/${id}`, data);
  },
  
  deleteService: (id: string) => {
    return api.delete(`/services/${id}`);
  },
};

// Booking API
export const bookingAPI = {
  getBookings: () => {
    return api.get('/bookings');
  },
  
  getBookingById: (id: string) => {
    return api.get(`/bookings/${id}`);
  },
  
  createBooking: (data: any) => {
    return api.post('/bookings', data);
  },
  
  updateBookingStatus: (id: string, status: string, cancellationReason?: string) => {
    return api.patch(`/bookings/${id}/status`, null, { 
      params: { 
        status,
        cancellationReason
      } 
    });
  },
};

// Location API
export const locationAPI = {
  getLocations: () => {
    return api.get('/locations');
  },
  
  getLocationById: (id: string) => {
    return api.get(`/locations/${id}`);
  },
  
  getPopularLocations: () => {
    return api.get('/locations/popular');
  },
};

// Category API
export const categoryAPI = {
  getCategories: () => {
    return api.get('/categories');
  },
  
  getCategoryById: (id: string) => {
    return api.get(`/categories/${id}`);
  },
};

// Review API
export const reviewAPI = {
  getReviewsByServiceId: (serviceId: string) => {
    return api.get(`/reviews/service/${serviceId}`);
  },
  
  createReview: (data: any) => {
    return api.post('/reviews', data);
  },
};

interface AvailabilityRequest {
  serviceId: number;
  startDateTime: string;
  endDateTime: string;
  isAvailable: boolean;
  notes?: string;
}

export const availabilityAPI = {
  /**
   * Get availabilities for a service
   */
  getAvailabilitiesByServiceId: (serviceId: number) => {
    return api.get(`/availabilities/service/${serviceId}`);
  },
  
  /**
   * Get availabilities for a service between dates
   */
  getAvailabilitiesBetweenDates: (serviceId: number, startDate: string, endDate: string) => {
    return api.get(`/availabilities/service/${serviceId}`, {
      params: {
        startDate,
        endDate
      }
    });
  },
  
  /**
   * Get available dates for a service between dates
   */
  getAvailableDatesByServiceId: (serviceId: number, startDate: string, endDate: string) => {
    return api.get(`/availabilities/service/${serviceId}/available`, {
      params: {
        startDate,
        endDate
      }
    });
  },
  
  /**
   * Create a new availability
   */
  createAvailability: (data: AvailabilityRequest) => {
    return api.post(`/availabilities`, data);
  },
  
  /**
   * Create bulk availabilities
   */
  createBulkAvailabilities: (data: AvailabilityRequest[]) => {
    return api.post(`/availabilities/bulk`, data);
  },
  
  /**
   * Update an availability
   */
  updateAvailability: (id: number, data: AvailabilityRequest) => {
    return api.put(`/availabilities/${id}`, data);
  },
  
  /**
   * Delete an availability
   */
  deleteAvailability: (id: number) => {
    return api.delete(`/availabilities/${id}`);
  }
};

export default api;