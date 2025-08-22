import { create } from 'zustand';

import { Cart, CartItem, AddToCartData } from '@/types/cart';

import { CartStorage } from '@/utils/storage';

interface CartStore extends Cart {
  isLoading: boolean;
  onCartChange?: (items: CartItem[]) => void;
  
  addToCart: (data: AddToCartData) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  loadCart: () => Promise<void>;
  setCartChangeCallback: (callback: (items: CartItem[]) => void) => void;
  setCartDirect: (cart: Cart) => Promise<void>;
  
  getItemCount: () => number;
  getTotalPrice: () => number;
}

const generateCartItemId = (productId: string, variants: Record<string, string>): string => {
  const variantString = Object.entries(variants)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  return `${productId}_${variantString}`;
};

  // INFO: Zustand cart store
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  onCartChange: undefined,

  // INFO: Add or increment an item to cart
  addToCart: (data: AddToCartData) => {
    const state = get();
    const itemId = generateCartItemId(data.product.id, data.selectedVariants);
    
    const existingItemIndex = state.items.findIndex(item => item.id === itemId);
    
    let newItems: CartItem[];
    
    // INFO: Merge quantities if item exists in cart
    if (existingItemIndex >= 0) {
      newItems = state.items.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + data.quantity }
          : item
      );
    } else {
      const newItem: CartItem = {
        id: itemId,
        product: data.product,
        quantity: data.quantity,
        selectedVariants: data.selectedVariants,
        dateAdded: new Date().toISOString(),
      };
      newItems = [...state.items, newItem];
    }
    // INFO: Recompute totals and persist to AsyncStorage
    const newCart = {
      items: newItems,
      totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    };
    
    set(newCart);
    CartStorage.saveCart(newCart);
    get().onCartChange?.(newCart.items);
  },

  // INFO: Remove item from cart
  removeFromCart: (itemId: string) => {
    const state = get();
    const newItems = state.items.filter(item => item.id !== itemId);
    
    const newCart = {
      items: newItems,
      totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    };
    
    set(newCart);
    CartStorage.saveCart(newCart);
    get().onCartChange?.(newCart.items);
  },

  // INFO: Update item quantity
  updateQuantity: (itemId: string, quantity: number) => {
    const state = get();
    
    if (quantity <= 0) {
      get().removeFromCart(itemId);
      return;
    }
    
    const newItems = state.items.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
    
    const newCart = {
      items: newItems,
      totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    };
    
    set(newCart);
    CartStorage.saveCart(newCart);
    get().onCartChange?.(newCart.items);
  },

  // INFO: Clear all cart contents and AsyncStorage
  clearCart: () => {
    const emptyCart = {
      items: [],
      totalItems: 0,
      totalPrice: 0,
    };
    
    set(emptyCart);
    CartStorage.clearCart();
    get().onCartChange?.([]);
  },

  // INFO: Load cart from AsyncStorage
  loadCart: async () => {
    set({ isLoading: true });
    
    try {
      const savedCart = await CartStorage.loadCart();
      
      if (savedCart) {
        const cart = {
          items: savedCart.items || [],
          totalItems: savedCart.totalItems || 0,
          totalPrice: savedCart.totalPrice || 0,
        };
        set({ ...cart, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      set({ isLoading: false });
    }
  },

  getItemCount: () => {
    const state = get();
    return state.totalItems;
  },

  getTotalPrice: () => {
    const state = get();
    return state.totalPrice;
  },

  // INFO: Set callback for cart changes (for sync)
  setCartChangeCallback: (callback: (items: CartItem[]) => void) => {
    set({ onCartChange: callback });
  },

  // INFO: Rreplace cart without triggering sync callback
  setCartDirect: async (cart: Cart) => {
    set({
      items: cart.items,
      totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    });
    await CartStorage.saveCart(cart);
  },
}));
