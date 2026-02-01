import express from 'express';
import * as variantController from '../controllers/productVariantController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import {
  validateVariant,
  validateVariantUpdate,
  validateStockQuantity,
} from '../validators/productVariantValidator';

const router = express.Router({ mergeParams: true });

/**
 * Product Variant Routes
 * Base path: /api/products/:productId/variants
 */

// Public routes
router.get('/', variantController.getProductVariants);
router.get('/:id', variantController.getVariant);

// Admin-only routes
router.post('/', authenticate, authorize('admin'), validateVariant, variantController.createVariant);
router.put('/:id', authenticate, authorize('admin'), validateVariantUpdate, variantController.updateVariant);
router.delete('/:id', authenticate, authorize('admin'), variantController.deleteVariant);

// Stock management routes (admin only)
router.post('/:id/reserve', authenticate, authorize('admin'), validateStockQuantity, variantController.reserveStock);
router.post('/:id/release', authenticate, authorize('admin'), validateStockQuantity, variantController.releaseStock);
router.post('/:id/add-stock', authenticate, authorize('admin'), validateStockQuantity, variantController.addStock);
router.post('/:id/reduce-stock', authenticate, authorize('admin'), validateStockQuantity, variantController.reduceStock);

export default router;
