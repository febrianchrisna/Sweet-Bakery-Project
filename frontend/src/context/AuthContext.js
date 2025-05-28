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
      
      // Make sure withCredentials is true to receive cookies
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
      setAuthError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
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
      // Pastikan URL menggunakan BASE_URL yang benar + endpoint yang benar
      const response = await axios.put(`${BASE_URL}/users/profile`, userData);
      
      // If username was updated, update the local user data
      if (userData.username && user && userData.username !== user.username) {
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
      // First, clear auth state and localStorage
      // This way, even if the server request fails, the user will still be logged out in the frontend
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
      
      // Try to logout on the server side, but don't block the logout process if it fails
      try {
        // Make sure withCredentials is true to send cookies
        await axios.get(`${BASE_URL}/logout`, { 
          withCredentials: true 
        });
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
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('refresh_token');
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
    token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
