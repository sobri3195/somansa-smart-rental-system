import apiClient from './client';

export const calendarApi = {
  getEvents: (params) => {
    return apiClient.get('/api/calendar.php', { params });
  }
};
