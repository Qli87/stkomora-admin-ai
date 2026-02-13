/**
 * React Query hooks for finances.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financesApi } from '../core/api/finances';

const FINANCES_QUERY_KEY = ['finances'];

export function useFinances() {
  return useQuery({
    queryKey: FINANCES_QUERY_KEY,
    queryFn: async () => {
      const { data } = await financesApi.getList();
      return data;
    },
  });
}

export function useFinance(id) {
  return useQuery({
    queryKey: [...FINANCES_QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await financesApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useMemberFinanceDetails(memberId) {
  return useQuery({
    queryKey: [...FINANCES_QUERY_KEY, 'member', memberId],
    queryFn: async () => {
      const { data } = await financesApi.getMemberDetails(memberId);
      return data;
    },
    enabled: !!memberId,
  });
}

export function useAddFinance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (finance) => financesApi.create(finance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCES_QUERY_KEY });
    },
  });
}

export function useUpdateFinance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => financesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FINANCES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...FINANCES_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteFinance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => financesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCES_QUERY_KEY });
    },
  });
}
