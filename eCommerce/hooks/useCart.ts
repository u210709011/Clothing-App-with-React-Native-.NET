import { useEffect } from 'react';

import { useCartStore } from '@/store/cart';

import { AddToCartData } from '@/types/cart';

export const useCart = () => {
  const {
    items,
    totalItems,
    totalPrice,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
    setCartChangeCallback,
    setCartDirect,
    getItemCount,
    getTotalPrice,
  } = useCartStore();

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addItem = (data: AddToCartData) => {
    addToCart(data);
  };

  const removeItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    updateQuantity(itemId, quantity);
  };

  const clear = () => {
    clearCart();
  };

  const isEmpty = items.length === 0;

  return {
    items,
    totalItems,
    totalPrice,
    isLoading,
    isEmpty,
    
    addItem,
    removeItem,
    updateItemQuantity,
    clear,
    loadCart,
    setCartChangeCallback,
    setCartDirect,
  
    getItemCount,
    getTotalPrice,
  };
};
