/**
 * Product Store using Zustand
 * Manages product listing, categories, and search
 */

import { create } from 'zustand';
import { api } from '@/lib/api';
import type {
  Product,
  Category,
  ProductFilter,
  ProductListResponse,
  PaginationInfo,
} from '@/types';

/**
 * Product state
 */
interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  categories: Category[];
  currentProduct: Product | null;
  filter: ProductFilter;
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Product actions
 */
interface ProductActions {
  fetchProducts: (page?: number, filters?: ProductFilter) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  setFilter: (filter: Partial<ProductFilter>) => void;
  clearFilter: () => void;
  clearError: () => void;
}

/**
 * Combined product store type
 */
type ProductStore = ProductState & ProductActions;

/**
 * Default pagination
 */
const defaultPagination: PaginationInfo = {
  page: 1,
  perPage: 12,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

/**
 * Product Store
 */
export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  featuredProducts: [],
  categories: [],
  currentProduct: null,
  filter: {},
  pagination: defaultPagination,
  isLoading: false,
  error: null,

  /**
   * Fetch products with pagination and filters
   */
  fetchProducts: async (page = 1, filters = {}) => {
    set({ isLoading: true, error: null });

    try {
      const mergedFilters = { ...get().filter, ...filters };
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('perPage', '12');

      if (mergedFilters.category) {
        params.append('category', mergedFilters.category);
      }
      if (mergedFilters.type) {
        params.append('type', mergedFilters.type);
      }
      if (mergedFilters.minPrice !== undefined) {
        params.append('minPrice', mergedFilters.minPrice.toString());
      }
      if (mergedFilters.maxPrice !== undefined) {
        params.append('maxPrice', mergedFilters.maxPrice.toString());
      }
      if (mergedFilters.sortBy) {
        params.append('sortBy', mergedFilters.sortBy);
      }
      if (mergedFilters.search) {
        params.append('search', mergedFilters.search);
      }

      const response = await api.get<ProductListResponse>(
        `/products?${params.toString()}`
      );

      set({
        products: response.products,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch products';
      set({ error: message, isLoading: false });
    }
  },

  /**
   * Fetch featured products
   */
  fetchFeaturedProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const products = await api.get<Product[]>('/products/featured');
      set({ featuredProducts: products, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch featured products';
      set({ error: message, isLoading: false });
    }
  },

  /**
   * Fetch all categories
   */
  fetchCategories: async () => {
    set({ isLoading: true, error: null });

    try {
      const categories = await api.get<Category[]>('/categories');
      set({ categories, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch categories';
      set({ error: message, isLoading: false });
    }
  },

  /**
   * Fetch product by slug
   */
  fetchProductBySlug: async (slug: string) => {
    set({ isLoading: true, error: null, currentProduct: null });

    try {
      const product = await api.get<Product>(`/products/slug/${slug}`);
      set({ currentProduct: product, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch product';
      set({ error: message, isLoading: false });
    }
  },

  /**
   * Fetch product by ID
   */
  fetchProductById: async (id: string) => {
    set({ isLoading: true, error: null, currentProduct: null });

    try {
      const product = await api.get<Product>(`/products/${id}`);
      set({ currentProduct: product, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch product';
      set({ error: message, isLoading: false });
    }
  },

  /**
   * Update filter
   */
  setFilter: (filter) => {
    set({ filter: { ...get().filter, ...filter } });
  },

  /**
   * Clear all filters
   */
  clearFilter: () => {
    set({ filter: {} });
  },

  /**
   * Clear error state
   */
  clearError: () => set({ error: null }),
}));

/**
 * Hook for filtered products
 */
export function useFilteredProducts(): Product[] {
  return useProductStore((state) => {
    let products = [...state.products];

    // Apply client-side filtering
    if (state.filter.search) {
      const search = state.filter.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      );
    }

    return products;
  });
}

/**
 * Hook for active filters count
 */
export function useActiveFiltersCount(): number {
  return useProductStore((state) => {
    const { filter } = state;
    let count = 0;
    if (filter.category) count++;
    if (filter.type) count++;
    if (filter.minPrice !== undefined) count++;
    if (filter.maxPrice !== undefined) count++;
    return count;
  });
}
