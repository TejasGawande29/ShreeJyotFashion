import { Request, Response } from 'express';
import * as couponService from '../services/couponService';
import { DiscountType, ApplicableTo } from '../models/Coupon';
import logger from '../utils/logger';

/**
 * POST /api/coupons
 * Create a new coupon (Admin only)
 */
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_value,
      max_discount,
      usage_limit,
      usage_per_user,
      applicable_to,
      category_ids,
      product_ids,
      valid_from,
      valid_to,
      is_active,
    } = req.body;

    // Validation
    if (!discount_type || !discount_value || !valid_from || !valid_to) {
      return res.status(400).json({
        error: 'discount_type, discount_value, valid_from, and valid_to are required',
      });
    }

    const coupon = await couponService.createCoupon({
      code,
      description,
      discount_type,
      discount_value: parseFloat(discount_value),
      min_order_value: min_order_value ? parseFloat(min_order_value) : undefined,
      max_discount: max_discount ? parseFloat(max_discount) : undefined,
      usage_limit,
      usage_per_user,
      applicable_to,
      category_ids,
      product_ids,
      valid_from: new Date(valid_from),
      valid_to: new Date(valid_to),
      is_active,
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon,
    });
  } catch (error: any) {
    logger.error('Error creating coupon:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/coupons
 * Get all coupons (Admin only)
 */
export const getAllCoupons = async (req: Request, res: Response) => {
  try {
    const {
      status = 'all',
      page = '1',
      limit = '20',
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const result = await couponService.getAllCoupons({
      status: status as any,
      limit: parseInt(limit as string),
      offset,
    });

    res.json({
      success: true,
      ...result,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(result.total / parseInt(limit as string)),
    });
  } catch (error: any) {
    logger.error('Error getting coupons:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/coupons/:id
 * Get coupon by ID (Admin only)
 */
export const getCouponById = async (req: Request, res: Response) => {
  try {
    const couponId = parseInt(req.params.id);

    if (isNaN(couponId)) {
      return res.status(400).json({ error: 'Invalid coupon ID' });
    }

    const coupon = await couponService.getCouponById(couponId);

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json({ success: true, coupon });
  } catch (error: any) {
    logger.error('Error getting coupon:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * PUT /api/coupons/:id
 * Update coupon (Admin only)
 */
export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const couponId = parseInt(req.params.id);
    const updates = req.body;

    if (isNaN(couponId)) {
      return res.status(400).json({ error: 'Invalid coupon ID' });
    }

    // Convert numeric fields
    if (updates.discount_value) updates.discount_value = parseFloat(updates.discount_value);
    if (updates.min_order_value) updates.min_order_value = parseFloat(updates.min_order_value);
    if (updates.max_discount) updates.max_discount = parseFloat(updates.max_discount);
    if (updates.valid_from) updates.valid_from = new Date(updates.valid_from);
    if (updates.valid_to) updates.valid_to = new Date(updates.valid_to);

    const coupon = await couponService.updateCoupon(couponId, updates);

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      coupon,
    });
  } catch (error: any) {
    logger.error('Error updating coupon:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE /api/coupons/:id
 * Delete (deactivate) coupon (Admin only)
 */
export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const couponId = parseInt(req.params.id);

    if (isNaN(couponId)) {
      return res.status(400).json({ error: 'Invalid coupon ID' });
    }

    await couponService.deleteCoupon(couponId);

    res.json({
      success: true,
      message: 'Coupon deactivated successfully',
    });
  } catch (error: any) {
    logger.error('Error deleting coupon:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/coupons/validate
 * Validate coupon code for cart (Customer)
 */
export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, cart_items } = req.body;
    const userId = req.user!.userId;

    if (!code || !cart_items || !Array.isArray(cart_items)) {
      return res.status(400).json({
        error: 'code and cart_items are required',
      });
    }

    const result = await couponService.validateCoupon(code, userId, cart_items);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.json({
      success: true,
      message: result.message,
      coupon: {
        id: result.coupon!.id,
        code: result.coupon!.code,
        description: result.coupon!.description,
        discount_type: result.coupon!.discount_type,
        discount_value: result.coupon!.discount_value,
      },
      discount_amount: result.discountAmount,
    });
  } catch (error: any) {
    logger.error('Error validating coupon:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/coupons/:id/stats
 * Get coupon usage statistics (Admin only)
 */
export const getCouponStats = async (req: Request, res: Response) => {
  try {
    const couponId = parseInt(req.params.id);

    if (isNaN(couponId)) {
      return res.status(400).json({ error: 'Invalid coupon ID' });
    }

    const stats = await couponService.getCouponUsageStats(couponId);

    res.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    logger.error('Error getting coupon stats:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/coupons/my-usage
 * Get user's coupon usage history (Customer)
 */
export const getMyUsage = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const usages = await couponService.getUserCouponUsage(userId);

    res.json({
      success: true,
      usages,
    });
  } catch (error: any) {
    logger.error('Error getting user coupon usage:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/coupons/generate-code
 * Generate random coupon code (Admin only)
 */
export const generateCode = async (req: Request, res: Response) => {
  try {
    const { prefix, length } = req.body;

    const code = couponService.generateCouponCode(prefix, length);

    res.json({
      success: true,
      code,
    });
  } catch (error: any) {
    logger.error('Error generating coupon code:', error);
    res.status(500).json({ error: error.message });
  }
};
