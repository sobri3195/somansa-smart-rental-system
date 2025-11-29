import apiClient from './client';

export const photosApi = {
  upload: (entityType, entityId, formData) => {
    return apiClient.post('/api/photos/upload.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        entity_type: entityType,
        entity_id: entityId
      }
    });
  },
  
  list: (entityType, entityId) => {
    return apiClient.get('/api/photos/list.php', {
      params: {
        entity_type: entityType,
        entity_id: entityId
      }
    });
  },
  
  delete: (id) => {
    return apiClient.delete(`/api/photos/delete.php?id=${id}`);
  }
};
