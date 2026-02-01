import { Router } from 'express';
import * as rentalController from '../controllers/rentalController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// ==================== PUBLIC ROUTES ====================
// Availability check (public)
router.get('/availability', rentalController.checkAvailability);

// ==================== CUSTOMER ROUTES ====================
// Create booking (authenticated)
router.post('/', authenticate, rentalController.createBooking);

// Get my rentals
router.get('/me', authenticate, rentalController.myRentals);

// Return rental (must be before /:id route)
router.put('/:id/return', authenticate, rentalController.returnRental);

// Extend rental (must be before /:id route)
router.put('/:id/extend', authenticate, rentalController.extendRental);

// Get rental by ID
router.get('/:id', authenticate, rentalController.getRentalById);

// ==================== ADMIN ROUTES ====================
// Get all rentals with filters
router.get('/admin/all', authenticate, authorize('admin'), rentalController.adminGetAllRentals);

// Get rental statistics
router.get('/admin/stats', authenticate, authorize('admin'), rentalController.adminGetRentalStats);

// Update rental status
router.put('/admin/:id/status', authenticate, authorize('admin'), rentalController.adminUpdateRentalStatus);

export default router;
