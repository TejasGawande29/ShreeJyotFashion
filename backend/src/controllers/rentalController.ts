import { Request, Response } from 'express';
import * as rentalService from '../services/rentalService';

/**
 * Check product availability for rental
 * GET /api/rentals/availability
 */
export const checkAvailability = async (req: Request, res: Response) => {
  try {
    const { productId, variantId, startDate, endDate } = req.query;

    if (!productId || !startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Product ID, start date, and end date are required',
      });
      return;
    }

    const isAvailable = await rentalService.checkAvailability(
      Number(productId),
      variantId ? Number(variantId) : null,
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json({
      success: true,
      data: { available: isAvailable },
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check availability',
    });
    return;
  }
};

/**
 * Create a rental booking
 * POST /api/rentals
 */
export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const { productId, variantId, rentalStartDate, rentalEndDate, deliveryType } = req.body;

    if (!productId || !rentalStartDate || !rentalEndDate) {
      res.status(400).json({
        success: false,
        message: 'Product ID, start date, and end date are required',
      });
      return;
    }

    const rental = await rentalService.createRental(userId, {
      productId: Number(productId),
      variantId: variantId ? Number(variantId) : undefined,
      rentalStartDate: new Date(rentalStartDate),
      rentalEndDate: new Date(rentalEndDate),
      deliveryType: deliveryType || 'standard',
    });

    res.status(201).json({
      success: true,
      message: 'Rental booking created successfully',
      data: rental,
    });
    return;
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create rental booking',
    });
    return;
  }
};

/**
 * Get user's rentals
 * GET /api/rentals/me
 */
export const myRentals = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const rentals = await rentalService.getUserRentals(userId);

    res.json({
      success: true,
      data: rentals,
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch rentals',
    });
    return;
  }
};

/**
 * Get rental by ID
 * GET /api/rentals/:id
 */
export const getRentalById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const rentalId = Number(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const rental = await rentalService.getRentalById(rentalId);

    if (!rental) {
      res.status(404).json({
        success: false,
        message: 'Rental not found',
      });
      return;
    }

    // Check if user owns this rental
    if (rental.user_id !== userId) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }

    res.json({
      success: true,
      data: rental,
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch rental',
    });
    return;
  }
};

/**
 * Process rental return
 * PUT /api/rentals/:id/return
 */
export const returnRental = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const rentalId = Number(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const rental = await rentalService.returnRental(rentalId, userId);

    res.json({
      success: true,
      message: 'Rental returned successfully',
      data: rental,
    });
    return;
  } catch (error: any) {
    console.error('Return rental error:', error);
    
    if (error.message === 'Rental not found') {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error.message === 'Access denied' || error.message === 'Rental already returned') {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process return',
    });
    return;
  }
};

/**
 * Extend rental period
 * PUT /api/rentals/:id/extend
 */
export const extendRental = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const rentalId = Number(req.params.id);
    const { newEndDate } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    if (!newEndDate) {
      res.status(400).json({
        success: false,
        message: 'New end date is required',
      });
      return;
    }

    const rental = await rentalService.extendRental(rentalId, userId, new Date(newEndDate));

    res.json({
      success: true,
      message: 'Rental extended successfully',
      data: rental,
    });
    return;
  } catch (error: any) {
    console.error('Extend rental error:', error);
    
    if (error.message === 'Rental not found') {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (
      error.message === 'Access denied' ||
      error.message === 'Cannot extend completed or returned rental' ||
      error.message === 'Cannot extend cancelled rental' ||
      error.message === 'New end date must be after current end date' ||
      error.message === 'Product is not available for the requested extension period'
    ) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to extend rental',
    });
    return;
  }
};

/**
 * Admin: Get all rentals with filters
 * GET /api/rentals/admin/all
 */
export const adminGetAllRentals = async (req: Request, res: Response) => {
  try {
    const { status, userId, startDate, endDate, page, limit } = req.query;

    const filters: any = {};

    if (status) filters.status = status as string;
    if (userId) filters.userId = Number(userId);
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);
    if (page) filters.page = Number(page);
    if (limit) filters.limit = Number(limit);

    const result = await rentalService.getAllRentals(filters);

    res.json({
      success: true,
      data: result.rentals,
      pagination: result.pagination,
    });
    return;
  } catch (error: any) {
    console.error('Admin get all rentals error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch rentals',
    });
    return;
  }
};

/**
 * Admin: Update rental status
 * PUT /api/rentals/admin/:id/status
 */
export const adminUpdateRentalStatus = async (req: Request, res: Response) => {
  try {
    const rentalId = Number(req.params.id);
    const { status } = req.body;

    if (!status) {
      res.status(400).json({
        success: false,
        message: 'Status is required',
      });
      return;
    }

    const rental = await rentalService.updateRentalStatusAdmin(rentalId, status);

    res.json({
      success: true,
      message: 'Rental status updated successfully',
      data: rental,
    });
    return;
  } catch (error: any) {
    console.error('Admin update rental status error:', error);
    
    if (error.message === 'Rental not found') {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update rental status',
    });
    return;
  }
};

/**
 * Admin: Get rental statistics
 * GET /api/rentals/admin/stats
 */
export const adminGetRentalStats = async (req: Request, res: Response) => {
  try {
    const stats = await rentalService.getRentalStats();

    res.json({
      success: true,
      data: stats,
    });
    return;
  } catch (error: any) {
    console.error('Admin get rental stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch rental statistics',
    });
    return;
  }
};
