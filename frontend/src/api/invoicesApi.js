import apiClient from './client';

export const invoicesApi = {
  list: (params) => {
    return apiClient.get('/api/invoices/list.php', { params });
  },
  
  getById: (id) => {
    return apiClient.get(`/api/invoices/detail.php?id=${id}`);
  },
  
  downloadPdf: (id) => {
    return apiClient.get(`/api/invoices/pdf.php?id=${id}`, {
      responseType: 'blob'
    });
  }
};

export const paymentsApi = {
  create: (data) => {
    return apiClient.post('/api/payments/create.php', data);
  },
  
  list: (params) => {
    return apiClient.get('/api/payments/list.php', { params });
  }
};
