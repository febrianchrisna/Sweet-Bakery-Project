import axios from 'axios';

// Base URL for the API
export const BASE_URL = 'https://bakery-be-663618957788.us-central1.run.app';

// Configure axios with interceptors for authentication
export const setupAxiosInterceptors = () => {
  // Request interceptor - add authorization header to every request
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.withCredentials = true;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle token refresh or logout on auth errors
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If error is 401 Unauthorized and not a retry and not a login request
      if (error.response?.status === 401 && 
          !originalRequest._retry && 
          !originalRequest.url?.includes('/login')) {
        originalRequest._retry = true;
        
        try {
          // Try to refresh token
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            const response = await axios.post(
              `${BASE_URL}/token`,
              { refreshToken },
              { withCredentials: true }
            );
            
            if (response.data.accessToken) {
              // Store new token
              localStorage.setItem('auth_token', response.data.accessToken);
              
              // Update authorization header
              originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
              
              // Retry the original request
              return axios(originalRequest);
            }
          }
          
          // Don't automatically log out or redirect here
          // Just let the component handle the error
          console.warn('Token refresh failed, component will handle redirect if needed');
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Don't automatically log out or redirect here
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Product categories
export const CATEGORIES = [
  'Bread',
  'Cake',
  'Pastry',
  'Cookies',
  'Dessert'
];
