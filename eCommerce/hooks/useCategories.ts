import { useCallback } from 'react';
import { useAsyncData } from './useAsyncData';
import { getCategories } from '@/services/product';
import { Category } from '@/types/product';
import { ErrorContext } from '@/utils/errorHandling';

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  reset: () => void;
}


export function useCategories(): UseCategoriesResult {
  const fetchCategories = useCallback(async () => {
    return await getCategories();
  }, []);

  const {
    data: categories,
    loading,
    error,
    refresh,
    reset,
  } = useAsyncData(fetchCategories, {
    onError: (error) => {
      console.warn(`[${ErrorContext.CATEGORY_FETCH}] Failed to fetch categories:`, error.message);
    },
  });

  return {
    categories: categories || [],
    loading,
    error,
    refresh,
    reset,
  };
}
