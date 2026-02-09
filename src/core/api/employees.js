/**
 * Employees API – supports JSON and FormData (for file uploads).
 */
import apiClient from './client';

function extractFile(value) {
  if (value instanceof File) return value;
  if (Array.isArray(value) && value[0]?.originFileObj) return value[0].originFileObj;
  return null;
}

function buildFormData(data) {
  const formData = new FormData();
  const personalFile = extractFile(data.personal_id);
  const contractFile = extractFile(data.contract);
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'personal_id' || key === 'contract') return;
    if (value === undefined || value === null) return;
    if (value instanceof Date) {
      formData.append(key, value.toISOString().split('T')[0]);
    } else if (typeof value === 'boolean') {
      formData.append(key, value ? '1' : '0');
    } else {
      formData.append(key, String(value));
    }
  });
  if (personalFile) formData.append('personal_id', personalFile);
  if (contractFile) formData.append('contract', contractFile);
  return formData;
}

function hasFiles(data) {
  return !!extractFile(data.personal_id) || !!extractFile(data.contract);
}

export const employeesApi = {
  getList: () => apiClient.get('/employees'),
  getById: (id) => apiClient.get(`/employees/${id}`),
  fetchFileBlob: async (id, field, disposition = 'inline') => {
    const { data } = await apiClient.get(`/employees/${id}/file/${field}`, {
      responseType: 'blob',
      params: { disposition },
    });
    return data;
  },
  create: (data) => {
    if (hasFiles(data)) {
      const formData = buildFormData(data);
      return apiClient.post('/employees', formData);
    }
    return apiClient.post('/employees', data);
  },
  update: (id, data) => {
    if (hasFiles(data)) {
      const formData = buildFormData(data);
      return apiClient.put(`/employees/${id}`, formData);
    }
    return apiClient.put(`/employees/${id}`, data);
  },
  delete: (id) => apiClient.delete(`/employees/${id}`),
};
