import { Request, Response } from 'express';
import * as imageService from '../services/productImageService';
import logger from '../utils/logger';

/**
 * Get all images for a product
 * GET /api/products/:productId/images
 * Public access
 */
export const getProductImages = async (req: Request, res: Response): Promise<any> => {
  try {
    const productId = Number(req.params.productId);

    const images = await imageService.getProductImages(productId);

    return res.status(200).json({
      success: true,
      message: 'Product images retrieved successfully',
      data: images,
    });
  } catch (error: any) {
    logger.error('Error in getProductImages:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve product images',
      error: error.message,
    });
  }
};

/**
 * Get a single image by ID
 * GET /api/products/:productId/images/:id
 * Public access
 */
export const getImage = async (req: Request, res: Response): Promise<any> => {
  try {
    const imageId = Number(req.params.id);

    const image = await imageService.getImageById(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Image retrieved successfully',
      data: image,
    });
  } catch (error: any) {
    logger.error('Error in getImage:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve image',
      error: error.message,
    });
  }
};

/**
 * Create a new product image
 * POST /api/products/:productId/images
 * Admin only
 */
export const createImage = async (req: Request, res: Response): Promise<any> => {
  try {
    const productId = Number(req.params.productId);
    const imageData = { ...req.body, product_id: productId };

    const image = await imageService.createImage(imageData);

    return res.status(201).json({
      success: true,
      message: 'Image created successfully',
      data: image,
    });
  } catch (error: any) {
    logger.error('Error in createImage:', error);

    if (error.message.includes('not found')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create image',
      error: error.message,
    });
  }
};

/**
 * Update a product image
 * PUT /api/products/:productId/images/:id
 * Admin only
 */
export const updateImage = async (req: Request, res: Response): Promise<any> => {
  try {
    const imageId = Number(req.params.id);
    const updateData = req.body;

    const image = await imageService.updateImage(imageId, updateData);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Image updated successfully',
      data: image,
    });
  } catch (error: any) {
    logger.error('Error in updateImage:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update image',
      error: error.message,
    });
  }
};

/**
 * Delete a product image
 * DELETE /api/products/:productId/images/:id
 * Admin only
 */
export const deleteImage = async (req: Request, res: Response): Promise<any> => {
  try {
    const imageId = Number(req.params.id);

    const success = await imageService.deleteImage(imageId);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    logger.error('Error in deleteImage:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message,
    });
  }
};

/**
 * Set an image as primary
 * PUT /api/products/:productId/images/:id/set-primary
 * Admin only
 */
export const setPrimaryImage = async (req: Request, res: Response): Promise<any> => {
  try {
    const imageId = Number(req.params.id);

    const image = await imageService.setPrimaryImage(imageId);

    return res.status(200).json({
      success: true,
      message: 'Primary image set successfully',
      data: image,
    });
  } catch (error: any) {
    logger.error('Error in setPrimaryImage:', error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Reorder product images
 * PUT /api/products/:productId/images/reorder
 * Admin only
 */
export const reorderImages = async (req: Request, res: Response): Promise<any> => {
  try {
    const productId = Number(req.params.productId);
    const { imageOrders } = req.body;

    if (!Array.isArray(imageOrders)) {
      return res.status(400).json({
        success: false,
        message: 'imageOrders must be an array of { id, display_order }',
      });
    }

    const images = await imageService.reorderImages(productId, imageOrders);

    return res.status(200).json({
      success: true,
      message: 'Images reordered successfully',
      data: images,
    });
  } catch (error: any) {
    logger.error('Error in reorderImages:', error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
