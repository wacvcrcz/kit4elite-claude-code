/**
 * Category Controller
 * HTTP request handlers for categories
 */

import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import * as categoryService from '@/services/category.service';
import {
  createCategorySchema,
  updateCategorySchema,
} from '@/schema/category.schema';
import { ValidationError } from '@/utils/errors';

/**
 * GET /api/categories
 * List all categories
 */
export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.getCategories();

  res.json({
    success: true,
    data: categories,
  });
});

/**
 * GET /api/categories/:slug
 * Get single category by slug
 */
export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const category = await categoryService.getCategoryBySlug(slug);

  res.json({
    success: true,
    data: category,
  });
});

/**
 * POST /api/categories
 * Create new category (admin)
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const result = createCategorySchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError(result.error.errors[0].message);
  }

  const category = await categoryService.createCategory(result.data);

  res.status(201).json({
    success: true,
    data: category,
  });
});

/**
 * PATCH /api/categories/:id
 * Update category (admin)
 */
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = updateCategorySchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError(result.error.errors[0].message);
  }

  const category = await categoryService.updateCategory(id, result.data);

  res.json({
    success: true,
    data: category,
  });
});

/**
 * DELETE /api/categories/:id
 * Delete category (admin)
 * Only if no products attached
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await categoryService.deleteCategory(id);

  res.json({
    success: true,
    data: { message: 'Category deleted' },
  });
});
