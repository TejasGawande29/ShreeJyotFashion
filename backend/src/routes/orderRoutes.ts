/**
 * Order Routes
 * API endpoints for order management
 */

import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import {
  validateCreateOrder,
  validateUpdateOrderStatus,
  validateGetOrdersQuery,
} from '../validators/orderValidator';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/orders
 * @desc    Place a new order from cart
 * @access  Private
 */
router.post('/', validateCreateOrder, orderController.placeOrder);

/**
 * @route   GET /api/orders/stats
 * @desc    Get order statistics
 * @access  Private
 * @note    Must be before /:id route to avoid treating 'stats' as an ID
 */
router.get('/stats', orderController.getOrderStats);

/**
 * @route   GET /api/orders
 * @desc    Get orders (user's own or all for admin)
 * @access  Private
 */
router.get('/', validateGetOrdersQuery, orderController.getOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order details
 * @access  Private
 */
router.get('/:id', orderController.getOrderDetails);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status
 * @access  Private (Admin only)
 */
router.put(
  '/:id/status',
  authorize('admin'),
  validateUpdateOrderStatus,
  orderController.updateOrderStatus
);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Cancel order
 * @access  Private
 */
router.delete('/:id', orderController.cancelOrder);

export default router;
