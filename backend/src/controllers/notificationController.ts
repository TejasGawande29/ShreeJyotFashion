import { Request, Response } from 'express';
import * as notificationService from '../services/notificationService';
import * as emailService from '../services/emailService';
import * as smsService from '../services/smsService';
import EmailLog from '../models/EmailLog';
import SmsLog from '../models/SmsLog';
import logger from '../utils/logger';

/**
 * GET /api/notifications
 * Get user notifications
 */
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const {
      unread_only = 'false',
      page = '1',
      limit = '20',
    } = req.query;

    const result = await notificationService.getUserNotifications(userId, {
      unreadOnly: unread_only === 'true',
      limit: parseInt(limit as string),
      offset: (parseInt(page as string) - 1) * parseInt(limit as string),
    });

    res.json({
      success: true,
      notifications: result.notifications,
      total: result.total,
      unreadCount: result.unreadCount,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(result.total / parseInt(limit as string)),
    });
  } catch (error: any) {
    logger.error('Error getting notifications:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/notifications/unread-count
 * Get unread notification count
 */
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const count = await notificationService.getUnreadCount(userId);

    res.json({
      success: true,
      unreadCount: count,
    });
  } catch (error: any) {
    logger.error('Error getting unread count:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 */
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const notificationId = parseInt(req.params.id);

    if (isNaN(notificationId)) {
      return res.status(400).json({ error: 'Invalid notification ID' });
    }

    await notificationService.markAsRead(notificationId, userId);

    res.json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error: any) {
    logger.error('Error marking notification as read:', error);
    res.status(error.message === 'Notification not found' ? 404 : 500).json({
      error: error.message,
    });
  }
};

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read
 */
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const count = await notificationService.markAllAsRead(userId);

    res.json({
      success: true,
      message: `${count} notification(s) marked as read`,
      count,
    });
  } catch (error: any) {
    logger.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const notificationId = parseInt(req.params.id);

    if (isNaN(notificationId)) {
      return res.status(400).json({ error: 'Invalid notification ID' });
    }

    const deleted = await notificationService.deleteNotification(notificationId, userId);

    if (!deleted) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error: any) {
    logger.error('Error deleting notification:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE /api/notifications/read
 * Delete all read notifications
 */
export const deleteAllRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const count = await notificationService.deleteAllRead(userId);

    res.json({
      success: true,
      message: `${count} notification(s) deleted`,
      count,
    });
  } catch (error: any) {
    logger.error('Error deleting read notifications:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/notifications/admin/send-test-email
 * Send test email (Admin only)
 */
export const sendTestEmail = async (req: Request, res: Response) => {
  try {
    const { email, type = 'welcome' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let success = false;

    switch (type) {
      case 'welcome':
        success = await emailService.sendWelcomeEmail(email, req.user!.userId, 'Test User');
        break;
      case 'order':
        success = await emailService.sendOrderConfirmationEmail(email, req.user!.userId, {
          orderId: 12345,
          orderNumber: 'ORD-TEST-001',
          items: [
            { name: 'Test Product 1', quantity: 2, price: 1500 },
            { name: 'Test Product 2', quantity: 1, price: 2500 },
          ],
          total: 5500,
          shippingAddress: 'Test Address, Test City, Test State - 123456',
        });
        break;
      case 'rental':
        success = await emailService.sendRentalConfirmationEmail(email, req.user!.userId, {
          rentalId: 123,
          productName: 'Test Designer Saree',
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          rentalPrice: 2500,
          securityDeposit: 5000,
        });
        break;
      case 'payment':
        success = await emailService.sendPaymentSuccessEmail(email, req.user!.userId, {
          transactionId: 'TXN-TEST-001',
          amount: 5500,
          orderNumber: 'ORD-TEST-001',
          paymentMethod: 'Credit Card',
          paymentDate: new Date(),
        });
        break;
      default:
        return res.status(400).json({ error: 'Invalid email type' });
    }

    res.json({
      success,
      message: success ? 'Test email sent successfully' : 'Failed to send test email',
    });
  } catch (error: any) {
    logger.error('Error sending test email:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/notifications/admin/send-test-sms
 * Send test SMS (Admin only)
 */
export const sendTestSms = async (req: Request, res: Response) => {
  try {
    const { phone, type = 'order' } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    let success = false;

    switch (type) {
      case 'order':
        success = await smsService.sendOrderConfirmationSms(phone, req.user!.userId, {
          orderNumber: 'ORD-TEST-001',
          total: 5500,
        });
        break;
      case 'rental':
        success = await smsService.sendRentalConfirmationSms(phone, req.user!.userId, {
          rentalId: 123,
          productName: 'Test Designer Saree',
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        break;
      case 'payment':
        success = await smsService.sendPaymentSuccessSms(phone, req.user!.userId, {
          amount: 5500,
          orderNumber: 'ORD-TEST-001',
          transactionId: 'TXN-TEST-001',
        });
        break;
      case 'otp':
        success = await smsService.sendOtpSms(phone, '123456', req.user!.userId);
        break;
      default:
        return res.status(400).json({ error: 'Invalid SMS type' });
    }

    res.json({
      success,
      message: success ? 'Test SMS sent successfully' : 'Failed to send test SMS',
    });
  } catch (error: any) {
    logger.error('Error sending test SMS:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/notifications/admin/email-logs
 * Get email logs (Admin only)
 */
export const getEmailLogs = async (req: Request, res: Response) => {
  try {
    const {
      status,
      email_type,
      page = '1',
      limit = '50',
    } = req.query;

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (email_type) whereClause.email_type = email_type;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [logs, total] = await Promise.all([
      EmailLog.findAll({
        where: whereClause,
        order: [['sent_at', 'DESC']],
        limit: parseInt(limit as string),
        offset,
      }),
      EmailLog.count({ where: whereClause }),
    ]);

    res.json({
      success: true,
      logs,
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(total / parseInt(limit as string)),
    });
  } catch (error: any) {
    logger.error('Error getting email logs:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/notifications/admin/sms-logs
 * Get SMS logs (Admin only)
 */
export const getSmsLogs = async (req: Request, res: Response) => {
  try {
    const {
      status,
      sms_type,
      page = '1',
      limit = '50',
    } = req.query;

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (sms_type) whereClause.sms_type = sms_type;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [logs, total] = await Promise.all([
      SmsLog.findAll({
        where: whereClause,
        order: [['sent_at', 'DESC']],
        limit: parseInt(limit as string),
        offset,
      }),
      SmsLog.count({ where: whereClause }),
    ]);

    res.json({
      success: true,
      logs,
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(total / parseInt(limit as string)),
    });
  } catch (error: any) {
    logger.error('Error getting SMS logs:', error);
    res.status(500).json({ error: error.message });
  }
};
