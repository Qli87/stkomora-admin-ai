/**
 * React Query hooks for licenses.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { licensesApi } from '../core/api/licenses';

const LICENSES_QUERY_KEY = ['licenses'];

export function useLicenses(memberId = null, userId = null) {
  // Support both memberId (legacy) and userId (new)
  const filterId = userId || memberId;
  return useQuery({
    queryKey: filterId ? [...LICENSES_QUERY_KEY, filterId] : LICENSES_QUERY_KEY,
    queryFn: async () => {
      const params = {};
      if (userId) {
        params.user_id = userId;
      } else if (memberId) {
        // Backward compatibility
        params.member_id = memberId;
      }
      const { data } = await licensesApi.getList(Object.keys(params).length > 0 ? params : undefined);
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
