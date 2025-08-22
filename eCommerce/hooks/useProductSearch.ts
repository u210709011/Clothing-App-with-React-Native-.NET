import { useCallback, useEffect, useRef, useState } from 'react';

import { getProductsPaged, ProductFilters } from '@/services/product';

import { Product } from '@/types/product';

import { createAppError, ErrorContext, ErrorSeverity } from '@/utils/errorHandling';

interface UseProductSearchOptions {
  pageSize?: number;
}

interface UseProductSearchResult {
  query: string;
  setQuery: (text: string) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  products: Product[];
  loading: boolean;
  error: any | null;
  hasMore: boolean;
  refresh: () => Promise<void>;
  loadMore: () => void;
}


  /**
   * Custom hook for product search
   * Handles product search and filtering
   */

export function useProductSearch(options?: UseProductSearchOptions): UseProductSearchResult {
  const [query, setQuery] = useState<string>('');
  const [filters, setFiltersState] = useState<ProductFilters>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const pageSize = options?.pageSize ?? 20;

  const debouncedQueryRef = useRef<string>('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPage = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const nextPage = reset ? 1 : page;
      const serverFilters: ProductFilters = {
        ...filters,
        search: debouncedQueryRef.current,
      };
      const { items, total } = await getProductsPaged(serverFilters, nextPage, pageSize);
      const newItems = reset ? items : [...products, ...items];
      setProducts(newItems);
      const consumed = nextPage * pageSize;
      setHasMore(consumed < total);
      setPage(reset ? 2 : nextPage + 1);
    } catch (err) {
      const appError = createAppError(err, ErrorContext.PRODUCT_FETCH, ErrorSeverity.MEDIUM);
      setError(appError);
    } finally {
      setLoading(false);
    }
  }, [loading, page, pageSize, products, filters]);

  const refresh = useCallback(async () => {
    setPage(1);
    await fetchPage(true);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    fetchPage(false);
  }, [fetchPage, hasMore, loading]);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      debouncedQueryRef.current = query.trim();
      setProducts([]);
      setPage(1);
      setHasMore(true);
      void fetchPage(true);
    }, 650);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);


  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    void fetchPage(true);
  }, [filters]);

  const setFilters = useCallback((partial: Partial<ProductFilters>) => {
    setFiltersState(prev => ({ ...prev, ...partial }));
  }, []);

  return { query, setQuery, setFilters, products, loading, error, hasMore, refresh, loadMore };
}


