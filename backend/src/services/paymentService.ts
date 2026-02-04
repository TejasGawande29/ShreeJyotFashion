import razorpayInstance, { RAZORPAY_CONFIG } from '../config/razorpay';
import Payment, { PaymentGateway, PaymentMethod, PaymentStatus } from '../models/Payment';
import Order from '../models/Order';
import crypto from 'crypto';
import logger from '../utils/logger';
import * as emailService from './emailService';
import * as smsService from './smsService';
import * as notificationService from './notificationService';
import User from '../models/User';

/**
 * Create Razorpay order and payment record
 */
export const createPaymentOrder = async (
  orderId: number,
  userId: number,
  amount: number,
  paymentMethod: PaymentMethod
): Promise<{ razorpayOrder: any; payment: Payment }> => {
  try {
    // Check if Razorpay is configured
    if (!razorpayInstance) {
      throw new Error('Payment gateway not configured. Please contact support.');
    }

    // Verify order exists and belongs to user
    const order = await Order.findOne({ where: { id: orderId, user_id: userId } });
    if (!order) {
      throw new Error('Order not found or access denied');
    }

    // Create Razorpay order
    const orderOptions = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${orderId}_${Date.now()}`,
      notes: {
        order_id: orderId,
        user_id: userId,
      },
    };

    const razorpayOrder = await razorpayInstance.orders.create(orderOptions);
    
    // Create payment record
    const payment = await Payment.create({
      order_id: orderId,
      user_id: userId,
      payment_gateway: PaymentGateway.RAZORPAY,
      transaction_id: razorpayOrder.id, // Store Razorpay order_id as transaction_id
      payment_method: paymentMethod,
      amount: amount,
      currency: 'INR',
      status: PaymentStatus.PENDING,
      gateway_response: {
        razorpay_order_id: razorpayOrder.id,
        razorpay_order_details: razorpayOrder,
      },
    });

    logger.info('Payment order created:', { 
      paymentId: payment.id, 
      razorpayOrderId: razorpayOrder.id, 
      amount 
    });
    
    return { razorpayOrder, payment };
  } catch (error: any) {
    logger.error('Error creating payment order:', error);
    throw new Error(`Failed to create payment order: ${error.message}`);
  }
};

/**
 * Verify Razorpay payment signature
 */
export const verifyPaymentSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean => {
  try {
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generated_signature = crypto
      .createHmac('sha256', RAZORPAY_CONFIG.SECRET)
      .update(text)
      .digest('hex');

    const isValid = generated_signature === razorpaySignature;
    logger.info('Payment signature verification:', { isValid });
    
    return isValid;
  } catch (error: any) {
    logger.error('Error verifying payment signature:', error);
    return false;
  }
};

/**
 * Update payment after successful verification
 */
export const updatePaymentAfterVerification = async (
  paymentId: number,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<Payment> => {
  try {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    // Update payment with verification details
    payment.status = PaymentStatus.COMPLETED;
    payment.payment_date = new Date();
    payment.gateway_response = {
      ...payment.gateway_response,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      verified_at: new Date().toISOString(),
    };

    await payment.save();

    logger.info('Payment verified and updated:', { paymentId, razorpayPaymentId });
    
    // Send payment success notifications (async, don't wait)
    const order = await Order.findByPk(payment.order_id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'phone'],
        },
      ],
    });

    if (order) {
      const user = (order as any).user;
      
      // Send payment success email
      emailService.sendPaymentSuccessEmail(
        user.email,
        user.id,
        {
          transactionId: razorpayPaymentId,
          amount: payment.amount,
          orderNumber: order.order_number,
          paymentMethod: payment.payment_method,
          paymentDate: payment.payment_date!,
        }
      ).catch(err => console.error('Failed to send payment success email:', err));

      // Send payment success SMS
      if (user.phone) {
        smsService.sendPaymentSuccessSms(
          user.phone,
          user.id,
          {
            amount: payment.amount,
            orderNumber: order.order_number,
            transactionId: razorpayPaymentId,
          }
        ).catch(err => console.error('Failed to send payment success SMS:', err));
      }

      // Create in-app notification
      notificationService.createPaymentNotification(
        user.id,
        order.order_number,
        payment.amount,
        'success'
      ).catch(err => console.error('Failed to create payment notification:', err));
    }
    
    return payment;
  } catch (error: any) {
    logger.error('Error updating payment:', error);
    throw new Error(`Failed to update payment: ${error.message}`);
  }
};

/**
 * Capture authorized payment
 */
export const capturePayment = async (
  paymentId: number,
  captureAmount?: number
): Promise<Payment> => {
  try {
    if (!razorpayInstance) {
      throw new Error('Payment gateway not configured');
    }

    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    // Get razorpay_payment_id from gateway_response
    const razorpayPaymentId = payment.gateway_response?.razorpay_payment_id;
    if (!razorpayPaymentId) {
      throw new Error('Payment ID not found in gateway response');
    }

    const amountToCapture = captureAmount || payment.amount;
    const amountInPaise = Math.round(amountToCapture * 100);

    // Capture payment via Razorpay
    const captureResponse = await razorpayInstance.payments.capture(
      razorpayPaymentId,
      amountInPaise,
      payment.currency || 'INR'
    );

    // Update payment record
    payment.status = PaymentStatus.COMPLETED;
    payment.payment_date = new Date();
    payment.gateway_response = {
      ...payment.gateway_response,
      capture_response: captureResponse,
      captured_at: new Date().toISOString(),
    };

    await payment.save();

    logger.info('Payment captured:', { paymentId, amount: amountToCapture });
    
    return payment;
  } catch (error: any) {
    logger.error('Error capturing payment:', error);
    throw new Error(`Failed to capture payment: ${error.message}`);
  }
};

/**
 * Create refund
 */
export const createRefund = async (
  paymentId: number,
  refundAmount?: number,
  reason?: string
): Promise<Payment> => {
  try {
    if (!razorpayInstance) {
      throw new Error('Payment gateway not configured');
    }

    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new Error('Only completed payments can be refunded');
    }

    // Get razorpay_payment_id from gateway_response
    const razorpayPaymentId = payment.gateway_response?.razorpay_payment_id;
    if (!razorpayPaymentId) {
      throw new Error('Payment ID not found in gateway response');
    }

    const amountToRefund = refundAmount || payment.amount;
    const amountInPaise = Math.round(amountToRefund * 100);

    // Create refund via Razorpay
    const refundResponse = await razorpayInstance.payments.refund(razorpayPaymentId, {
      amount: amountInPaise,
      notes: {
        reason: reason || 'Refund requested',
      },
    });

    // Update payment record
    const isFullRefund = amountToRefund >= payment.amount;
    payment.status = isFullRefund ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED;
    payment.refund_amount = (payment.refund_amount || 0) + amountToRefund;
    payment.refund_date = new Date();
    payment.failure_reason = reason;
    payment.gateway_response = {
      ...payment.gateway_response,
      refund_response: refundResponse,
      refunded_at: new Date().toISOString(),
    };

    await payment.save();

    logger.info('Refund created:', { paymentId, amount: amountToRefund });
    
    return payment;
  } catch (error: any) {
    logger.error('Error creating refund:', error);
    throw new Error(`Failed to create refund: ${error.message}`);
  }
};

/**
 * Get payment by order ID
 */
export const getPaymentByOrderId = async (orderId: number): Promise<Payment | null> => {
  try {
    const payment = await Payment.findOne({ 
      where: { order_id: orderId },
      order: [['created_at', 'DESC']], // Get most recent payment
    });
    
    return payment;
  } catch (error: any) {
    logger.error('Error fetching payment by order ID:', error);
    throw new Error(`Failed to fetch payment: ${error.message}`);
  }
};

/**
 * Get all payments for a user
 */
export const getPaymentsByUserId = async (userId: number): Promise<Payment[]> => {
  try {
    const payments = await Payment.findAll({ 
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });
    
    return payments;
  } catch (error: any) {
    logger.error('Error fetching payments by user ID:', error);
    throw new Error(`Failed to fetch payments: ${error.message}`);
  }
};

/**
 * Mark payment as failed
 */
export const markPaymentFailed = async (
  paymentId: number,
  failureReason: string
): Promise<Payment> => {
  try {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.status = PaymentStatus.FAILED;
    payment.failure_reason = failureReason;
    payment.gateway_response = {
      ...payment.gateway_response,
      failed_at: new Date().toISOString(),
    };

    await payment.save();

    logger.info('Payment marked as failed:', { paymentId, reason: failureReason });
    
    return payment;
  } catch (error: any) {
    logger.error('Error marking payment as failed:', error);
    throw new Error(`Failed to update payment: ${error.message}`);
  }
};
