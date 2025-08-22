import { useCallback } from 'react';
import { useAsyncData } from './useAsyncData';
import { getProductById } from '@/services/product';
import { Product } from '@/types/product';

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for single product fetching
 * Handles product detail retrieval
 */
export function useProduct(productId: string | null): UseProductResult {
  const fetchProduct = useCallback(async (): Promise<Product | null> => {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    
    const product = await getProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  }, [productId]);

  const {
    data: product,
    loading,
    error,
    refresh,
    reset,
  } = useAsyncData(fetchProduct, {
    immediate: !!productId, // INFO: Only fetch if productId exists
    onError: (error) => {
      console.warn('Failed to fetch product:', error.message);
    },
  });

  return {
    product,
    loading,
    error,
    refresh,
    reset,
  };
}
