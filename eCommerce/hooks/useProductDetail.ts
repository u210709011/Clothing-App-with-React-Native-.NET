import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

import { Product } from '@/types/product';
import { useProduct } from './useProduct';
import { useCart } from './useCart';
import { useWishlist } from '@/store/user';

interface UseProductDetailOptions {
  productId: string | null;
}

interface UseProductDetailResult {
  product: Product | null;
  loading: boolean;
  
  selectedOptions: Record<string, string>;
  isImageViewerVisible: boolean;
  currentImageIndex: number;
  
  handleVariantSelect: (variantId: string, value: string) => void;
  handleAddToCart: () => void;
  handleWishlistToggle: () => void;
  handleImagePress: (index: number) => void;
  closeImageViewer: () => void;
  
  isWishlisted: boolean;
}


export function useProductDetail({ productId }: UseProductDetailOptions): UseProductDetailResult {
  const { product, loading } = useProduct(productId);
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, loadWishlist } = useWishlist();
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);
  
  useEffect(() => {
    if (product) {
      setSelectedOptions({});
    }
  }, [product?.id]);
  
  const handleVariantSelect = useCallback((variantId: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [variantId]: value }));
  }, []);
  
  const handleAddToCart = useCallback(() => {
    if (!product) return;
    
    const allOptionsSelected = product.variants.every(
      variant => selectedOptions[variant.id]
    );
    
    if (!allOptionsSelected) {
      Alert.alert('Please select all options');
      return;
    }
    
    addItem({
      product,
      quantity: 1,
      selectedVariants: selectedOptions,
    });
    
    Alert.alert('Added to cart!', `${product.name} has been added to your cart.`);
  }, [product, selectedOptions, addItem]);
  
  const handleWishlistToggle = useCallback(() => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [product, isInWishlist, addToWishlist, removeFromWishlist]);
  
  const handleImagePress = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setIsImageViewerVisible(true);
  }, []);
  
  const closeImageViewer = useCallback(() => {
    setIsImageViewerVisible(false);
  }, []);
  
  return {
    product,
    loading,
    
    selectedOptions,
    isImageViewerVisible,
    currentImageIndex,
    
    handleVariantSelect,
    handleAddToCart,
    handleWishlistToggle,
    handleImagePress,
    closeImageViewer,
    
    isWishlisted: product ? isInWishlist(product.id) : false,
  };
}
