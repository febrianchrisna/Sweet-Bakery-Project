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

  // Login function
  const login = async (email, password) => {
    try {
      setAuthError('');
      const response = await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.status === "Success") {
        // Store user info in localStorage but not tokens
        localStorage.setItem('auth_user', JSON.stringify(response.data.safeUserData));
        
        // Update state
        setUser(response.data.safeUserData);
        setIsAuthenticated(true);
        setIsAdmin(response.data.safeUserData.role === 'admin');
        
        return true;
      } else {
        // Handle unexpected response format
        setAuthError('Login failed. Unexpected response from server.');
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      
      // Improved error message handling
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        if (error.response.status === 400) {
          // This is likely an invalid credentials error
          setAuthError(error.response.data.message || 'Invalid email or password');
        } else if (error.response.status === 429) {
          // Rate limiting
          setAuthError('Too many login attempts. Please try again later.');
        } else {
          setAuthError(error.response.data.message || 'An error occurred during login');
        }
      } else if (error.request) {
        // The request was made but no response was received
        setAuthError('No response from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request
        setAuthError('Error setting up request. Please try again.');
      }
      
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

  // Add this function to update the user in the context
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    
    // Also update in localStorage
    const userData = JSON.parse(localStorage.getItem('auth_user'));
    if (userData) {
      const updatedData = { ...userData, ...updatedUserData };
      localStorage.setItem('auth_user', JSON.stringify(updatedData));
    }
  };

  // Context value - add updateUser to the context value
  const value = {
    isAuthenticated,
    isAdmin,
    user,
    loading,
    login,
    register,
    logout,
    authError,
    token,
    updateUser  // Add this to the context
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
