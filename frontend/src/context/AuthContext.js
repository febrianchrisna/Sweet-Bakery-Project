import React, { createContext, useState, useEffect } from 'react';
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
      const response = await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        { withCredentials: false }
      );

      if (response.data.accessToken) {
        // Store both tokens and user info in localStorage
        localStorage.setItem('auth_token', response.data.accessToken);
        
        // Store refresh token as well now that backend returns it directly
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken);
        }
        
        localStorage.setItem('auth_user', JSON.stringify(response.data.safeUserData));
        
        // Update state
        setToken(response.data.accessToken);
        setUser(response.data.safeUserData);
        setIsAuthenticated(true);
        setIsAdmin(response.data.safeUserData.role === 'admin');
        
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
      return false;
    }
  };

  // Register function
  const register = async (email, username, password) => {
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
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Attempt to notify the backend
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          await axios.get(`${BASE_URL}/logout`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (err) {
          console.log('Backend logout failed, continuing with client logout');
        }
      }
      
      // Clear auth state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      
      // Remove from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_user');
      
      // Clear Authorization header
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Logout failed:', error);
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
    authError,
    token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
