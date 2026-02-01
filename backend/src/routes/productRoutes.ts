import { Router } from 'express';
import * as productController from '../controllers/productController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { validateProduct, validateProductUpdate } from '../validators/productValidator';

const router = Router();

/**
 * Public Routes - No authentication required
 */

// Get all products with filters and pagination
// GET /api/products?search=shirt&category_id=1&min_price=100&max_price=500&page=1&limit=10
router.get('/', productController.listProducts);

// Search products
// GET /api/products/search?q=wedding
router.get('/search', productController.searchProducts);

// Get featured products
// GET /api/products/featured?limit=10
router.get('/featured', productController.getFeaturedProducts);

// Get single product by ID or slug
// GET /api/products/123 or GET /api/products/wedding-lehenga
router.get('/:identifier', productController.getProduct);

/**
 * Protected Routes - Admin only
 */

// Create a new product
// POST /api/products
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateProduct,
  productController.createProduct
);

// Update a product
// PUT /api/products/123
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateProductUpdate,
  productController.updateProduct
);

// Delete a product (soft delete)
// DELETE /api/products/123
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  productController.deleteProduct
);

export default router;
