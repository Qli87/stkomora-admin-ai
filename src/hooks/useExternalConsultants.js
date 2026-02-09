/**
 * React Query hooks for external consultants.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { externalConsultantsApi } from '../core/api/externalConsultants';

const CONSULTANTS_QUERY_KEY = ['externalConsultants'];

export function useExternalConsultants() {
  return useQuery({
    queryKey: CONSULTANTS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await externalConsultantsApi.getList();
      return data;
    },
  });
}

export function useExternalConsultant(id) {
  return useQuery({
    queryKey: [...CONSULTANTS_QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await externalConsultantsApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useAddExternalConsultant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => externalConsultantsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSULTANTS_QUERY_KEY });
    },
  });
}

export function useUpdateExternalConsultant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => externalConsultantsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CONSULTANTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...CONSULTANTS_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteExternalConsultant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => externalConsultantsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSULTANTS_QUERY_KEY });
    },
  });
}

export function useAddConsultantContract(consultantId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file) => externalConsultantsApi.addContract(consultantId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSULTANTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...CONSULTANTS_QUERY_KEY, consultantId] });
    },
  });
}

export function useRemoveConsultantContract(consultantId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contractId) => externalConsultantsApi.removeContract(consultantId, contractId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSULTANTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...CONSULTANTS_QUERY_KEY, consultantId] });
    },
  });
}
