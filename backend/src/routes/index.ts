/**
 * API Routes Index
 * Combines all route modules
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import couponRoutes from './coupon.routes';

const router = Router();

// Root endpoint
router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'LUXE E-Commerce API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      coupons: '/api/coupons',
    },
  });
});

// Route modules
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/coupons', couponRoutes);

export { router as apiRouter };
