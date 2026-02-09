/**
 * React Query hooks for congress registrations (Kongres).
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { congressApi } from '../core/api/congress';

const CONGRESS_QUERY_KEY = ['congress'];

export function useCongress() {
  return useQuery({
    queryKey: CONGRESS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await congressApi.getList();
      return data;
    },
  });
}

export function useCongressPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payment }) => congressApi.payment(id, payment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONGRESS_QUERY_KEY }),
  });
}

export function useDeleteCongressParticipant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => congressApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONGRESS_QUERY_KEY }),
  });
}
