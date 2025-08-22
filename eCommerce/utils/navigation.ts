import { router } from 'expo-router';


export const NavigationUtils = {
  goToProduct: (productId: string) => {
    router.push(`/product/${productId}`);
  },

  goToCategory: (categorySlug: string) => {
    router.push(`/category/${categorySlug}`);
  },

  goToProducts: (filter?: string) => {
    const url = filter ? `/products?filter=${filter}` : '/products';
    // TODO: Implement products listing screen
  },

  goToSizeGuide: () => {
    // TODO: Implement size guide modal
  },

  goToReviews: (productId: string) => {
    // TODO: Implement reviews screen
  },

  goToCheckout: () => {
    // TODO: Implement checkout flow
  },

  goToAuth: (screen: 'sign-in' | 'sign-up' = 'sign-in') => {
    router.push(`/(auth)/${screen}`);
  },

  goBack: () => {
    router.back();
  },

  goToSearch: () => {
    router.push('/search');
  },
};


export const ProductFilters = {
  NEWEST: 'newest',
  POPULAR: 'popular',
  TRENDING: 'trending',
  RECOMMENDED: 'recommended',
  FLASH_SALE: 'flash-sale',
} as const;
