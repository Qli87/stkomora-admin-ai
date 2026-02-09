/**
 * React Query hooks for categories (used by news).
 */
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../core/api/categories';

const CATEGORIES_QUERY_KEY = ['categories'];

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const { data } = await categoriesApi.getList();
      return data;
    },
  });
}
