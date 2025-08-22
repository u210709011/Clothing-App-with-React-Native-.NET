export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  subcategory?: Category;
  price: number;
  originalPrice?: number;
  discount?: number;
  isFlashSale?: boolean;
  images?: string[] | '';
  variants: ProductVariant[];
  options: ProductOption[];
  reviews: Review[];
  rating: number;
  reviewCount?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  values: string[];
}

export interface ProductOption {
  id: string;
  name: string;
  value: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}
