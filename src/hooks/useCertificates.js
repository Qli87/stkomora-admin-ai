/**
 * React Query hooks for certificates (certificate + certificate_files).
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificatesApi } from '../core/api/certificates';

const CERTIFICATES_QUERY_KEY = ['certificates'];

export function useCertificates() {
  return useQuery({
    queryKey: CERTIFICATES_QUERY_KEY,
    queryFn: async () => {
      const { data } = await certificatesApi.getList();
      return data;
    },
  });
}

export function useCertificate(id) {
  return useQuery({
    queryKey: [...CERTIFICATES_QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await certificatesApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useAddCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => certificatesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATES_QUERY_KEY });
    },
  });
}

export function useAddCertificateFile(certificateId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => {
      const file = payload?.file ?? payload;
      const title = payload?.title;
      return certificatesApi.addFile(certificateId, file, title);
    },
    onSuccess: (_, __, certificateId) => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...CERTIFICATES_QUERY_KEY, certificateId] });
    },
  });
}

export function useRemoveCertificateFile(certificateId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId) => certificatesApi.removeFile(certificateId, fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...CERTIFICATES_QUERY_KEY, certificateId] });
    },
  });
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => certificatesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATES_QUERY_KEY });
    },
  });
}
