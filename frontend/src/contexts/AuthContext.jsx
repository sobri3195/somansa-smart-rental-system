import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const response = await authApi.getCurrentUser();
        if (response.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      
      if (response.success) {
        const { user, token, token_type } = response.data;
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        if (user.tenant_id) {
          localStorage.setItem('tenant_id', user.tenant_id);
        }
        
        setUser(user);
        setIsAuthenticated(true);
        
        toast.success(response.message || 'Login successful');
        
        return { success: true, user };
      } else {
        toast.error(response.error || 'Login failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.error || 'Login failed. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (data) => {
    try {
      const response = await authApi.register(data);
      
      if (response.success) {
        toast.success(response.message || 'Registration successful! Please login.');
        return { success: true };
      } else {
        toast.error(response.error || 'Registration failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.error || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('tenant_id');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === 'string') {
      return user.role === roles;
    }
    return roles.includes(user.role);
  };

  const isCustomer = () => hasRole('customer');
  const isStaff = () => hasRole(['staff', 'owner', 'super_admin']);
  const isOwner = () => hasRole(['owner', 'super_admin']);
  const isSuperAdmin = () => hasRole('super_admin');

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole,
    isCustomer,
    isStaff,
    isOwner,
    isSuperAdmin,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
