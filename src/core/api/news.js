/**
 * News API – used by React Query hooks.
 */
import apiClient from './client';

export const newsApi = {
  getList: () => apiClient.get('/news'),
  getById: (id) => apiClient.get(`/news/${id}`),
  getForCategory: (id) => apiClient.get(`/newsForCategory/${id}`),
  create: (data) => {
    const formData = new FormData();
    formData.append('category_id', data.category_id);
    formData.append('category_name', data.category_name || '');
    formData.append('content', data.content || '');
    formData.append('full_text', data.full_text || '');
    formData.append('posted_by', 'admin');
    formData.append('title', data.title);
    if (data.date) formData.append('date', data.date);
    if (data.images) formData.append('images', data.images);
    if (data.imgTitle) formData.append('imgTitle', data.imgTitle);
    return apiClient.post('/news', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id, data) => apiClient.put(`/news/${id}`, { ...data, id }),
  delete: (id) => apiClient.delete(`/news/${id}`),
};
