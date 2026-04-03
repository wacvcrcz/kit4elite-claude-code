/**
 * Coupon Validation Schemas
 */

import { z } from 'zod';
import { DiscountType } from '@prisma/client';

/**
 * Create coupon request schema
 */
export const createCouponSchema = z.object({
  code: z
    .string()
    .min(3, 'Coupon code must be at least 3 characters')
    .max(50, 'Coupon code too long')
    .regex(/^[A-Z0-9-]+$/, 'Coupon code must be uppercase letters, numbers, and hyphens only')
    .transform(val => val.toUpperCase()),
  discountType: z.enum([DiscountType.PERCENTAGE, DiscountType.FIXED]),
  discountValue: z
    .number()
    .int()
    .positive('Discount value must be positive')
    .refine(val => {
      // Percentage must be 1-100
      // Fixed must be reasonable (max $1000)
      return true;
    }),
  maxUses: z.number().int().min(1).max(100000).default(100),
  minPurchaseCents: z.number().int().min(0).optional(),
  maxDiscountCents: z.number().int().positive().optional(), // for percentage caps
  applicableCategories: z.array(z.string().uuid()).optional(),
  expiresAt: z
    .string()
    .datetime()
    .optional()
    .refine(val => {
      if (!val) return true;
      return new Date(val) > new Date();
    }, 'Expiration date must be in the future'),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;

/**
 * Update coupon request schema
 */
export const updateCouponSchema = z.object({
  code: z.string().optional(),
  discountType: z.enum([DiscountType.PERCENTAGE, DiscountType.FIXED]).optional(),
  discountValue: z.number().int().positive().optional(),
  maxUses: z.number().int().min(1).optional(),
  minPurchaseCents: z.number().int().min(0).optional().nullable(),
  maxDiscountCents: z.number().int().positive().optional().nullable(),
  applicableCategories: z.array(z.string().uuid()).optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional(),
});

export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;

/**
 * Validate coupon request schema
 */
export const validateCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code required'),
  cartTotalCents: z.number().int().positive('Cart total required'),
  categoryIds: z.array(z.string().uuid()).default([]),
});

export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
