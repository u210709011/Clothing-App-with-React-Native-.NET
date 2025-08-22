import { useState, useCallback, useEffect } from 'react';
import { getCategories } from '@/services/product';
import { Category } from '@/types/product';
import { AppError } from '@/types/ui';

interface CategoryFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}

interface UseCategorySearchReturn {
  query: string;
  setQuery: (query: string) => void;
  setFilters: (filters: CategoryFilters) => void;
  categories: Category[];
  loading: boolean;
  hasMore: boolean;
  refresh: () => void;
  loadMore: () => void;
  error: AppError | null;
}

export function useCategorySearch({ pageSize = 20 }: { pageSize?: number } = {}): UseCategorySearchReturn {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<CategoryFilters>({ pageSize });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  const fetchCategories = useCallback(async (isRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentPage = isRefresh ? 1 : (filters.page || 1);
      const searchQuery = query.trim();

      const response = await getCategories();
      
      let filteredCategories = response;
      if (searchQuery) {
        filteredCategories = response.filter(category => 
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.slug.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

      if (isRefresh) {
        setCategories(paginatedCategories);
      } else {
        setCategories(prev => [...prev, ...paginatedCategories]);
      }

      setHasMore(endIndex < filteredCategories.length);
      setFilters(prev => ({ ...prev, page: currentPage }));
    } catch (err) {
      setError({
        name: 'Failed to fetch categories',
        message: 'Failed to fetch categories',
        code: 'FETCH_ERROR',
      });
    } finally {
      setLoading(false);
    }
  }, [query, filters.page, pageSize]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCategories([]);
      setFilters(prev => ({ ...prev, page: 1 }));
      fetchCategories(true);
    }, 650);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const refresh = useCallback(() => {
    setCategories([]);
    setFilters(prev => ({ ...prev, page: 1 }));
    fetchCategories(true);
  }, [fetchCategories]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
      fetchCategories();
    }
  }, [loading, hasMore, fetchCategories]);

  return {
    query,
    setQuery,
    setFilters,
    categories,
    loading,
    hasMore,
    refresh,
    loadMore,
    error,
  };
}
