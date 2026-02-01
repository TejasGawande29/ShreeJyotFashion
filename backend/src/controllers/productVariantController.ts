import { Request, Response } from 'express';
import * as variantService from '../services/productVariantService';
import logger from '../utils/logger';

/**
 * Get all variants for a product
 * GET /api/products/:productId/variants
 * Public access
 */
export const getProductVariants = async (req: Request, res: Response): Promise<any> => {
  try {
    const productId = Number(req.params.productId);

    const variants = await variantService.getProductVariants(productId);

    return res.status(200).json({
      success: true,
      message: 'Product variants retrieved successfully',
      data: variants,
    });
  } catch (error: any) {
    logger.error('Error in getProductVariants:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve product variants',
      error: error.message,
    });
  }
};

/**
 * Get a single variant by ID
 * GET /api/products/:productId/variants/:id
 * Public access
 */
export const getVariant = async (req: Request, res: Response): Promise<any> => {
  try {
    const variantId = Number(req.params.id);

    const variant = await variantService.getVariantById(variantId);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Variant not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Variant retrieved successfully',
      data: variant,
    });
  } catch (error: any) {
    logger.error('Error in getVariant:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve variant',
      error: error.message,
    });
  }
};

/**
 * Create a new product variant
 * POST /api/products/:productId/variants
 * Admin only
 */
export const createVariant = async (req: Request, res: Response): Promise<any> => {
  try {
    const productId = Number(req.params.productId);
    const variantData = { ...req.body, product_id: productId };

    const variant = await variantService.createVariant(variantData);

    return res.status(201).json({
      success: true,
      message: 'Variant created successfully',
      data: variant,
    });
  } catch (error: any) {
    logger.error('Error in createVariant:', error);

    if (error.message.includes('already exists') || error.message.includes('not found')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create variant',
      error: error.message,
    });
  }
};

/**
 * Update a product variant
 * PUT /api/products/:productId/variants/:id
 * Admin only
 */
export const updateVariant = async (req: Request, res: Response): Promise<any> => {
  try {
    const variantId = Number(req.params.id);
    const updateData = req.body;

    const variant = await variantService.updateVariant(variantId, updateData);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Variant not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Variant updated successfully',
      data: variant,
    });
  } catch (error: any) {
    logger.error('Error in updateVariant:', error);

    if (error.message.includes('already exists')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update variant',
      error: error.message,
    });
  }
};

/**
 * Delete a product variant
 * DELETE /api/products/:productId/variants/:id
 * Admin only
 */
export const deleteVariant = async (req: Request, res: Response): Promise<any> => {
  try {
    const variantId = Number(req.params.id);

    const success = await variantService.deleteVariant(variantId);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Variant not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Variant deleted successfully',
    });
  } catch (error: any) {
    logger.error('Error in deleteVariant:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete variant',
      error: error.message,
    });
  }
};

/**
 * Reserve stock for a variant
 * POST /api/products/:productId/variants/:id/reserve
 * Admin only
 */
export const reserveStock = async (req: Request, res: Response): Promise<any> => {
  try {
    const variantId = Number(req.params.id);
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required',
      });
    }

    const variant = await variantService.reserveVariantStock(variantId, quantity);

    return res.status(200).json({
      success: true,
      message: 'Stock reserved successfully',
      data: variant,
    });
  } catch (error: any) {
    logger.error('Error in reserveStock:', error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Release reserved stock for a variant
 * POST /api/products/:productId/variants/:id/release
 * Admin only
 */
export const releaseStock = async (req: Request, res: Response): Promise<any> => {
  try {
    const variantId = Number(req.params.id);
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required',
      });
    }

    const variant = await variantService.releaseVariantStock(variantId, quantity);

    return res.status(200).json({
      success: true,
      message: 'Stock released successfully',
      data: variant,
    });
  } catch (error: any) {
    logger.error('Error in releaseStock:', error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Add stock to a variant
 * POST /api/products/:productId/variants/:id/add-stock
 * Admin only
 */
export const addStock = async (req: Request, res: Response): Promise<any> => {
  try {
    const variantId = Number(req.params.id);
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required',
      });
    }

    const variant = await variantService.addVariantStock(variantId, quantity);

    return res.status(200).json({
      success: true,
      message: 'Stock added successfully',
      data: variant,
    });
  } catch (error: any) {
    logger.error('Error in addStock:', error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Reduce stock from a variant
 * POST /api/products/:productId/variants/:id/reduce-stock
 * Admin only
 */
export const reduceStock = async (req: Request, res: Response): Promise<any> => {
  try {
    const variantId = Number(req.params.id);
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required',
      });
    }

    const variant = await variantService.reduceVariantStock(variantId, quantity);

    return res.status(200).json({
      success: true,
      message: 'Stock reduced successfully',
      data: variant,
    });
  } catch (error: any) {
    logger.error('Error in reduceStock:', error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
