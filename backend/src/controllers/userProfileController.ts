/**
 * User Profile Controller
 * API handlers for user profile and address management
 */

import { Request, Response } from 'express';
import * as profileService from '../services/userProfileService';
import logger from '../utils/logger';

/**
 * @route   GET /api/profile
 * @desc    Get current user's profile
 * @access  Private
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

    const profile = await profileService.getCompleteProfile(userId);

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile,
    });
  } catch (error: any) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Private
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

    const updatedProfile = await profileService.updateProfile(userId, req.body);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    });
  } catch (error: any) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/profile/settings
 * @desc    Update account settings (email, phone, password)
 * @access  Private
 */
export const updateAccountSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

    const updatedSettings = await profileService.updateAccountSettings(userId, req.body);

    res.status(200).json({
      success: true,
      message: 'Account settings updated successfully',
      data: updatedSettings,
    });
  } catch (error: any) {
    logger.error('Update account settings error:', error);
    
    if (error.message.includes('password') || error.message.includes('email')) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update account settings',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/profile/dashboard
 * @desc    Get user dashboard with overview
 * @access  Private
 */
export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

    const dashboard = await profileService.getUserDashboard(userId);

    res.status(200).json({
      success: true,
      message: 'Dashboard retrieved successfully',
      data: dashboard,
    });
  } catch (error: any) {
    logger.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/profile/addresses
 * @desc    Get all user addresses
 * @access  Private
 */
export const getAddresses = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const addressType = req.query.type as string | undefined;

    const addresses = await profileService.getUserAddresses(userId, addressType);

    res.status(200).json({
      success: true,
      message: 'Addresses retrieved successfully',
      data: addresses,
    });
  } catch (error: any) {
    logger.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve addresses',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/profile/addresses/:id
 * @desc    Get single address
 * @access  Private
 */
export const getAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const addressId = parseInt(req.params.id);

    const address = await profileService.getAddressById(userId, addressId);

    res.status(200).json({
      success: true,
      message: 'Address retrieved successfully',
      data: address,
    });
  } catch (error: any) {
    logger.error('Get address error:', error);
    
    if (error.message === 'Address not found') {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve address',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/profile/addresses
 * @desc    Create new address
 * @access  Private
 */
export const createAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

    const address = await profileService.createAddress(userId, req.body);

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: address,
    });
  } catch (error: any) {
    logger.error('Create address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create address',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/profile/addresses/:id
 * @desc    Update address
 * @access  Private
 */
export const updateAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const addressId = parseInt(req.params.id);

    const address = await profileService.updateAddress(userId, addressId, req.body);

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: address,
    });
  } catch (error: any) {
    logger.error('Update address error:', error);
    
    if (error.message === 'Address not found') {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/profile/addresses/:id
 * @desc    Delete address
 * @access  Private
 */
export const deleteAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const addressId = parseInt(req.params.id);

    const result = await profileService.deleteAddress(userId, addressId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    logger.error('Delete address error:', error);
    
    if (error.message === 'Address not found') {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/profile/addresses/:id/default
 * @desc    Set address as default
 * @access  Private
 */
export const setDefaultAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const addressId = parseInt(req.params.id);

    const address = await profileService.setDefaultAddress(userId, addressId);

    res.status(200).json({
      success: true,
      message: 'Default address updated successfully',
      data: address,
    });
  } catch (error: any) {
    logger.error('Set default address error:', error);
    
    if (error.message === 'Address not found') {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to set default address',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/profile/orders
 * @desc    Get user order history
 * @access  Private
 */
export const getOrderHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    
    const filters = {
      status: req.query.status as string,
      from_date: req.query.from_date as string,
      to_date: req.query.to_date as string,
    };

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await profileService.getOrderHistory(userId, filters, page, limit);

    res.status(200).json({
      success: true,
      message: 'Order history retrieved successfully',
      data: result.orders,
      pagination: result.pagination,
    });
  } catch (error: any) {
    logger.error('Get order history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order history',
      error: error.message,
    });
  }
};
