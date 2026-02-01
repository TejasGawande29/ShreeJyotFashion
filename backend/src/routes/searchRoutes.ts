import express from 'express';
import * as searchController from '../controllers/searchController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * Public search endpoints
 */

// Search products with filters
// GET /api/search/products?q=lehenga&category=Wedding&min_price=5000&max_price=20000
router.get('/products', searchController.searchProducts);

// Autocomplete suggestions
// GET /api/search/autocomplete?q=leh
router.get('/autocomplete', searchController.autocomplete);

// Get search status (Elasticsearch availability)
// GET /api/search/status
router.get('/status', searchController.getSearchStatus);

/**
 * Admin-only indexing endpoints
 */

// Index a single product
// POST /api/search/index/:productId
router.post(
  '/index/:productId',
  authenticate,
  authorize('admin'),
  searchController.indexProduct
);

// Bulk index products
// POST /api/search/index/bulk
// Body: { product_ids: [1, 2, 3] } or omit to index all
router.post(
  '/index/bulk',
  authenticate,
  authorize('admin'),
  searchController.bulkIndexProducts
);

// Delete product from index
// DELETE /api/search/index/:productId
router.delete(
  '/index/:productId',
  authenticate,
  authorize('admin'),
  searchController.deleteFromIndex
);

export default router;
