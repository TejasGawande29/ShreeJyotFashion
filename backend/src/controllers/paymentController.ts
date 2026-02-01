import { Request, Response } from 'express';
import * as paymentService from '../services/paymentService';
import { PaymentMethod } from '../models/Payment';
import { RAZORPAY_CONFIG } from '../config/razorpay';
import logger from '../utils/logger';

/**
 * POST /api/payments/create-order
 * Create Razorpay order for payment
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { order_id, amount, payment_method } = req.body;
    const userId = req.user!.userId;

    // Validation
    if (!order_id || !amount || !payment_method) {
      return res.status(400).json({ 
        error: 'order_id, amount, and payment_method are required' 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    if (!Object.values(PaymentMethod).includes(payment_method)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    // Create payment order
    const { razorpayOrder, payment } = await paymentService.createPaymentOrder(
      order_id,
      userId,
      amount,
      payment_method
    );

    res.status(201).json({
      success: true,
      payment_id: payment.id,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount / 100, // Convert back to rupees
      currency: razorpayOrder.currency,
      key: RAZORPAY_CONFIG.KEY_ID,
    });
  } catch (error: any) {
    logger.error('Error creating payment order:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/payments/verify
 * Verify payment signature after payment completion
 */
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { 
      payment_id, 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;

    // Validation
    if (!payment_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        error: 'payment_id, razorpay_order_id, razorpay_payment_id, and razorpay_signature are required' 
      });
    }

    // Verify signature
    const isValid = paymentService.verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid payment signature' 
      });
    }

    // Update payment record
    const payment = await paymentService.updatePaymentAfterVerification(
      payment_id,
      razorpay_payment_id,
      razorpay_signature
    );

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        id: payment.id,
        order_id: payment.order_id,
        amount: payment.amount,
        status: payment.status,
        payment_date: payment.payment_date,
      },
    });
  } catch (error: any) {
    logger.error('Error verifying payment:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/payments/:id/capture
 * Capture authorized payment (Admin only)
 */
export const capture = async (req: Request, res: Response) => {
  try {
    const paymentId = parseInt(req.params.id);
    const { amount } = req.body;

    if (isNaN(paymentId)) {
      return res.status(400).json({ error: 'Invalid payment ID' });
    }

    const payment = await paymentService.capturePayment(paymentId, amount);

    res.json({
      success: true,
      message: 'Payment captured successfully',
      payment: {
        id: payment.id,
        order_id: payment.order_id,
        amount: payment.amount,
        status: payment.status,
        payment_date: payment.payment_date,
      },
    });
  } catch (error: any) {
    logger.error('Error capturing payment:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/payments/:id/refund
 * Create refund for payment (Admin only)
 */
export const refund = async (req: Request, res: Response) => {
  try {
    const paymentId = parseInt(req.params.id);
    const { amount, reason } = req.body;

    if (isNaN(paymentId)) {
      return res.status(400).json({ error: 'Invalid payment ID' });
    }

    const payment = await paymentService.createRefund(paymentId, amount, reason);

    res.json({
      success: true,
      message: 'Refund created successfully',
      payment: {
        id: payment.id,
        order_id: payment.order_id,
        amount: payment.amount,
        refund_amount: payment.refund_amount,
        status: payment.status,
        refund_date: payment.refund_date,
      },
    });
  } catch (error: any) {
    logger.error('Error creating refund:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/payments/order/:orderId
 * Get payment by order ID
 */
export const getByOrderId = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId);
    const userId = req.user!.userId;

    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const payment = await paymentService.getPaymentByOrderId(orderId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Check if user owns the payment
    if (payment.user_id !== userId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ payment });
  } catch (error: any) {
    logger.error('Error fetching payment:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/payments/user/:userId
 * Get all payments for a user (Admin only)
 */
export const getByUserId = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const payments = await paymentService.getPaymentsByUserId(userId);

    res.json({ 
      count: payments.length,
      payments 
    });
  } catch (error: any) {
    logger.error('Error fetching payments:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/payments/key
 * Get Razorpay key for frontend
 */
export const getRazorpayKey = (req: Request, res: Response) => {
  res.json({ key: RAZORPAY_CONFIG.KEY_ID });
};

/**
 * POST /api/payments/:id/fail
 * Mark payment as failed
 */
export const markFailed = async (req: Request, res: Response) => {
  try {
    const paymentId = parseInt(req.params.id);
    const { reason } = req.body;

    if (isNaN(paymentId)) {
      return res.status(400).json({ error: 'Invalid payment ID' });
    }

    if (!reason) {
      return res.status(400).json({ error: 'Failure reason is required' });
    }

    const payment = await paymentService.markPaymentFailed(paymentId, reason);

    res.json({
      success: true,
      message: 'Payment marked as failed',
      payment: {
        id: payment.id,
        order_id: payment.order_id,
        status: payment.status,
        failure_reason: payment.failure_reason,
      },
    });
  } catch (error: any) {
    logger.error('Error marking payment as failed:', error);
    res.status(500).json({ error: error.message });
  }
};
