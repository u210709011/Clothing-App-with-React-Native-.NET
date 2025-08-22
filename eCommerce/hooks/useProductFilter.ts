import { useState, useEffect, useMemo } from 'react';

import { Product } from '@/types/product';

export interface FilterState {
  categories: string[];
  subcategories: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  sortBy: string;
  searchQuery: string;
  preSelectedCategory?: string;
}

export interface FilterLabels {
  label: string;
  type: 'category' | 'subcategory' | 'size' | 'color' | 'price' | 'sort';
  value: any;
}

const DEFAULT_FILTER_STATE: FilterState = {
  categories: [],
  subcategories: [],
  sizes: [],
  colors: [],
  priceRange: [0, 500],
  sortBy: 'popular',
  searchQuery: '',
};


/**
 * Custom hook for product filtering
 * Handles product filtering and sorting
 */

export const useProductFilter = (products: Product[], initialCategory?: string) => {
  const [filterState, setFilterState] = useState<FilterState>(() => ({
    ...DEFAULT_FILTER_STATE,
    categories: initialCategory ? [initialCategory] : [],
    preSelectedCategory: initialCategory,
  }));

  const [activeFilters, setActiveFilters] = useState<FilterLabels[]>([]);

  const generateFilterLabels = useMemo(() => {
    const labels: FilterLabels[] = [];
    
    filterState.categories.forEach(category => {
      if (category !== filterState.preSelectedCategory) {
        labels.push({
          label: `Category: ${category}`,
          type: 'category',
          value: category
        });
      }
    });

    filterState.subcategories.forEach(subcategory => {
      labels.push({
        label: `${subcategory}`,
        type: 'subcategory',
        value: subcategory
      });
    });

    if (filterState.sizes.length > 0) {
      if (filterState.sizes.length === 1) {
        labels.push({
          label: `Size: ${filterState.sizes[0]}`,
          type: 'size',
          value: filterState.sizes[0]
        });
      } else {
        labels.push({
          label: `${filterState.sizes.length} Sizes`,
          type: 'size',
          value: filterState.sizes
        });
      }
    }

    if (filterState.colors.length > 0) {
      if (filterState.colors.length === 1) {
        labels.push({
          label: `Color: ${filterState.colors[0]}`,
          type: 'color',
          value: filterState.colors[0]
        });
      } else {
        labels.push({
          label: `${filterState.colors.length} Colors`,
          type: 'color',
          value: filterState.colors
        });
      }
    }

    if (filterState.priceRange[0] !== 0 || filterState.priceRange[1] !== 500) {
      labels.push({
        label: `$${filterState.priceRange[0]} - $${filterState.priceRange[1]}`,
        type: 'price',
        value: filterState.priceRange
      });
    }

    return labels;
  }, [filterState]);

  useEffect(() => {
    setActiveFilters(generateFilterLabels);
  }, [generateFilterLabels]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // INFO: Free text search
    if (filterState.searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filterState.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(filterState.searchQuery.toLowerCase())
      );
    }

    // INFO: Filter by category
    if (filterState.categories.length > 0) {
      filtered = filtered.filter(product =>
        filterState.categories.some(category => 
          product.category.slug === category || 
          product.category.name.toLowerCase() === category.toLowerCase()
        )
      );
    }

    // INFO: Filter by subcategories
    if (filterState.subcategories.length > 0) {
      filtered = filtered.filter(product =>
        product.subcategory && filterState.subcategories.some(subcategory => 
          product.subcategory!.slug === subcategory || 
          product.subcategory!.name.toLowerCase() === subcategory.toLowerCase()
        )
      );
    }

    // INFO: Filter by sizes
    if (filterState.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.variants.some(variant =>
          variant.name.toLowerCase() === 'size' &&
          variant.values.some(value => 
            filterState.sizes.includes(value)
          )
        )
      );
    }

    // INFO: Filter by colors
    if (filterState.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.variants.some(variant =>
          variant.name.toLowerCase() === 'color' &&
          variant.values.some(value => 
            filterState.colors.some(color => 
              value.toLowerCase().includes(color.toLowerCase())
            )
          )
        )
      );
    }

    // INFO: Filter by price range
    filtered = filtered.filter(product =>
      product.price >= filterState.priceRange[0] &&
      product.price <= filterState.priceRange[1]
    );

      // INFO: Apply sorting
    switch (filterState.sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.reverse();
        break;
      case 'popular':
      default:
        break;
    }

    return filtered;
  }, [products, filterState]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilters }));
  };

  // INFO: Remove a single filter by label
  const removeFilter = (filterToRemove: FilterLabels) => {
    switch (filterToRemove.type) {
      case 'category':
        setFilterState(prev => ({
          ...prev,
          categories: prev.categories.filter(cat => cat !== filterToRemove.value)
        }));
        break;
      case 'subcategory':
        setFilterState(prev => ({
          ...prev,
          subcategories: prev.subcategories.filter(sub => sub !== filterToRemove.value)
        }));
        break;
      case 'size':
        if (Array.isArray(filterToRemove.value)) {
          setFilterState(prev => ({ ...prev, sizes: [] }));
        } else {
          setFilterState(prev => ({
            ...prev,
            sizes: prev.sizes.filter(size => size !== filterToRemove.value)
          }));
        }
        break;
      case 'color':
        if (Array.isArray(filterToRemove.value)) {
          setFilterState(prev => ({ ...prev, colors: [] }));
        } else {
          setFilterState(prev => ({
            ...prev,
            colors: prev.colors.filter(color => color !== filterToRemove.value)
          }));
        }
        break;
      case 'price':
        setFilterState(prev => ({ ...prev, priceRange: [0, 500] }));
        break;
    }
  };

  // INFO: Reset all filters (excluding pre-selected category in category details and search query)
  const clearAllFilters = () => {
    setFilterState(prev => ({
      ...DEFAULT_FILTER_STATE,
      preSelectedCategory: prev.preSelectedCategory,
      categories: prev.preSelectedCategory ? [prev.preSelectedCategory] : [],
      searchQuery: prev.searchQuery,
    }));
  };

  // INFO: Update the search query string
  const setSearchQuery = (query: string) => {
    setFilterState(prev => ({ ...prev, searchQuery: query }));
  };

  return {
    filterState,
    activeFilters,
    filteredProducts,
    updateFilters,
    removeFilter,
    clearAllFilters,
    setSearchQuery,
  };
};