import { Router } from 'express';
import * as paymentController from '../controllers/paymentController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/key', paymentController.getRazorpayKey);

// Customer routes (authenticated)
router.post('/create-order', authenticate, paymentController.createOrder);
router.post('/verify', authenticate, paymentController.verifyPayment);
router.get('/order/:orderId', authenticate, paymentController.getByOrderId);
router.post('/:id/fail', authenticate, paymentController.markFailed);

// Admin routes (admin only)
router.post('/:id/capture', authenticate, authorize('admin'), paymentController.capture);
router.post('/:id/refund', authenticate, authorize('admin'), paymentController.refund);
router.get('/user/:userId', authenticate, authorize('admin'), paymentController.getByUserId);

export default router;
