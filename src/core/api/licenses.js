/**
 * Licenses API.
 */
import apiClient from './client';

export const licensesApi = {
  getList: (params) => apiClient.get('/licenses', { params }),
  getById: (id) => apiClient.get(`/licenses/${id}`),
  create: (data) => apiClient.post('/licenses', data),
  update: (id, data) => apiClient.put(`/licenses/${id}`, data),
  delete: (id) => apiClient.delete(`/licenses/${id}`),
};
