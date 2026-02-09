/**
 * React Query hooks for licenses.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { licensesApi } from '../core/api/licenses';

const LICENSES_QUERY_KEY = ['licenses'];

export function useLicenses(memberId = null) {
  return useQuery({
    queryKey: memberId ? [...LICENSES_QUERY_KEY, memberId] : LICENSES_QUERY_KEY,
    queryFn: async () => {
      const { data } = await licensesApi.getList(
        memberId ? { member_id: memberId } : undefined
      );
      return data;
    },
  });
}

export function useLicense(id) {
  return useQuery({
    queryKey: [...LICENSES_QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await licensesApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useAddLicense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (license) => licensesApi.create(license),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LICENSES_QUERY_KEY });
    },
  });
}

export function useUpdateLicense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => licensesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: LICENSES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...LICENSES_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteLicense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => licensesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LICENSES_QUERY_KEY });
    },
  });
}
