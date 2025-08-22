import { apiGet, apiPut } from '@/services/api';
import { getProductById } from '@/services/product';
import { Product } from '@/types/product';
import { CartItem } from '@/types/cart';

export type WishlistResponse = { productIds: string[] };
export type CartItemWire = { productId: string; quantity: number; variantKey: string };
export type CartResponse = { items: CartItemWire[] };

// INFO: Fetch wishlist for a user
export async function fetchWishlist(userId: string): Promise<WishlistResponse> {
  const res = await apiGet<{ productIds: string[] }>(`/users/${userId}/wishlist`);
  return res;
}

// INFO: Replace wishlist for a user
export async function syncWishlist(userId: string, productIds: string[]): Promise<void> {
  await apiPut<void>(`/users/${userId}/wishlist`, { productIds });
}

// INFO: Fetch cart for a user
export async function fetchCart(userId: string): Promise<CartResponse> {
  const res = await apiGet<{ items: CartItemWire[] }>(`/users/${userId}/cart`);
  return res;
}

// INFO: Replace cart for a user
export async function syncCart(userId: string, items: CartItemWire[]): Promise<void> {
  await apiPut<void>(`/users/${userId}/cart`, { items });
}

// INFO: Get products by id for wishlist
export async function getProductsByIds(productIds: string[]): Promise<Product[]> {
  const results: Product[] = [];
  for (const id of productIds) {
    try {
      const p = await getProductById(id);
      if (p) results.push(p);
    } catch (_) {
      
    }
  }
  return results;
}

// INFO: Reconstruct cart items from server data
export async function reconstructCartItems(serverCartItems: CartItemWire[]): Promise<CartItem[]> {
  const items: CartItem[] = [];
  for (const it of serverCartItems) {
    try {
      const product = await getProductById(it.productId);
      if (!product) continue;

      const selectedVariants: Record<string, string> = {};
      if (it.variantKey) {
        for (const kv of it.variantKey.split('|')) {
          const [k, v] = kv.split(':');
          if (k && v) selectedVariants[k] = v;
        }
      }

      items.push({
        id: `${product.id}_${it.variantKey || ''}`,
        product,
        quantity: it.quantity,
        selectedVariants,
        dateAdded: new Date().toISOString(),
      });
    } catch (_) {
    }
  }
  return items;
}


