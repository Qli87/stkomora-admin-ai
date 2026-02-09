/**
 * React Query hooks for employees.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesApi } from '../core/api/employees';

const EMPLOYEES_QUERY_KEY = ['employees'];

export function useEmployees() {
  return useQuery({
    queryKey: EMPLOYEES_QUERY_KEY,
    queryFn: async () => {
      const { data } = await employeesApi.getList();
      return data;
    },
  });
}

export function useEmployee(id) {
  return useQuery({
    queryKey: [...EMPLOYEES_QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await employeesApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useAddEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (employee) => employeesApi.create(employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => employeesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...EMPLOYEES_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => employeesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
    },
  });
}
