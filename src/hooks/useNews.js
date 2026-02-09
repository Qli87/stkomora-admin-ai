/**
 * React Query hooks for news (server state).
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsApi } from '../core/api/news';

const NEWS_QUERY_KEY = ['news'];

export function useNews() {
  return useQuery({
    queryKey: NEWS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await newsApi.getList();
      return data;
    },
  });
}

export function useNewsItem(id) {
  return useQuery({
    queryKey: [...NEWS_QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await newsApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useAddNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => newsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY }),
  });
}

export function useUpdateNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => newsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY }),
  });
}

export function useDeleteNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => newsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY }),
  });
}
