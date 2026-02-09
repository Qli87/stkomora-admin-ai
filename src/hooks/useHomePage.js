/**
 * React Query hooks for homepage (Početna stranica) content.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { homePageApi } from '../core/api/homePage';

const HOMEPAGE_QUERY_KEY = ['homePage'];

export function useHomePage() {
  return useQuery({
    queryKey: HOMEPAGE_QUERY_KEY,
    queryFn: async () => {
      const { data } = await homePageApi.get();
      return data;
    },
  });
}

export function useUpdateHomePage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => homePageApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: HOMEPAGE_QUERY_KEY }),
  });
}
