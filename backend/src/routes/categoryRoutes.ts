import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { validateCategory, validateCategoryUpdate } from '../validators/categoryValidator';

const router = Router();

/**
 * Public Routes - No authentication required
 */

// Get all categories with hierarchy
// GET /api/categories
router.get('/', categoryController.listCategories);

// Get root categories only
// GET /api/categories/roots
router.get('/roots', categoryController.getRootCategories);

// Get category with product count
// GET /api/categories/123/products/count
router.get('/:id/products/count', categoryController.getCategoryProductCount);

// Get single category by ID or slug
// GET /api/categories/123 or GET /api/categories/women-wear
router.get('/:identifier', categoryController.getCategory);

/**
 * Protected Routes - Admin only
 */

// Create a new category
// POST /api/categories
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateCategory,
  categoryController.createCategory
);

// Update a category
// PUT /api/categories/123
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateCategoryUpdate,
  categoryController.updateCategory
);

// Delete a category (soft delete)
// DELETE /api/categories/123
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  categoryController.deleteCategory
);

export default router;
