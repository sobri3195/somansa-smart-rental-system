import apiClient from './client';

export const reviewsApi = {
  create: (data) => {
    return apiClient.post('/api/reviews/create.php', data);
  },
  
  list: (params) => {
    return apiClient.get('/api/reviews/list.php', { params });
  },
  
  getByProperty: (propertyId, params = {}) => {
    return apiClient.get('/api/reviews/list.php', {
      params: {
        property_id: propertyId,
        ...params
      }
    });
  },
  
  getByUnit: (unitId, params = {}) => {
    return apiClient.get('/api/reviews/list.php', {
      params: {
        unit_id: unitId,
        ...params
      }
    });
  }
};
