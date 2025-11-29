import apiClient from './client';

export const authApi = {
  register: (data) => {
    return apiClient.post('/api/auth/register', data);
  },
  
  login: (credentials) => {
    return apiClient.post('/api/auth/login', credentials);
  },
  
  logout: () => {
    return apiClient.post('/api/auth/logout');
  },
  
  getCurrentUser: () => {
    return apiClient.get('/api/auth/me');
  },
  
  updateProfile: (data) => {
    return apiClient.put('/api/auth/profile', data);
  },
  
  changePassword: (data) => {
    return apiClient.post('/api/auth/change-password', data);
  }
};
