import React, { createContext, useContext, ReactNode, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/auth';
import { useWishlist } from '@/store/user';
import { useCart } from '@/hooks/useCart';
import { fetchWishlist, syncWishlist, fetchCart, syncCart, getProductsByIds, reconstructCartItems } from '@/services/userData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const { loadWishlist, wishlistItems, clearWishlist, setWishlistChangeCallback, setWishlistDirect } = useWishlist();
  const { items: cartItems, loadCart, clear: clearCart, setCartChangeCallback, setCartDirect } = useCart();
  const currentUserIdRef = useRef<string | null>(null);

  // INFO: Initialize local stores on app start
  useEffect(() => {
    const initializeStores = async () => {
      try {
        await Promise.all([loadWishlist(), loadCart()]);
      } catch (error) {
        console.error('Store initialization failed:', error);
      }
    };
    initializeStores();
  }, [loadWishlist, loadCart]);

  // INFO: Handle user authentication state changes
  useEffect(() => {
    const prevUserId = currentUserIdRef.current;
    const currentUserId = auth.user?.uid || null;

    if (prevUserId !== currentUserId) {
      if (prevUserId && !currentUserId) {
        // INFO: User logged out - sync final data and clear local stores
        handleUserLogout(prevUserId);
      } else if (!prevUserId && currentUserId) {
        // INFO: User logged in - load their data
        handleUserLogin(currentUserId);
      } else if (prevUserId && currentUserId && prevUserId !== currentUserId) {
        // INFO: Different user logged in - sync old user data, clear, load new user
        handleUserSwitch(prevUserId, currentUserId);
      }
    }

    currentUserIdRef.current = currentUserId;
  }, [auth.user]);

  // INFO: Set up real-time sync for authenticated users
  useEffect(() => {
    if (auth.user) {
      setupRealTimeSync(auth.user.uid);
    } else {
      clearSyncCallbacks();
    }
  }, [auth.user]);

  // INFO: Sync on app background for authenticated users
  useEffect(() => {
    if (!auth.user) return;

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background') {
        syncCurrentUserData(auth.user!.uid);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [auth.user]);

  // INFO: Handle user login - preserve server data, sync guest data only if server empty
  const handleUserLogin = async (userId: string) => {
    try {
      console.log(`Loading data for user: ${userId}`);
      
      const [serverWishlist, serverCart] = await Promise.all([
        fetchWishlist(userId),
        fetchCart(userId)
      ]);

      const hasServerData = serverWishlist.productIds.length > 0 || serverCart.items.length > 0;
      
      if (!hasServerData && (wishlistItems.length > 0 || cartItems.length > 0)) {
        // INFO: Server empty but has guest data - sync guest data up
        await syncCurrentUserData(userId);
        console.log('Guest data synced to new user account');
      } else if (hasServerData) {
        // INFO: Server has data - hydrate local stores from server BEFORE clearing any residual guest state
        const [wishlistProducts, cartHydrated] = await Promise.all([
          getProductsByIds(serverWishlist.productIds),
          reconstructCartItems(serverCart.items)
        ]);

        await setWishlistDirect(wishlistProducts);
        await setCartDirect({
          items: cartHydrated,
          totalItems: cartHydrated.reduce((sum, it) => sum + it.quantity, 0),
          totalPrice: cartHydrated.reduce((sum, it) => sum + it.product.price * it.quantity, 0),
        });

        console.log('Local stores hydrated from server; cart and wishlist restored');
      }
    } catch (error) {
      console.warn('User login data handling failed:', error);
    }
  };

  // INFO: Handle user logout - sync final data and clear stores
  const handleUserLogout = async (userId: string) => {
    try {
      console.log(`Syncing final data for user: ${userId}`);
      await syncCurrentUserData(userId);
      await clearLocalStores();
      console.log('User data synced and local stores cleared');
    } catch (error) {
      console.warn('User logout handling failed:', error);
    }
  };

  // INFO: Handle user switch - sync old user, clear, load new user
  const handleUserSwitch = async (oldUserId: string, newUserId: string) => {
    try {
      console.log(`Switching from user ${oldUserId} to ${newUserId}`);
      await syncCurrentUserData(oldUserId);
      await clearLocalStores();
      await handleUserLogin(newUserId);
      console.log('User switch completed');
    } catch (error) {
      console.warn('User switch failed:', error);
    }
  };

  // INFO: Sync current local data to specific user's server storage
  const syncCurrentUserData = async (userId: string) => {
    try {
      const cartItemsForSync = cartItems.map(ci => ({
        productId: ci.product.id,
        quantity: ci.quantity,
        variantKey: Object.entries(ci.selectedVariants)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${k}:${v}`)
          .join('|')
      }));

      await Promise.all([
        syncWishlist(userId, wishlistItems.map(p => p.id)),
        syncCart(userId, cartItemsForSync)
      ]);
    } catch (error) {
      console.warn('Current user data sync failed:', error);
    }
  };

  // INFO: Set up real-time sync callbacks for authenticated user
  const setupRealTimeSync = (userId: string) => {
    const syncWishlistCallback = (items: any[]) => {
      syncWishlist(userId, items.map(p => p.id)).catch(e => 
        console.warn('Real-time wishlist sync failed:', e)
      );
    };

    const syncCartCallback = (items: any[]) => {
      const cartItemsForSync = items.map(ci => ({
        productId: ci.product.id,
        quantity: ci.quantity,
        variantKey: Object.entries(ci.selectedVariants)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${k}:${v}`)
          .join('|')
      }));
      syncCart(userId, cartItemsForSync).catch(e => 
        console.warn('Real-time cart sync failed:', e)
      );
    };

    setWishlistChangeCallback(syncWishlistCallback);
    setCartChangeCallback(syncCartCallback);
  };

  // INFO: Clear sync callbacks when user logs out
  const clearSyncCallbacks = () => {
    setWishlistChangeCallback(() => {});
    setCartChangeCallback(() => {});
  };

  // INFO: Clear local cart and wishlist stores
  const clearLocalStores = async () => {
    try {
      await Promise.all([clearWishlist(), clearCart()]);
    } catch (error) {
      console.warn('Local store clearing failed:', error);
    }
  };

  // INFO: Provide auth state/actions via context
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// INFO: Hook to access AuthContext safely
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};