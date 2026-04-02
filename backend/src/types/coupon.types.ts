/**
 * Coupon Type Definitions
 */

import type { DiscountType } from '@prisma/client';

/**
 * Create coupon request
 */
export interface CreateCouponRequest {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxUses?: number;
  minPurchaseCents?: number;
  maxDiscountCents?: number;
  expiresAt?: string;
  applicableCategories?: string[];
}

/**
 * Update coupon request
 */
export interface UpdateCouponRequest {
  discountType?: DiscountType;
  discountValue?: number;
  maxUses?: number;
  minPurchaseCents?: number;
  maxDiscountCents?: number;
  expiresAt?: string;
  applicableCategories?: string[];
  isActive?: boolean;
}

/**
 * Validate coupon request
 */
export interface ValidateCouponRequest {
  code: string;
  cartTotalCents: number;
  categoryIds: string[];
}

/**
 * Validate coupon response
 */
export interface ValidateCouponResponse {
  success: true;
  data: {
    valid: boolean;
    discountCents: number;
    coupon?: {
      id: string;
      code: string;
      discountType: DiscountType;
      discountValue: number;
    };
    message?: string;
  };
}
