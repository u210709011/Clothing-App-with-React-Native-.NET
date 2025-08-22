import { useCallback, useEffect, useRef, useState } from 'react';
import { Product } from '@/types/product';
import { AppError } from '@/types/ui';
import { createAppError, ErrorContext, ErrorSeverity } from '@/utils/errorHandling';

import { ProductFilters, getProducts } from '@/services/product';

interface UseProductsOptions {
  initialFilters?: ProductFilters;
  pageSize?: number;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: AppError | null;
  hasMore: boolean;
  refresh: () => Promise<void>;
  loadMore: () => void;
  setFilters: (updater: (prev: ProductFilters) => ProductFilters) => void;
  filters: ProductFilters;
}


export function useProducts(options?: UseProductsOptions): UseProductsResult {

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<AppError | null>(null);

  const [page, setPage] = useState<number>(1);

  const [hasMore, setHasMore] = useState<boolean>(true);

  const [filters, setFiltersState] = useState<ProductFilters>(options?.initialFilters ?? {});

  const pageSize = options?.pageSize ?? 20;


  const fetchPage = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const nextPage = reset ? 1 : page;
      const data = await getProducts({ ...filters });
      const sliceStart = (nextPage - 1) * pageSize;
      const sliceEnd = sliceStart + pageSize;
      const pageItems = data.slice(sliceStart, sliceEnd);

      setHasMore(sliceEnd < data.length);
      setProducts(prev => reset ? pageItems : [...prev, ...pageItems]);
      setPage(reset ? 2 : nextPage + 1);
    } catch (err) {
      const appError = createAppError(err, ErrorContext.PRODUCT_FETCH, ErrorSeverity.MEDIUM);
      setError(appError);
    } finally {
      setLoading(false);
    }
  }, [filters, loading, page, pageSize]);

  const refresh = useCallback(async () => {
    setPage(1);
    await fetchPage(true);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    fetchPage(false);
  }, [fetchPage, hasMore, loading]);

  // INFO: Update filters and reset pagination
  const setFilters = useCallback((updater: (prev: ProductFilters) => ProductFilters) => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setFiltersState(prev => updater(prev));
  }, []);

  // INFO: Refetch when filters change
  useEffect(() => {
    fetchPage(true);
  }, [filters]);

  return { products, loading, error, hasMore, refresh, loadMore, setFilters, filters };
}


