/**
 * Order Controller
 * HTTP request handlers for order operations
 */

import { Request, Response } from 'express';
import * as orderService from '../services/orderService';
import logger from '../utils/logger';

/**
 * @route   POST /api/orders
 * @desc    Place a new order from cart
 * @access  Private
 */
export const placeOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { shipping_address, billing_address, payment_method, notes } = req.body;

    const result = await orderService.createOrder({
      user_id: userId,
      shipping_address,
      billing_address,
      payment_method,
      notes,
    });

    logger.info(`Order placed: ${result.order?.order_number} by user ${userId}`);

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.order,
    });
  } catch (error: any) {
    logger.error('Place order error:', error);

    if (error.message.includes('Cart is empty')) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error.message.includes('not available') || error.message.includes('Insufficient stock')) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/orders
 * @desc    Get user's orders or all orders (admin)
 * @access  Private
 */
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;
    
    // Use validated query from validator
    const query = (res.locals.validatedQuery || req.query) as any;
    const { status, payment_status, from_date, to_date, page = 1, limit = 20, user_id } = query;

    const filters: any = {};
    
    // Non-admin users can only see their own orders
    if (userRole !== 'admin') {
      filters.user_id = userId;
    } else if (user_id) {
      // Admin can filter by user_id
      filters.user_id = parseInt(user_id as string);
    }

    if (status) filters.status = status as string;
    if (payment_status) filters.payment_status = payment_status as string;
    if (from_date) filters.from_date = from_date as string;
    if (to_date) filters.to_date = to_date as string;

    const result = await orderService.getOrders(
      filters,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      data: result.orders,
      pagination: result.pagination,
    });
  } catch (error: any) {
    logger.error('Get orders error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order details
 * @access  Private
 */
export const getOrderDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;
    const orderId = parseInt(req.params.id);

    // Non-admin users can only see their own orders
    const order = await orderService.getOrderById(
      orderId,
      userRole === 'admin' ? undefined : userId
    );

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    logger.error('Get order details error:', error);

    if (error.message === 'Order not found') {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (admin only)
 * @access  Private (Admin)
 */
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = parseInt(req.params.id);
    const { status, tracking_number } = req.body;

    const result = await orderService.updateOrderStatus(orderId, status, tracking_number);

    logger.info(`Order ${orderId} status updated to ${status}`);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.order,
    });
  } catch (error: any) {
    logger.error('Update order status error:', error);

    if (error.message === 'Order not found') {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error.message === 'Invalid status') {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/orders/:id
 * @desc    Cancel order
 * @access  Private
 */
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;
    const orderId = parseInt(req.params.id);

    // Non-admin users can only cancel their own orders
    const result = await orderService.cancelOrder(
      orderId,
      userRole === 'admin' ? undefined : userId
    );

    logger.info(`Order ${orderId} cancelled`);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.order,
    });
  } catch (error: any) {
    logger.error('Cancel order error:', error);

    if (error.message === 'Order not found') {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error.message.includes('cannot be cancelled')) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/orders/stats
 * @desc    Get order statistics
 * @access  Private
 */
export const getOrderStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    // Non-admin users get only their stats
    const stats = await orderService.getOrderStats(
      userRole === 'admin' ? undefined : userId
    );

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    logger.error('Get order stats error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message,
    });
  }
};
