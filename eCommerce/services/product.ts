import { Product, Category } from '@/types/product';

import { apiGet, apiDelete, apiPost, apiPut } from './api';
import { USE_MOCKS } from '@/config/environment';
import { getMockCategories } from './mockData';

import { loadItem, saveItem } from '@/utils/storage';

type FlashSaleDto = {
  isActive: boolean;
  endTime: string; 
  perProductDiscountPercent: Record<string, number>;
  title: string;
  description: string;
};

function applyFlashSaleToProduct(product: Product, sale: FlashSaleDto | null | undefined): Product {
  if (!sale?.isActive) return product;
  const percent = sale.perProductDiscountPercent?.[product.slug];
  if (!percent || percent <= 0) return product;

  const originalPrice = product.originalPrice ?? product.price;
  const discounted = Number((originalPrice * (1 - percent / 100)).toFixed(2));
  return {
    ...product,
    isFlashSale: true,
    discount: percent,
    originalPrice,
    price: discounted,
  };
}

function applyFlashSaleToProducts(products: Product[], sale: FlashSaleDto | null | undefined): Product[] {
  if (!sale?.isActive) return products;
  return products.map(p => applyFlashSaleToProduct(p, sale));
}

export interface ProductFilters {
  category?: string;
  subcategories?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  tags?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'name' | 'rating' | 'newest';
}

type ProductListItemDto = {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string | null;
  price: number;
  originalPrice?: number | null;
  discountPercent?: number | null;
  isFlashSale: boolean;
  rating: number;
  imageUrl?: string | null;
  reviewCount: number;
};

type PagedResponse<T> = { items: T[]; page: number; pageSize: number; total: number };

function mapListItem(p: ProductListItemDto): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: '',
    category: { id: '', name: p.category, slug: p.category.toLowerCase().replace(/\s+/g, '-'), imageUrl: undefined },
    subcategory: p.subcategory ? { id: '', name: p.subcategory, slug: p.subcategory.toLowerCase().replace(/\s+/g, '-'), imageUrl: undefined } : undefined,
    price: Number(p.price),
    originalPrice: p.originalPrice !== null && p.originalPrice !== undefined ? Number(p.originalPrice) : undefined,
    discount: p.discountPercent ?? undefined,
    isFlashSale: p.isFlashSale,
    images: p.imageUrl ? [p.imageUrl] : [],
    variants: [],
    options: [],
    reviews: [],
    rating: Number(p.rating),
    reviewCount: typeof p.reviewCount === 'number' ? p.reviewCount : undefined,
  };
}

  // INFO: Fetch products with server paging
export const getProductsPaged = async (
  filters: ProductFilters | undefined,
  page: number,
  pageSize: number
): Promise<{ items: Product[]; page: number; pageSize: number; total: number }> => { // INFO: Return mapped items and paging meta
  const params: Record<string, string | number | boolean | undefined> = {
    category: filters?.category,
    subcategory: filters?.subcategories?.[0],
    search: filters?.search,
    minPrice: filters?.minPrice,
    maxPrice: filters?.maxPrice,
    sort: filters?.sortBy,
    page,
    pageSize,
  };
  const [data, sale] = await Promise.all([
    apiGet<PagedResponse<ProductListItemDto>>('/products', params),
    getFlashSale().catch(() => null),
  ]);
  const mapped = data.items.map(mapListItem);
  const annotated = applyFlashSaleToProducts(mapped, sale);
  return { items: annotated, page: data.page, pageSize: data.pageSize, total: data.total };
};


export const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {

  // INFO: Mock for offline
  if (USE_MOCKS) {
    const cats = getMockCategories();
    const demo: Product[] = cats.slice(0, 8).map((c, idx) => ({
      id: String(idx + 1),
      slug: `${c.slug}-demo-${idx + 1}`,
      name: `${c.title} Item ${idx + 1}`,
      description: 'Demo product (offline mode)'.trim(),
      category: { id: c.id, name: c.title, slug: c.slug, imageUrl: c.imageUrls?.[0] },
      price: 19.99 + idx,
      originalPrice: 29.99 + idx,
      discount: 20,
      isFlashSale: idx % 3 === 0,
      images: [c.imageUrls?.[0] || 'https://via.placeholder.com/400x500'],
      variants: [],
      options: [],
      reviews: [],
      rating: 4.2,
    }));
    return demo;
  }
  const paged = await getProductsPaged(filters, 1, 100);
  return paged.items;
};

// INFO: Get full product detail and map to Product
export const getProductById = async (id: string): Promise<Product | undefined> => {
  if (USE_MOCKS) {
    const cats = getMockCategories();
    const c = cats[0];
    return {
      id,
      slug: `demo-${id}`,
      name: `Demo Product ${id}`,
      description: 'Demo detail (offline mode)'.trim(),
      category: { id: c.id, name: c.title, slug: c.slug, imageUrl: c.imageUrls?.[0] },
      price: 49.99,
      originalPrice: 59.99,
      discount: 15,
      isFlashSale: true,
      images: c.imageUrls?.slice(0, 3) || [],
      variants: [ { id: 'size', name: 'Size', values: ['S','M','L'] } ],
      options: [ { id: 'material', name: 'Material', value: 'Cotton' } ],
      reviews: [ { id: 'r1', author: 'Offline User', rating: 5, comment: 'offline product', date: '2024-01-01' } ],
      rating: 4.6,
    };
  }
  type CategoryDto = { id: string; name: string; slug: string; imageUrl?: string | null; subtitle?: string | null };
  type ProductDetailDto = {
    id: string;
    name: string;
    slug: string;
    category: CategoryDto;
    subcategory?: CategoryDto | null;
    price: number;
    originalPrice?: number | null;
    discountPercent?: number | null;
    isFlashSale: boolean;
    rating: number;
    description: string;
    imageUrl?: string | null;
    images?: string[];
    variants: { id: string; name: string; values: string[] }[];
    options: { id: string; name: string; value: string }[];
    reviews: { id: string; author: string; rating: number; comment: string; date: string }[];
  };


  // INFO: Fetch product detail and flash sale
  const [p, sale] = await Promise.all([
    apiGet<ProductDetailDto>(`/products/${id}`),
    getFlashSale().catch(() => null),
  ]);

  // INFO: Return undefined if not found
  if (!p) return undefined;
  const base: Product = {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    category: { id: p.category.id, name: p.category.name, slug: p.category.slug, imageUrl: p.category.imageUrl ?? undefined },
    subcategory: p.subcategory ? { id: p.subcategory.id, name: p.subcategory.name, slug: p.subcategory.slug, imageUrl: p.subcategory.imageUrl ?? undefined } : undefined,
    price: Number(p.price),
    originalPrice: p.originalPrice !== null && p.originalPrice !== undefined ? Number(p.originalPrice) : undefined,
    discount: p.discountPercent ?? undefined,
    isFlashSale: p.isFlashSale,
    images: p.images && p.images.length > 0 ? p.images : (p.imageUrl ? [p.imageUrl] : []),
    variants: p.variants,
    options: p.options,
    reviews: p.reviews,
    rating: Number(p.rating),
  };
  return applyFlashSaleToProduct(base, sale);
};

export const getProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
  return getProducts({ category: categorySlug });
};

export const getCategories = async (): Promise<Category[]> => {
  if (USE_MOCKS) {
    const cats = getMockCategories();
    return cats.map(c => ({ id: c.id, name: c.title, slug: c.slug, imageUrl: c.imageUrls?.[0] }));
  }
  type CategoryDto = { id: string; name: string; slug: string; imageUrl?: string | null };
  const CACHE_KEY = 'categoriesCacheV1';

  // REMEMBER: 6 HOURS CACHE
  const CACHE_TTL_MS = 1000 * 60 * 60 * 6;

  try {
    const data = await apiGet<CategoryDto[]>('/categories');
    const mapped = data.map(c => ({ id: c.id, name: c.name, slug: c.slug, imageUrl: c.imageUrl ?? undefined }));
    await saveItem(CACHE_KEY, { timestamp: Date.now(), data: mapped });
    return mapped;
  } catch (err) {
    const cached = await loadItem(CACHE_KEY);
    if (cached && Array.isArray(cached.data)) {
      const isFresh = typeof cached.timestamp === 'number' && (Date.now() - cached.timestamp) < CACHE_TTL_MS;
      return cached.data as Category[];
    }
    throw err;
  }
};

// INFO: Fetch category
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  type CategoryDto = { id: string; name: string; slug: string; imageUrl?: string | null };
  try {
    const c = await apiGet<CategoryDto>(`/categories/${slug}`);
    if (!c) return null;
    return { id: c.id, name: c.name, slug: c.slug, imageUrl: c.imageUrl ?? undefined };
  } catch {
    return null;
  }
};

export const getSubcategories = async (slug: string): Promise<Category[]> => {
  type CategoryDto = { id: string; name: string; slug: string; imageUrl?: string | null };
  try {
    const data = await apiGet<CategoryDto[]>(`/categories/${slug}/subcategories`);
    return data.map(c => ({ id: c.id, name: c.name, slug: c.slug, imageUrl: c.imageUrl ?? undefined }));
  } catch {
    return [];
  }
};

export const createCategory = async (
  payload: { name: string; slug: string; imageUrl?: string | null; subtitle?: string | null; },
  parentCategoryId?: string | null
) => {
  type CreateCategoryRequest = { name: string; slug: string; parentCategoryId?: string | null; imageUrl?: string | null; subtitle?: string | null };
  const body: CreateCategoryRequest = { name: payload.name, slug: payload.slug, imageUrl: payload.imageUrl, subtitle: payload.subtitle, parentCategoryId };
  return apiPost<{ id: string }>(`/categories`, body);
};

export const updateCategory = async (slug: string, payload: { name: string; slug: string; imageUrl?: string | null; subtitle?: string | null; }) => {
  type CreateCategoryRequest = { name: string; slug: string; parentCategoryId?: string | null; imageUrl?: string | null; subtitle?: string | null };
  const body: CreateCategoryRequest = { name: payload.name, slug: payload.slug, imageUrl: payload.imageUrl, subtitle: payload.subtitle };
  return apiPut<void>(`/categories/${slug}`, body);
};

export const deleteCategory = async (slug: string) => {
  return apiDelete<void>(`/categories/${slug}`);
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  return getProducts({ search: query });
};

// INFO: Get flash sale meta from backend
export const getFlashSale = async (): Promise<FlashSaleDto> => {
  if (USE_MOCKS) {
    return {
      isActive: true,
      endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // TODO: Do it on backend
      perProductDiscountPercent: {},
      title: 'Flash Sale - Limited Time!',
      description: 'Up to 30% off selected items',
    };
  }
  return apiGet<FlashSaleDto>('/flash-sale');
};

// INFO: Get flash sale products
export const getFlashSaleProducts = async (): Promise<{ title: string; endTime: string | null; products: Product[] }> => {
  const [sale, all] = await Promise.all([getFlashSale(), getProducts({ sortBy: 'newest' })]);
  if (!sale?.isActive) return { title: 'Flash Sale', endTime: null, products: [] };
  const discounts = sale.perProductDiscountPercent || {};
  const bySlug: Record<string, Product> = {};
  all.forEach(p => { bySlug[p.slug] = p; });
  const selected: Product[] = Object.keys(discounts)
    .map(slug => bySlug[slug])
    .filter(Boolean)
    .map(p => applyFlashSaleToProduct(p, sale));
  return { title: sale.title || 'Flash Sale', endTime: sale.endTime || null, products: selected };
};

export const ProductAPI = {
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    return getProducts(filters);
  },
  
  getProductById: async (id: string): Promise<Product | undefined> => {
    return getProductById(id);
  },
  
  getCategories: async (): Promise<Category[]> => {
    return getCategories();
  },
  
  getProductsByCategory: async (categorySlug: string): Promise<Product[]> => {
    return getProductsByCategory(categorySlug);
  },
  
  searchProducts: async (query: string): Promise<Product[]> => {
    return searchProducts(query);
  },
  getFlashSale: async () => getFlashSale(),
  getFlashSaleProducts: async () => getFlashSaleProducts(),
  deleteProduct: async (id: string) => apiDelete<void>(`/products/${id}`),
  
};
