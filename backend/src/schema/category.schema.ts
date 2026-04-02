/**
 * Category Validation Schemas
 */

import { z } from 'zod';

/**
 * Create category request schema
 */
export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(1000).optional(),
  image: z.string().url().optional().nullable(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

/**
 * Update category request schema
 */
export const updateCategorySchema = createCategorySchema.partial();

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
