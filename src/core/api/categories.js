/**
 * Categories API – used for news and other features.
 */
import apiClient from './client';

export const categoriesApi = {
  getList: () => apiClient.get('/category'),
};
