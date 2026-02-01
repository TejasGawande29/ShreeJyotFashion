/**
 * User Profile Routes
 * REST API endpoints for profile and address management
 */

import express from 'express';
import * as profileController from '../controllers/userProfileController';
import * as profileValidator from '../validators/userProfileValidator';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * All routes require authentication
 */
router.use(authenticate);

/**
 * @route   GET /api/profile
 * @desc    Get current user's complete profile
 * @access  Private
 */
router.get(
  '/',
  profileController.getProfile
);

/**
 * @route   PUT /api/profile
 * @desc    Update user profile information
 * @access  Private
 */
router.put(
  '/',
  profileValidator.validateUpdateProfile,
  profileController.updateProfile
);

/**
 * @route   PUT /api/profile/settings
 * @desc    Update account settings (email, phone, password)
 * @access  Private
 */
router.put(
  '/settings',
  profileValidator.validateUpdateAccountSettings,
  profileController.updateAccountSettings
);

/**
 * @route   GET /api/profile/dashboard
 * @desc    Get user dashboard with overview
 * @access  Private
 */
router.get(
  '/dashboard',
  profileController.getDashboard
);

/**
 * @route   GET /api/profile/addresses
 * @desc    Get all user addresses (optionally filtered by type)
 * @access  Private
 */
router.get(
  '/addresses',
  profileValidator.validateGetAddressesQuery,
  profileController.getAddresses
);

/**
 * @route   POST /api/profile/addresses
 * @desc    Create new address
 * @access  Private
 */
router.post(
  '/addresses',
  profileValidator.validateCreateAddress,
  profileController.createAddress
);

/**
 * @route   GET /api/profile/addresses/:id
 * @desc    Get single address by ID
 * @access  Private
 */
router.get(
  '/addresses/:id',
  profileValidator.validateAddressId,
  profileController.getAddress
);

/**
 * @route   PUT /api/profile/addresses/:id
 * @desc    Update address
 * @access  Private
 */
router.put(
  '/addresses/:id',
  profileValidator.validateAddressId,
  profileValidator.validateUpdateAddress,
  profileController.updateAddress
);

/**
 * @route   DELETE /api/profile/addresses/:id
 * @desc    Delete address (soft delete)
 * @access  Private
 */
router.delete(
  '/addresses/:id',
  profileValidator.validateAddressId,
  profileController.deleteAddress
);

/**
 * @route   PUT /api/profile/addresses/:id/default
 * @desc    Set address as default
 * @access  Private
 */
router.put(
  '/addresses/:id/default',
  profileValidator.validateAddressId,
  profileController.setDefaultAddress
);

/**
 * @route   GET /api/profile/orders
 * @desc    Get user order history with pagination and filters
 * @access  Private
 */
router.get(
  '/orders',
  profileValidator.validateGetOrderHistory,
  profileController.getOrderHistory
);

export default router;
