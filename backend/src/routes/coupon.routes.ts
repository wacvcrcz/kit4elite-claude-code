/**
 * Coupon Routes
 * Coupon CRUD and validation endpoints
 */

import { Router } from 'express';
import * as couponController from '@/controllers/coupon.controller';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { requireAdmin } from '@/middleware/requireAdmin.middleware';

const router = Router();

// Admin routes
router.get('/', requireAuth, requireAdmin, couponController.getCoupons);
router.get('/:id', requireAuth, requireAdmin, couponController.getCouponById);
router.post('/', requireAuth, requireAdmin, couponController.createCoupon);
router.patch('/:id', requireAuth, requireAdmin, couponController.updateCoupon);
router.delete('/:id', requireAuth, requireAdmin, couponController.deleteCoupon);

// Customer validation route (any authenticated user)
router.post('/validate', requireAuth, couponController.validateCoupon);

export default router;
