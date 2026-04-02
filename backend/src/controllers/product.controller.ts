/**
 * Product Controller
 * HTTP request handlers for products
 */

import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import * as productService from '@/services/product.service';
import { getUploadUrl, generateProductFileKey } from '@/lib/s3';
import {
  createProductSchema,
  updateProductSchema,
  productFiltersSchema,
} from '@/schema/product.schema';
import { ValidationError, NotFoundError } from '@/utils/errors';

/**
 * GET /api/products
 * List products with filters
 */
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = productFiltersSchema.safeParse(req.query);
  if (!result.success) {
    throw new ValidationError(result.error.errors[0].message);
  }

  const {
    category,
    type,
    minPrice,
    maxPrice,
    search,
    page,
    limit,
    sortBy,
  } = result.data;

  const { products, total, totalPages } = await productService.getProducts({
    category,
    type,
    minPrice,
    maxPrice,
    search,
    page,
    limit,
    sortBy,
  });

  res.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

/**
 * GET /api/products/:slug
 * Get single product by slug
 */
export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = await productService.getProductBySlug(slug);

  res.json({
    success: true,
    data: product,
  });
});

/**
 * POST /api/products
 * Create new product (admin)
 */
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = createProductSchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError(result.error.errors[0].message);
  }

  const product = await productService.createProduct(result.data);

  res.status(201).json({
    success: true,
    data: product,
  });
});

/**
 * PATCH /api/products/:id
 * Update product (admin)
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = updateProductSchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError(result.error.errors[0].message);
  }

  const product = await productService.updateProduct(id, result.data);

  res.json({
    success: true,
    data: product,
  });
});

/**
 * DELETE /api/products/:id
 * Soft delete product (admin)
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await productService.deleteProduct(id);

  res.json({
    success: true,
    data: { message: 'Product deleted' },
  });
});

/**
 * POST /api/products/:id/upload
 * Generate S3 presigned upload URL (admin)
 */
export const getUploadUrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { filename, contentType = 'application/octet-stream' } = req.body;

  if (!filename) {
    throw new ValidationError('filename required');
  }

  // Verify product exists
  await productService.getAllProducts().then(products => {
    if (!products.find(p => p.id === id)) {
      throw new NotFoundError('Product');
    }
  });

  const key = generateProductFileKey(id, filename);
  const uploadUrl = await getUploadUrl(key, contentType);

  res.json({
    success: true,
    data: {
      uploadUrl,
      key,
    },
  });
});

/**
 * GET /api/admin/products
 * Get all products for admin (including unpublished)
 */
export const getAllProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await productService.getAllProducts();

  res.json({
    success: true,
    data: products,
  });
});
