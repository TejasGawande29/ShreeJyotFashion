import { Router } from 'express';
import * as notificationController from '../controllers/notificationController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// Customer Routes (authenticated)
router.get('/', authenticate, notificationController.getNotifications);
router.get('/unread-count', authenticate, notificationController.getUnreadCount);
router.put('/:id/read', authenticate, notificationController.markAsRead);
router.put('/read-all', authenticate, notificationController.markAllAsRead);
router.delete('/:id', authenticate, notificationController.deleteNotification);
router.delete('/read', authenticate, notificationController.deleteAllRead);

// Admin Routes
router.post('/admin/send-test-email', authenticate, authorize('admin'), notificationController.sendTestEmail);
router.post('/admin/send-test-sms', authenticate, authorize('admin'), notificationController.sendTestSms);
router.get('/admin/email-logs', authenticate, authorize('admin'), notificationController.getEmailLogs);
router.get('/admin/sms-logs', authenticate, authorize('admin'), notificationController.getSmsLogs);

export default router;
