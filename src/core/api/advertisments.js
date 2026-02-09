/**
 * Advertisements (Oglasi) API – used by React Query hooks.
 */
import apiClient from './client';

export const advertismentsApi = {
  getList: () => apiClient.get('/advertisments'),
  getById: (id) => apiClient.get(`/advertisments/${id}`),
  create: (data) => apiClient.post('/advertisments', data),
  update: (id, data) => apiClient.put(`/advertisments/${id}`, { ...data, id }),
  delete: (id) => apiClient.delete(`/advertisments/${id}`),
};
