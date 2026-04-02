/**
 * Product Validation Schemas
 */

import { z } from 'zod';
import { ProductType } from '@prisma/client';

/**
 * Product dimensions schema
 */
export const dimensionsSchema = z.object({
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
});

/**
 * Create product request schema
 */
export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  priceCents: z.number().positive().max(99999999),
  compareAtPriceCents: z.number().positive().optional(),
  type: z.enum([ProductType.DIGITAL, ProductType.PHYSICAL]),
  images: z.array(z.string().url()).max(10).default([]),
  stock: z.number().int().min(0).optional().nullable(),
  downloadUrl: z.string().optional().nullable(),
  fileSize: z.string().max(50).optional().nullable(),
  fileFormat: z.string().max(50).optional().nullable(),
  weightGrams: z.number().int().positive().optional().nullable(),
  dimensions: dimensionsSchema.optional().nullable(),
  categoryId: z.string().uuid(),
  isPublished: z.boolean().default(true),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

/**
 * Update product request schema (all optional)
 */
export const updateProductSchema = createProductSchema.partial();

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

/**
 * Product filters query schema
 */
export const productFiltersSchema = z.object({
  category: z.string().optional(),
  type: z.enum([ProductType.DIGITAL, ProductType.PHYSICAL]).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  sortBy: z.enum([
    'price_asc',
    'price_desc',
    'name_asc',
    'name_desc',
    'newest',
  ]).default('newest'),
});

export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;
