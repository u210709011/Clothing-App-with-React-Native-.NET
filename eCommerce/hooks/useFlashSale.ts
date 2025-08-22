import { useCallback } from 'react';
import { useAsyncData } from './useAsyncData';
import { getFlashSaleProducts } from '@/services/product';
import { Product } from '@/types/product';

interface FlashSaleData {
  products: Product[];
  title: string;
  endTime: string | null;
}

interface UseFlashSaleResult {
  flashSaleProducts: Product[];
  flashSaleTitle: string;
  flashSaleEndTime: string | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  reset: () => void;
}

/**
 * INFO: Specialized hook for flash sale data management
 * Handles flash sale products, metadata, and timing
 */
export function useFlashSale(): UseFlashSaleResult {
  const fetchFlashSale = useCallback(async (): Promise<FlashSaleData> => {
    const result = await getFlashSaleProducts();
    return {
      products: result.products,
      title: result.title,
      endTime: result.endTime,
    };
  }, []);

  const {
    data: flashSaleData,
    loading,
    error,
    refresh,
    reset,
  } = useAsyncData(fetchFlashSale, {
    onError: (error) => {
      console.warn('Failed to fetch flash sale data:', error.message);
    },
  });

  return {
    flashSaleProducts: flashSaleData?.products || [],
    flashSaleTitle: flashSaleData?.title || '',
    flashSaleEndTime: flashSaleData?.endTime || null,
    loading,
    error,
    refresh,
    reset,
  };
}
