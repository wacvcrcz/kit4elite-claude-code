/**
 * Category Service
 * Business logic for categories
 */

import { prisma } from '@/config/database';
import { NotFoundError, ConflictError } from '@/utils/errors';
import type { CreateCategoryInput, UpdateCategoryInput } from '@/types';
import type { Category } from '@prisma/client';

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          products: {
            where: {
              isPublished: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Get single category by slug
 */
export async function getCategoryBySlug(
  slug: string
): Promise<Category & { _count: { products: number } }> {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          products: {
            where: {
              isPublished: true,
            },
          },
        },
      },
    },
  });

  if (!category) {
    throw new NotFoundError('Category');
  }

  return category;
}

/**
 * Create category
 */
export async function createCategory(
  input: CreateCategoryInput
): Promise<Category> {
  // Check slug is unique
  const existing = await prisma.category.findUnique({
    where: { slug: input.slug },
  });

  if (existing) {
    throw new ConflictError('Category with this slug already exists');
  }

  return prisma.category.create({
    data: input,
  });
}

/**
 * Update category
 */
export async function updateCategory(
  id: string,
  input: UpdateCategoryInput
): Promise<Category> {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new NotFoundError('Category');
  }

  // If slug is changing, ensure it's unique
  if (input.slug && input.slug !== category.slug) {
    const existing = await prisma.category.findUnique({
      where: { slug: input.slug },
    });
    if (existing) {
      throw new ConflictError('Category with this slug already exists');
    }
  }

  return prisma.category.update({
    where: { id },
    data: input,
  });
}

/**
 * Delete category
 * Only if no products are attached
 */
export async function deleteCategory(id: string): Promise<Category> {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  if (!category) {
    throw new NotFoundError('Category');
  }

  if (category._count.products > 0) {
    throw new ConflictError(
      'Cannot delete category with attached products'
    );
  }

  return prisma.category.delete({ where: { id } });
}
