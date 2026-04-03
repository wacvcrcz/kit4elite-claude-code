/**
 * Coupon Controller
 * HTTP request handlers for coupons
 */

import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import * as couponService from '@/services/coupon.service';
import {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
} from '@/schema/coupon.schema';
import { ValidationError } from '@/utils/errors';

/**
 * GET /api/coupons
 * List all coupons (admin)
 */
export const getCoupons = asyncHandler(async (_req: Request, res: Response) => {
  const coupons = await couponService.getCoupons();

  res.json({
    success: true,
    data: coupons,
  });
});

/**
 * GET /api/coupons/:id
 * Get single coupon (admin)
 */
export const getCouponById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const coupon = await couponService.getCouponById(id);

  res.json({
    success: true,
    data: coupon,
  });
});

/**
 * POST /api/coupons
 * Create new coupon (admin)
 */
export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const result = createCouponSchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError(result.error.errors[0].message);
  }

  const coupon = await couponService.createCoupon(result.data);

  res.status(201).json({
    success: true,
    data: coupon,
  });
});

/**
 * PATCH /api/coupons/:id
 * Update coupon (admin)
 */
export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = updateCouponSchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError(result.error.errors[0].message);
  }

  const coupon = await couponService.updateCoupon(id, result.data);

  res.json({
    success: true,
    data: coupon,
  });
});

/**
 * DELETE /api/coupons/:id
 * Delete coupon (admin)
 */
export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await couponService.deleteCoupon(id);

  res.json({
    success: true,
    data: { message: 'Coupon deleted' },
  });
});

/**
 * POST /api/coupons/validate
 * Validate coupon for cart (customer)
 * Returns discount amount or error reason
 */
export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const result = validateCouponSchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError(result.error.errors[0].message);
  }

  const validation = await couponService.validateCoupon(result.data);

  if (!validation.valid) {
    // Still return 200 with valid: false and reason
    res.json({
      success: true,
      data: {
        valid: false,
        message: validation.message,
      },
    });
    return;
  }

  res.json({
    success: true,
    data: {
      valid: true,
      discountCents: validation.discountCents,
      coupon: validation.coupon
        ? {
            id: validation.coupon.id,
            code: validation.coupon.code,
            discountType: validation.coupon.discountType,
            discountValue: validation.coupon.discountValue,
          }
        : null,
    },
  });
});
