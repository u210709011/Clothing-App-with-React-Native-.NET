import { Product } from '@/types/product';

export interface ProductSection {
  sectionKey: string;
  title: string;
  products: Product[];
}

export function createProductSections(products: Product[]): ProductSection[] {
  if (!products || products.length === 0) {
    return [];
  }

  const sections: ProductSection[] = [];

  // New Arrivals section (first 6 products)
  const newArrivals = products.slice(0, 6);
  if (newArrivals.length > 0) {
    sections.push({
      sectionKey: 'new-arrivals',
      title: 'New Arrivals',
      products: newArrivals,
    });
  }

  // Popular section (next 6 products)
  const popular = products.slice(6, 12);
  if (popular.length > 0) {
    sections.push({
      sectionKey: 'popular',
      title: 'Popular',
      products: popular,
    });
  }

  // Trending section (next 6 products)
  const trending = products.slice(12, 18);
  if (trending.length > 0) {
    sections.push({
      sectionKey: 'trending',
      title: 'Trending',
      products: trending,
    });
  }

  return sections;
}
