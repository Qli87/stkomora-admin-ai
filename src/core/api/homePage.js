/**
 * Homepage (Početna stranica) API – used by React Query hooks.
 */
import apiClient from './client';

export const homePageApi = {
  get: () => apiClient.get('/homePage'),
  update: (id, data) => apiClient.put(`/homePage/${id}`, data),
};
