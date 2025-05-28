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

  // Configure axios globally to include credentials for all requests
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  // Register function
  const register = async (email, username, password) => {
    try {
      setAuthError('');
      
      // Client-side validation
      if (!email || !username || !password) {
        setAuthError('All fields are required');
        return false;
      }
      
      if (password.length < 6) {
        setAuthError('Password must be at least 6 characters long');
        return false;
      }
      
      if (!email.includes('@')) {
        setAuthError('Please enter a valid email address');
        return false;
      }
      
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
      
      // More specific error messages
      const errorMessage = error.response?.data?.message;
      if (errorMessage?.includes('already registered') || errorMessage?.includes('already exists')) {
        setAuthError('An account with this email already exists. Please use a different email or try logging in.');
      } else if (errorMessage?.includes('validation')) {
        setAuthError('Please check your input and try again.');
      } else {
        setAuthError(errorMessage || 'Registration failed. Please try again.');
      }
      return false;
    }
  };

  // Login function with better error handling
  const login = async (email, password) => {
    try {
      setAuthError('');
      
      // Client-side validation
      if (!email || !password) {
        setAuthError('Email and password are required');
        throw new Error('Email and password are required');
      }
      
      if (!email.includes('@')) {
        setAuthError('Please enter a valid email address');
        throw new Error('Please enter a valid email address');
      }
      
      const response = await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.status === "Success") {
        // Store user data in localStorage
        localStorage.setItem('auth_user', JSON.stringify(response.data.safeUserData));
        
        // For fallback, store tokens in case cookies don't work
        if (response.data.accessToken) {
          localStorage.setItem('auth_token', response.data.accessToken);
          setToken(response.data.accessToken);
        }
        
        // Update state
        setUser(response.data.safeUserData);
        setIsAuthenticated(true);
        setIsAdmin(response.data.safeUserData.role === 'admin');
        
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
      
      // More specific error messages
      const errorMessage = error.response?.data?.message;
      if (errorMessage?.includes('incorrect') || errorMessage?.includes('invalid')) {
        setAuthError('Invalid email or password. Please check your credentials and try again.');
      } else if (errorMessage?.includes('not found')) {
        setAuthError('No account found with this email address. Please register first.');
      } else if (error.code === 'NETWORK_ERROR') {
        setAuthError('Network error. Please check your internet connection and try again.');
      } else {
        setAuthError(errorMessage || 'Login failed. Please check your credentials and try again.');
      }
      
      throw error; // Re-throw to be caught by the calling component
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Make sure withCredentials is true to send cookies
      await axios.get(`${BASE_URL}/logout`, { 
        withCredentials: true 
      });
      
      // Clear auth state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      
      // Remove from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('refresh_token');
      
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
