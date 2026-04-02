/**
 * Product Service
 * Business logic for products
 */

import { prisma } from '@/config/database';
import { NotFoundError } from '@/utils/errors';
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductFiltersInput,
} from '@/types';
import type { Prisma, Product } from '@prisma/client';

/**
 * Get products with filters and pagination
 */
export async function getProducts(
  filters: ProductFiltersInput
): Promise<{ products: Product[]; total: number; totalPages: number }> {
  const {
    category,
    type,
    minPrice,
    maxPrice,
    search,
    page,
    limit,
    sortBy,
  } = filters;

  // Build where clause
  const where: Prisma.ProductWhereInput = {
    isPublished: true,
  };

  if (category) {
    where.category = { slug: category };
  }

  if (type) {
    where.type = type;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.priceCents = {};
    if (minPrice !== undefined) where.priceCents.gte = minPrice;
    if (maxPrice !== undefined) where.priceCents.lte = maxPrice;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Build orderBy
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
  switch (sortBy) {
    case 'price_asc':
      orderBy = { priceCents: 'asc' };
      break;
    case 'price_desc':
      orderBy = { priceCents: 'desc' };
      break;
    case 'name_asc':
      orderBy = { name: 'asc' };
      break;
    case 'name_desc':
      orderBy = { name: 'desc' };
      break;
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' };
  }

  // Get total count
  const total = await prisma.product.count({ where });
  const totalPages = Math.ceil(total / limit);

  // Get products
  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return { products, total, totalPages };
}

/**
 * Get single product by slug
 */
export async function getProductBySlug(
  slug: string
): Promise<Product & { category: { id: string; name: string; slug: string } }> {
  const product = await prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!product) {
    throw new NotFoundError('Product');
  }

  return product;
}

/**
 * Create product
 */
export async function createProduct(
  input: CreateProductInput
): Promise<Product> {
  // Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: input.categoryId },
  });

  if (!category) {
    throw new NotFoundError('Category');
  }

  // Check slug is unique
  const existing = await prisma.product.findUnique({
    where: { slug: input.slug },
  });

  if (existing) {
    throw new Error('Product with this slug already exists');
  }

  const product = await prisma.product.create({
    data: input,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return product;
}

/**
 * Update product
 */
export async function updateProduct(
  id: string,
  input: UpdateProductInput
): Promise<Product> {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new NotFoundError('Product');
  }

  // If slug is changing, ensure it's unique
  if (input.slug && input.slug !== product.slug) {
    const existing = await prisma.product.findUnique({
      where: { slug: input.slug },
    });
    if (existing) {
      throw new Error('Product with this slug already exists');
    }
  }

  return prisma.product.update({
    where: { id },
    data: input,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}

/**
 * Soft delete product (set isPublished = false)
 */
export async function deleteProduct(id: string): Promise<Product> {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new NotFoundError('Product');
  }

  return prisma.product.update({
    where: { id },
    data: { isPublished: false },
  });
}

/**
 * Get all products (admin)
 */
export async function getAllProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}
