import express from 'express';
import * as bulkController from '../controllers/bulkProductController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * Bulk Product Routes
 * Base path: /api/products/bulk
 */

// Template routes (public for convenience)
router.get('/template/csv', bulkController.getCSVTemplate);
router.get('/template/json', bulkController.getJSONTemplate);

// Import routes (admin only)
router.post(
  '/import/csv',
  authenticate,
  authorize('admin'),
  bulkController.importFromCSV
);

router.post(
  '/import/json',
  authenticate,
  authorize('admin'),
  bulkController.importFromJSON
);

// Export routes (admin only)
router.get(
  '/export/csv',
  authenticate,
  authorize('admin'),
  bulkController.exportToCSV
);

router.get(
  '/export/json',
  authenticate,
  authorize('admin'),
  bulkController.exportToJSON
);

export default router;
