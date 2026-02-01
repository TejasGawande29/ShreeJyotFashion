import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/product/:productId/stats', reviewController.getProductReviewStats);
router.get('/:id', reviewController.getReviewById);

// Customer routes (authenticated)
router.post('/', authenticate, reviewController.createReview);
router.get('/my-review/:productId', authenticate, reviewController.getMyProductReview);
router.put('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);
router.post('/:id/helpful', authenticate, reviewController.markHelpful);

// Admin routes (admin only)
router.get('/admin/all', authenticate, authorize('admin'), reviewController.getAllReviews);
router.put('/admin/:id/moderate', authenticate, authorize('admin'), reviewController.moderateReview);

export default router;
