/**
 * Category Routes
 * Category CRUD endpoints
 */

import { Router } from 'express';
import * as categoryController from '@/controllers/category.controller';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { requireAdmin } from '@/middleware/requireAdmin.middleware';

const router = Router();

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

// Admin routes
router.post('/', requireAuth, requireAdmin, categoryController.createCategory);
router.patch('/:id', requireAuth, requireAdmin, categoryController.updateCategory);
router.delete('/:id', requireAuth, requireAdmin, categoryController.deleteCategory);

export default router;
