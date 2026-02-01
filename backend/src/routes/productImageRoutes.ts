import express from 'express';
import * as imageController from '../controllers/productImageController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import {
  validateImage,
  validateImageUpdate,
  validateReorderImages,
} from '../validators/productImageValidator';

const router = express.Router({ mergeParams: true });

/**
 * Product Image Routes
 * Base path: /api/products/:productId/images
 */

// Public routes
router.get('/', imageController.getProductImages);
router.get('/:id', imageController.getImage);

// Admin-only routes
router.post('/', authenticate, authorize('admin'), validateImage, imageController.createImage);
router.put('/:id', authenticate, authorize('admin'), validateImageUpdate, imageController.updateImage);
router.delete('/:id', authenticate, authorize('admin'), imageController.deleteImage);

// Image management routes (admin only)
router.put('/:id/set-primary', authenticate, authorize('admin'), imageController.setPrimaryImage);
router.put('/reorder', authenticate, authorize('admin'), validateReorderImages, imageController.reorderImages);

export default router;
