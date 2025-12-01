import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const propertiesApi = {
  getAll: (params) => apiClient.get('/api/properties', { params }),
  getById: (id) => apiClient.get(`/api/properties/${id}`),
  getUnits: (propertyId) => apiClient.get(`/api/properties/${propertyId}/units`),
};

export const bookingsApi = {
  getAll: (params) => apiClient.get('/api/bookings', { params }),
  getById: (id) => apiClient.get(`/api/bookings/${id}`),
  create: (data) => apiClient.post('/api/bookings', data),
  lookupByCode: (code) => apiClient.get(`/api/bookings/lookup/${code}`),
};

export const availabilityApi = {
  check: (propertyId, unitId, params) => 
    apiClient.get(`/api/availability/${propertyId}/${unitId || ''}`, { params }),
};

export const invoicesApi = {
  getByBookingId: (bookingId) => apiClient.get(`/api/invoices/${bookingId}`),
};

export default apiClient;
