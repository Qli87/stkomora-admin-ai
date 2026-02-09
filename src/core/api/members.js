/**
 * Members API – all server calls for members (and cities).
 * Used by React Query hooks; no Redux.
 */
import apiClient from './client';

export const membersApi = {
  getList: () => apiClient.get('/member'),
  getById: (id) => apiClient.get(`/member/${id}`),
  create: (data) => apiClient.post('/member', data),
  update: (id, data) => apiClient.put(`/member/${id}`, { ...data, id }),
  delete: (id) => apiClient.delete(`/member/${id}`),
};

export const citiesApi = {
  getList: () => apiClient.get('/cities'),
};
