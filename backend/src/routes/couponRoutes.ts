import { Router } from 'express';
import * as couponController from '../controllers/couponController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// Customer Routes (authenticated)
router.post('/validate', authenticate, couponController.validateCoupon);
router.get('/my-usage', authenticate, couponController.getMyUsage);

// Admin Routes
router.post('/', authenticate, authorize('admin'), couponController.createCoupon);
router.get('/', authenticate, authorize('admin'), couponController.getAllCoupons);
router.get('/:id', authenticate, authorize('admin'), couponController.getCouponById);
router.put('/:id', authenticate, authorize('admin'), couponController.updateCoupon);
router.delete('/:id', authenticate, authorize('admin'), couponController.deleteCoupon);
router.get('/:id/stats', authenticate, authorize('admin'), couponController.getCouponStats);
router.post('/generate-code', authenticate, authorize('admin'), couponController.generateCode);

export default router;
