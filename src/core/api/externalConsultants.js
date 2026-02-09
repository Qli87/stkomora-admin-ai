/**
 * External Consultants API.
 */
import apiClient from './client';

function extractFile(value) {
  if (value instanceof File) return value;
  if (Array.isArray(value) && value[0]?.originFileObj) return value[0].originFileObj;
  return null;
}

function extractFiles(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((v) => (v?.originFileObj ? v.originFileObj : v instanceof File ? v : null))
      .filter(Boolean);
  }
  const single = extractFile(value);
  return single ? [single] : [];
}

function buildFormData(data) {
  const formData = new FormData();
  const personalFile = extractFile(data.personal_id);
  const contractFiles = extractFiles(data.contracts);
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'personal_id' || key === 'contracts') return;
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
  contractFiles.forEach((f) => formData.append('contracts[]', f));
  return formData;
}

function hasFiles(data) {
  return !!extractFile(data.personal_id) || extractFiles(data.contracts).length > 0;
}

export const externalConsultantsApi = {
  getList: () => apiClient.get('/external-consultants'),
  getById: (id) => apiClient.get(`/external-consultants/${id}`),
  create: (data) => {
    if (hasFiles(data)) {
      return apiClient.post('/external-consultants', buildFormData(data));
    }
    return apiClient.post('/external-consultants', data);
  },
  update: (id, data) => {
    if (hasFiles(data)) {
      return apiClient.put(`/external-consultants/${id}`, buildFormData(data));
    }
    return apiClient.put(`/external-consultants/${id}`, data);
  },
  delete: (id) => apiClient.delete(`/external-consultants/${id}`),
  addContract: (id, file) => {
    const formData = new FormData();
    formData.append('contract', file);
    return apiClient.post(`/external-consultants/${id}/contracts`, formData);
  },
  removeContract: (id, contractId) =>
    apiClient.delete(`/external-consultants/${id}/contracts/${contractId}`),
  fetchPersonalIdBlob: async (id, disposition = 'inline') => {
    const { data } = await apiClient.get(`/external-consultants/${id}/file/personal_id`, {
      responseType: 'blob',
      params: { disposition },
    });
    return data;
  },
  fetchContractBlob: async (id, contractId, disposition = 'inline') => {
    const { data } = await apiClient.get(
      `/external-consultants/${id}/contracts/${contractId}/file`,
      { responseType: 'blob', params: { disposition } }
    );
    return data;
  },
};
