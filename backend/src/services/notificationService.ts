import Notification, { NotificationType } from '../models/Notification';
import logger from '../utils/logger';

/**
 * Create a notification for a user
 */
export const createNotification = async (
  userId: number,
  type: NotificationType,
  title: string,
  message: string,
  actionUrl?: string
): Promise<Notification> => {
  try {
    const notification = await Notification.create({
      user_id: userId,
      type,
      title,
      message,
      action_url: actionUrl || null,
      is_read: false,
      read_at: null,
      created_at: new Date(),
    });

    logger.info(`Notification created for user ${userId}: ${title}`);
    return notification;
  } catch (error: any) {
    logger.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Get user notifications
 */
export const getUserNotifications = async (
  userId: number,
  options: {
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ notifications: Notification[]; total: number; unreadCount: number }> => {
  const { unreadOnly = false, limit = 20, offset = 0 } = options;

  const whereClause: any = { user_id: userId };
  if (unreadOnly) {
    whereClause.is_read = false;
  }

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit,
      offset,
    }),
    Notification.count({ where: whereClause }),
    Notification.count({ where: { user_id: userId, is_read: false } }),
  ]);

  return {
    notifications,
    total,
    unreadCount,
  };
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId: number, userId: number): Promise<boolean> => {
  try {
    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (!notification.is_read) {
      await notification.update({
        is_read: true,
        read_at: new Date(),
      });
    }

    return true;
  } catch (error: any) {
    logger.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllAsRead = async (userId: number): Promise<number> => {
  try {
    const [updatedCount] = await Notification.update(
      {
        is_read: true,
        read_at: new Date(),
      },
      {
        where: {
          user_id: userId,
          is_read: false,
        },
      }
    );

    logger.info(`Marked ${updatedCount} notifications as read for user ${userId}`);
    return updatedCount;
  } catch (error: any) {
    logger.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId: number, userId: number): Promise<boolean> => {
  try {
    const deletedCount = await Notification.destroy({
      where: {
        id: notificationId,
        user_id: userId,
      },
    });

    return deletedCount > 0;
  } catch (error: any) {
    logger.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Delete all read notifications for a user
 */
export const deleteAllRead = async (userId: number): Promise<number> => {
  try {
    const deletedCount = await Notification.destroy({
      where: {
        user_id: userId,
        is_read: true,
      },
    });

    logger.info(`Deleted ${deletedCount} read notifications for user ${userId}`);
    return deletedCount;
  } catch (error: any) {
    logger.error('Error deleting read notifications:', error);
    throw error;
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (userId: number): Promise<number> => {
  return await Notification.count({
    where: {
      user_id: userId,
      is_read: false,
    },
  });
};

/**
 * Create order notification
 */
export const createOrderNotification = async (
  userId: number,
  orderNumber: string,
  status: 'placed' | 'shipped' | 'delivered' | 'cancelled'
): Promise<Notification> => {
  const messages = {
    placed: {
      type: NotificationType.ORDER_PLACED,
      title: 'Order Placed Successfully!',
      message: `Your order #${orderNumber} has been placed successfully.`,
    },
    shipped: {
      type: NotificationType.ORDER_SHIPPED,
      title: 'Order Shipped!',
      message: `Your order #${orderNumber} has been shipped and is on its way.`,
    },
    delivered: {
      type: NotificationType.ORDER_DELIVERED,
      title: 'Order Delivered!',
      message: `Your order #${orderNumber} has been delivered. Enjoy your purchase!`,
    },
    cancelled: {
      type: NotificationType.ORDER_CANCELLED,
      title: 'Order Cancelled',
      message: `Your order #${orderNumber} has been cancelled.`,
    },
  };

  const { type, title, message } = messages[status];
  return createNotification(userId, type, title, message, `/orders/${orderNumber}`);
};

/**
 * Create payment notification
 */
export const createPaymentNotification = async (
  userId: number,
  orderNumber: string,
  amount: number,
  status: 'success' | 'failed'
): Promise<Notification> => {
  const messages = {
    success: {
      type: NotificationType.PAYMENT_SUCCESS,
      title: 'Payment Successful!',
      message: `Payment of ₹${amount.toFixed(2)} for order #${orderNumber} was successful.`,
    },
    failed: {
      type: NotificationType.PAYMENT_FAILED,
      title: 'Payment Failed',
      message: `Payment of ₹${amount.toFixed(2)} for order #${orderNumber} failed. Please try again.`,
    },
  };

  const { type, title, message } = messages[status];
  return createNotification(userId, type, title, message, `/orders/${orderNumber}`);
};

/**
 * Create rental notification
 */
export const createRentalNotification = async (
  userId: number,
  rentalId: number,
  status: 'confirmed' | 'reminder' | 'overdue'
): Promise<Notification> => {
  const messages = {
    confirmed: {
      type: NotificationType.RENTAL_CONFIRMED,
      title: 'Rental Confirmed!',
      message: `Your rental #${rentalId} has been confirmed.`,
    },
    reminder: {
      type: NotificationType.RENTAL_REMINDER,
      title: 'Rental Return Reminder',
      message: `Reminder: Your rental #${rentalId} is due for return soon.`,
    },
    overdue: {
      type: NotificationType.RENTAL_OVERDUE,
      title: 'Rental Overdue!',
      message: `Your rental #${rentalId} is overdue. Please return it immediately to avoid additional charges.`,
    },
  };

  const { type, title, message } = messages[status];
  return createNotification(userId, type, title, message, `/rentals/${rentalId}`);
};

/**
 * Create refund notification
 */
export const createRefundNotification = async (
  userId: number,
  orderNumber: string,
  amount: number
): Promise<Notification> => {
  return createNotification(
    userId,
    NotificationType.REFUND_PROCESSED,
    'Refund Processed',
    `Refund of ₹${amount.toFixed(2)} for order #${orderNumber} has been processed.`,
    `/orders/${orderNumber}`
  );
};

/**
 * Create review approved notification
 */
export const createReviewApprovedNotification = async (
  userId: number,
  productName: string
): Promise<Notification> => {
  return createNotification(
    userId,
    NotificationType.REVIEW_APPROVED,
    'Review Approved!',
    `Your review for "${productName}" has been approved and is now visible to other customers.`,
    '/my-reviews'
  );
};

export default {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  getUnreadCount,
  createOrderNotification,
  createPaymentNotification,
  createRentalNotification,
  createRefundNotification,
  createReviewApprovedNotification,
};
