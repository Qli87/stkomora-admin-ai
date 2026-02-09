/**
 * React Query hooks for companies (Ordinacija).
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesApi } from '../core/api/companies';

const COMPANIES_QUERY_KEY = ['companies'];

export function useCompanies(memberId = null) {
  return useQuery({
    queryKey: memberId ? [...COMPANIES_QUERY_KEY, memberId] : COMPANIES_QUERY_KEY,
    queryFn: async () => {
      const { data } = await companiesApi.getList(
        memberId ? { member_id: memberId } : undefined
      );
      return data;
    },
  });
}

export function useCompany(id) {
  return useQuery({
    queryKey: [...COMPANIES_QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await companiesApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useAddCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (company) => companiesApi.create(company),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => companiesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => companiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
}
