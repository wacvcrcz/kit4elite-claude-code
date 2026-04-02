/**
 * Product Type Definitions
 */

import type { ProductType } from '@prisma/client';

/**
 * Product dimensions for physical products
 */
export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
}

/**
 * Create product request
 */
export interface CreateProductRequest {
  name: string;
  slug: string;
  description?: string;
  priceCents: number;
  compareAtPriceCents?: number;
  type: ProductType;
  images: string[];
  stock?: number;
  downloadUrl?: string;
  fileSize?: string;
  fileFormat?: string;
  weightGrams?: number;
  dimensions?: ProductDimensions;
  categoryId: string;
  isPublished?: boolean;
}

/**
 * Update product request
 */
export interface UpdateProductRequest {
  name?: string;
  slug?: string;
  description?: string;
  priceCents?: number;
  compareAtPriceCents?: number;
  type?: ProductType;
  images?: string[];
  stock?: number;
  downloadUrl?: string;
  fileSize?: string;
  fileFormat?: string;
  weightGrams?: number;
  dimensions?: ProductDimensions;
  categoryId?: string;
  isPublished?: boolean;
}

/**
 * Product filters for listing
 */
export interface ProductFilters {
  category?: string;
  type?: ProductType;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isPublished?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * S3 upload URL response
 */
export interface UploadUrlResponse {
  success: true;
  data: {
    uploadUrl: string;
    key: string;
  };
}
