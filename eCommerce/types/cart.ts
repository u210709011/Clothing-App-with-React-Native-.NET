import { Product } from './product';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>; 
  dateAdded: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface AddToCartData {
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
}
