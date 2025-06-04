import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('auth_token') || null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSubscribers, setRefreshSubscribers] = useState([]);
  const [tokenExpiryTime, setTokenExpiryTime] = useState(null);
  const [refreshTimer, setRefreshTimer] = useState(null);

  // Configure axios to use authorization header for every request when token exists
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
    }
  }, [token]);

  // Function to refresh token - uses cookies
  const refreshAccessToken = useCallback(async () => {
    try {
      setIsRefreshing(true);
      
      // Make a request to the refresh token endpoint
      // The refresh token is automatically sent in cookies due to withCredentials: true
      const response = await axios.get(`${BASE_URL}/token`, {
        withCredentials: true // Important to include cookies in the request
      });
      
      if (response.data.status === 'Success' && response.data.accessToken) {
        // Update access token in local storage and state
        localStorage.setItem('auth_token', response.data.accessToken);
        setToken(response.data.accessToken);
        
        // Calculate and store token expiry time (refresh 5 seconds before expiration)
        const expiryTime = new Date().getTime() + 25 * 1000; // 25 seconds in ms
        setTokenExpiryTime(expiryTime);
        
        console.log('Token refreshed successfully, next refresh in 25 seconds');
        return response.data.accessToken;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Only logout if it's a 403 error (invalid refresh token)
      if (error.response?.status === 403) {
        console.log('Refresh token invalid, logging out');
        logout();
      }
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Add subscribers to be executed after token refresh
  const subscribeToTokenRefresh = (callback) => {
    setRefreshSubscribers(prev => [...prev, callback]);
  };

  // Execute all subscribers after token refresh
  const onTokenRefreshed = (newToken) => {
    refreshSubscribers.forEach(callback => callback(newToken));
    setRefreshSubscribers([]);
  };

  // Set up a timer to refresh the token before it expires
  useEffect(() => {
    // Clear existing timer
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }

    // Only set up timer if we have a token and expiry time
    if (token && tokenExpiryTime) {
      const currentTime = new Date().getTime();
      const timeUntilRefresh = tokenExpiryTime - currentTime;
      
      // Only set timer if the token is not already expired
      if (timeUntilRefresh > 0) {
        console.log(`Token will be refreshed in ${timeUntilRefresh/1000} seconds`);
        const timer = setTimeout(() => {
          console.log('Refreshing token proactively');
          refreshAccessToken()
            .catch(error => console.error('Failed to refresh token:', error));
        }, timeUntilRefresh);
        
        setRefreshTimer(timer);
      } else {
        // If token is already expired, refresh it immediately
        console.log('Token already expired, refreshing immediately');
        refreshAccessToken()
          .catch(error => console.error('Failed to refresh token:', error));
      }
    }

    // Cleanup function
    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [token, tokenExpiryTime, refreshAccessToken]);

  // Set up axios interceptors for token refresh
  useEffect(() => {
    // Configure axios globally to include credentials for all requests
    axios.defaults.withCredentials = true;
    
    // Add request interceptor for debugging
    const requestInterceptor = axios.interceptors.request.use(
      config => {
        console.log('Making request to:', config.url);
        console.log('With credentials:', config.withCredentials);
        return config;
      },
      error => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );
    
    // Add a response interceptor to handle token expiration
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        console.error('Response error:', error);
        
        // Handle network errors
        if (error.code === 'ERR_NETWORK') {
          console.error('Network error - check if backend is running and CORS is configured');
          return Promise.reject(error);
        }

        const originalRequest = error.config;
        
        // If error is 401 (Unauthorized) and not a retry attempt
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          if (isRefreshing) {
            // If already refreshing, wait for the new token
            return new Promise((resolve) => {
              subscribeToTokenRefresh((newToken) => {
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                resolve(axios(originalRequest));
              });
            });
          } else {
            try {
              // Attempt to refresh the token
              const newToken = await refreshAccessToken();
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              onTokenRefreshed(newToken);
              return axios(originalRequest);
            } catch (refreshError) {
              // If refresh fails, don't retry the original request
              return Promise.reject(refreshError);
            }
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    // Clean up interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [isRefreshing, refreshAccessToken]);

  useEffect(() => {
    // Check if user is already authenticated via token in localStorage
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      
      if (storedToken && storedUser) {
        try {
          // Set token in axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Parse stored user data
          const userData = JSON.parse(storedUser);
          
          // Set user state and admin status
          setToken(storedToken);
          setUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(userData.role === 'admin');
          
          // Start the refresh cycle immediately for existing sessions
          const expiryTime = new Date().getTime() + 25 * 1000; // 25 seconds in ms
          setTokenExpiryTime(expiryTime);
          
          console.log('Restored authentication from localStorage');
        } catch (error) {
          console.log('Stored token invalid, clearing auth data');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setAuthError('');
      
      console.log('Attempting login to:', `${BASE_URL}/login`);
      
      // Make sure withCredentials is true to receive cookies
      const response = await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        { 
          withCredentials: true,
          timeout: 10000 // 10 second timeout
        }
      );

      if (response.data.status === "Success") {
        // Store user data in localStorage
        localStorage.setItem('auth_user', JSON.stringify(response.data.safeUserData));
        
        // Store access token in localStorage
        if (response.data.accessToken) {
          localStorage.setItem('auth_token', response.data.accessToken);
          setToken(response.data.accessToken);
          
          // Calculate token expiry time (refresh 5 seconds before expiration)
          const expiryTime = new Date().getTime() + 25 * 1000; // 25 seconds in ms
          setTokenExpiryTime(expiryTime);
          
          console.log('Login successful, token will refresh in 25 seconds');
        }
        
        // Update state
        setUser(response.data.safeUserData);
        setIsAuthenticated(true);
        setIsAdmin(response.data.safeUserData.role === 'admin');
        
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
      
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setAuthError(errorMessage);
      throw error;
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      setAuthError('');
      const response = await axios.post(
        `${BASE_URL}/register`, 
        { email, username, password },
        { withCredentials: false }
      );

      if (response.status === 201) {
        return true;
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setAuthError(
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      setAuthError('');
      const response = await axios.put(`${BASE_URL}/user/profile`, userData);
      
      // If username was updated, update the local user data
      if (userData.username && userData.username !== user.username) {
        const updatedUser = {...user, username: userData.username};
        setUser(updatedUser);
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      console.error('Profile update failed:', error);
      setAuthError(
        error.response?.data?.message || 
        'Failed to update profile. Please try again.'
      );
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear refresh timer
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        setRefreshTimer(null);
      }

      // Clear auth state and localStorage first
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setTokenExpiryTime(null);
      
      // Remove from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Clear Authorization header
      delete axios.defaults.headers.common['Authorization'];
      
      // Try to logout on the server side to clear refresh token cookie
      try {
        await axios.get(`${BASE_URL}/logout`, { 
          withCredentials: true 
        });
        console.log('Server logout successful');
      } catch (serverError) {
        console.log('Server logout failed, but user was logged out locally:', serverError);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if there's an error, we should still clear user data
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setTokenExpiryTime(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Context value
  const value = {
    isAuthenticated,
    isAdmin,
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    authError,
    token,
    refreshAccessToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
