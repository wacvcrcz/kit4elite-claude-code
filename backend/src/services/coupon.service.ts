/**
 * Coupon Service
 * Business logic for coupons and discounts
 */

import { prisma } from '@/config/database';
import { NotFoundError, ConflictError, ValidationError } from '@/utils/errors';
import type { CreateCouponInput, UpdateCouponInput, ValidateCouponInput } from '@/types';
import type { Coupon, DiscountType } from '@prisma/client';

/**
 * Get all coupons with usage counts
 */
export async function getCoupons(): Promise<Coupon[]> {
  return prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });
}

/**
 * Get single coupon by ID
 */
export async function getCouponById(id: string): Promise<Coupon> {
  const coupon = await prisma.coupon.findUnique({
    where: { id },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });

  if (!coupon) {
    throw new NotFoundError('Coupon');
  }

  return coupon;
}

/**
 * Get coupon by code
 */
export async function getCouponByCode(code: string): Promise<Coupon | null> {
  return prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });
}

/**
 * Create new coupon
 */
export async function createCoupon(input: CreateCouponInput): Promise<Coupon> {
  // Check code is unique
  const existing = await prisma.coupon.findUnique({
    where: { code: input.code.toUpperCase() },
  });

  if (existing) {
    throw new ConflictError('Coupon code already exists');
  }

  // Validate percentage discount value
  if (input.discountType === DiscountType.PERCENTAGE && input.discountValue > 100) {
    throw new ValidationError('Percentage discount cannot exceed 100%');
  }

  return prisma.coupon.create({
    data: {
      code: input.code.toUpperCase(),
      discountType: input.discountType,
      discountValue: input.discountValue,
      maxUses: input.maxUses,
      minPurchaseCents: input.minPurchaseCents,
      maxDiscountCents: input.maxDiscountCents,
      applicableCategories: input.applicableCategories,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    },
  });
}

/**
 * Update coupon
 */
export async function updateCoupon(
  id: string,
  input: UpdateCouponInput
): Promise<Coupon> {
  const coupon = await prisma.coupon.findUnique({ where: { id } });

  if (!coupon) {
    throw new NotFoundError('Coupon');
  }

  // If code is changing, ensure it's unique
  if (input.code) {
    const codeUpper = input.code.toUpperCase();
    if (codeUpper !== coupon.code) {
      const existing = await prisma.coupon.findUnique({
        where: { code: codeUpper },
      });
      if (existing) {
        throw new ConflictError('Coupon code already exists');
      }
    }
  }

  // Validate percentage discount value
  if (
    input.discountType === DiscountType.PERCENTAGE &&
    input.discountValue &&
    input.discountValue > 100
  ) {
    throw new ValidationError('Percentage discount cannot exceed 100%');
  }

  return prisma.coupon.update({
    where: { id },
    data: {
      ...input,
      code: input.code?.toUpperCase(),
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
    },
  });
}

/**
 * Delete coupon
 */
export async function deleteCoupon(id: string): Promise<Coupon> {
  const coupon = await prisma.coupon.findUnique({ where: { id } });

  if (!coupon) {
    throw new NotFoundError('Coupon');
  }

  return prisma.coupon.delete({
    where: { id },
  });
}

/**
 * Validate coupon for cart
 * Returns discount amount in cents or throws validation error
 */
export async function validateCoupon(
  input: ValidateCouponInput
): Promise<{
  valid: boolean;
  discountCents: number;
  coupon?: Coupon;
  message?: string;
}> {
  const { code, cartTotalCents, categoryIds } = input;

  const coupon = await getCouponByCode(code);

  // Return invalid if coupon doesn't exist
  if (!coupon) {
    return {
      valid: false,
      discountCents: 0,
      message: 'Invalid coupon code',
    };
  }

  // Check if active
  if (!coupon.isActive) {
    return {
      valid: false,
      discountCents: 0,
      coupon,
      message: 'This coupon is not active',
    };
  }

  // Check expiration
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return {
      valid: false,
      discountCents: 0,
      coupon,
      message: 'This coupon has expired',
    };
  }

  // Check usage limit
  if (coupon.usedCount >= coupon.maxUses) {
    return {
      valid: false,
      discountCents: 0,
      coupon,
      message: 'This coupon has reached its usage limit',
    };
  }

  // Check minimum purchase
  if (coupon.minPurchaseCents && cartTotalCents < coupon.minPurchaseCents) {
    return {
      valid: false,
      discountCents: 0,
      coupon,
      message: `Minimum purchase of $${(coupon.minPurchaseCents / 100).toFixed(2)} required`,
    };
  }

  // Check applicable categories
  const applicableCategories = (coupon.applicableCategories as string[] | null) || [];
  if (applicableCategories.length > 0) {
    const hasValidCategory = categoryIds.some(id => applicableCategories.includes(id));
    if (!hasValidCategory) {
      return {
        valid: false,
        discountCents: 0,
        coupon,
        message: 'This coupon is not applicable to items in your cart',
      };
    }
  }

  // Calculate discount
  let discountCents = 0;
  if (coupon.discountType === DiscountType.PERCENTAGE) {
    discountCents = Math.round((cartTotalCents * coupon.discountValue) / 100);
    // Apply max discount cap if set
    if (coupon.maxDiscountCents && discountCents > coupon.maxDiscountCents) {
      discountCents = coupon.maxDiscountCents;
    }
  } else {
    // Fixed amount
    discountCents = coupon.discountValue;
    // Don't exceed cart total
    if (discountCents > cartTotalCents) {
      discountCents = cartTotalCents;
    }
  }

  return {
    valid: true,
    discountCents,
    coupon,
  };
}

/**
 * Increment coupon usage count
 */
export async function incrementCouponUsage(id: string): Promise<void> {
  await prisma.coupon.update({
    where: { id },
    data: {
      usedCount: {
        increment: 1,
      },
    },
  });
}
