import { create } from 'zustand';

import { Product } from '@/types/product';

import { saveItem, loadItem } from '@/utils/storage';

interface WishlistStore {
  wishlistItems: Product[];
  isLoading: boolean;
  onWishlistChange?: (items: Product[]) => void;
  
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  loadWishlist: () => Promise<void>;
  clearWishlist: () => void;
  setWishlistChangeCallback: (callback: (items: Product[]) => void) => void;
  setWishlistDirect: (products: Product[]) => Promise<void>;
}

// INFO: Wishlist store
export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlistItems: [],
  isLoading: false,
  onWishlistChange: undefined,

  // INFO: Add to wishlist
  addToWishlist: async (product: Product) => {
    const { wishlistItems, onWishlistChange } = get();
    const isAlreadyInWishlist = wishlistItems.some(item => item.id === product.id);
    
    if (!isAlreadyInWishlist) {
      const newWishlist = [...wishlistItems, product];
      set({ wishlistItems: newWishlist });
      await saveItem('wishlist', newWishlist);
      onWishlistChange?.(newWishlist);
    }
  },

  // INFO: Remove from wishlist
  removeFromWishlist: async (productId: string) => {
    const { wishlistItems, onWishlistChange } = get();
    const newWishlist = wishlistItems.filter(item => item.id !== productId);
    set({ wishlistItems: newWishlist });
    await saveItem('wishlist', newWishlist);
    onWishlistChange?.(newWishlist);
  },

  // INFO: Check if product is in wishlist
  isInWishlist: (productId: string) => {
    const { wishlistItems } = get();
    return wishlistItems.some(item => item.id === productId);
  },

  // INFO: Load wishlist from AsyncStorage (for sync)
  loadWishlist: async () => {
    set({ isLoading: true });
    try {
      const savedWishlist = await loadItem('wishlist');
      if (savedWishlist) {
        set({ wishlistItems: savedWishlist });
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // INFO: Clear wishlist and AsyncStorage
  clearWishlist: async () => {
    const { onWishlistChange } = get();
    set({ wishlistItems: [] });
    await saveItem('wishlist', []);
    onWishlistChange?.([]);
  },

  // INFO: Set callback for wishlist changes (for sync)
  setWishlistChangeCallback: (callback: (items: Product[]) => void) => {
    set({ onWishlistChange: callback });
  },

  // INFO: replace wishlist without triggering sync callback (for sync) 
  setWishlistDirect: async (products: Product[]) => {
    set({ wishlistItems: products });
    await saveItem('wishlist', products);
  },
}));

export const useWishlist = () => {
  const { wishlistItems, isLoading, addToWishlist, removeFromWishlist, isInWishlist, loadWishlist, clearWishlist, setWishlistChangeCallback, setWishlistDirect } = useWishlistStore();
  
  return {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loadWishlist,
    clearWishlist,
    setWishlistChangeCallback,
    setWishlistDirect,
    wishlistCount: wishlistItems.length,
  };
};
