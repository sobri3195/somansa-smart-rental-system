import apiClient from './client';

export const propertiesApi = {
  list: (params) => {
    return apiClient.get('/api/properties/list.php', { params });
  },
  
  getById: (id) => {
    return apiClient.get(`/api/properties/detail.php?id=${id}`);
  },
  
  create: (data) => {
    return apiClient.post('/api/properties/create.php', data);
  },
  
  update: (id, data) => {
    return apiClient.put(`/api/properties/update.php?id=${id}`, data);
  },
  
  delete: (id) => {
    return apiClient.delete(`/api/properties/delete.php?id=${id}`);
  },
  
  getUnits: (propertyId, params) => {
    return apiClient.get(`/api/properties/${propertyId}/units.php`, { params });
  }
};

export const unitsApi = {
  list: (params) => {
    return apiClient.get('/api/units/list.php', { params });
  },
  
  getById: (id) => {
    return apiClient.get(`/api/units/detail.php?id=${id}`);
  },
  
  create: (data) => {
    return apiClient.post('/api/units/create.php', data);
  },
  
  update: (id, data) => {
    return apiClient.put(`/api/units/update.php?id=${id}`, data);
  },
  
  delete: (id) => {
    return apiClient.delete(`/api/units/delete.php?id=${id}`);
  }
};
