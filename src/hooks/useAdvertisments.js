/**
 * React Query hooks for advertisements (Oglasi).
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { advertismentsApi } from '../core/api/advertisments';

const ADV_QUERY_KEY = ['advertisments'];

export function useAdvertisments() {
  return useQuery({
    queryKey: ADV_QUERY_KEY,
    queryFn: async () => {
      const { data } = await advertismentsApi.getList();
      return data;
    },
  });
}

export function useAdvertisment(id) {
  return useQuery({
    queryKey: [...ADV_QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await advertismentsApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useAddAdvertisment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => advertismentsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADV_QUERY_KEY }),
  });
}

export function useUpdateAdvertisment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => advertismentsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADV_QUERY_KEY }),
  });
}

export function useDeleteAdvertisment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => advertismentsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADV_QUERY_KEY }),
  });
}
