/**
 * Product Routes
 * Public and admin product endpoints
 */

import { Router } from 'express';
import * as productController from '@/controllers/product.controller';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { requireAdmin } from '@/middleware/requireAdmin.middleware';

const router = Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/all', requireAuth, requireAdmin, productController.getAllProducts);
router.get('/:slug', productController.getProductBySlug);

// Admin routes
router.post('/', requireAuth, requireAdmin, productController.createProduct);
router.patch('/:id', requireAuth, requireAdmin, productController.updateProduct);
router.delete('/:id', requireAuth, requireAdmin, productController.deleteProduct);
router.post('/:id/upload', requireAuth, requireAdmin, productController.getUploadUrl);

export default router;
