import apiClient from './client';

export const bookingsApi = {
  list: (params) => {
    return apiClient.get('/api/bookings/list.php', { params });
  },
  
  create: (data) => {
    return apiClient.post('/api/bookings/create.php', data);
  },
  
  getById: (id) => {
    return apiClient.get(`/api/bookings/detail.php?id=${id}`);
  },
  
  update: (id, data) => {
    return apiClient.put(`/api/bookings/update.php?id=${id}`, data);
  },
  
  updateStatus: (id, status, data = {}) => {
    return apiClient.patch(`/api/bookings/update-status.php?id=${id}`, {
      status,
      ...data
    });
  },
  
  cancel: (id, reason) => {
    return apiClient.delete(`/api/bookings/delete.php?id=${id}`, { data: { reason } });
  },
  
  checkAvailability: (unitId, startDate, endDate) => {
    return apiClient.get('/api/bookings/availability.php', {
      params: { unit_id: unitId, start: startDate, end: endDate }
    });
  },
  
  calculatePrice: (data) => {
    return apiClient.post('/api/bookings/calculate-price.php', data);
  }
};
