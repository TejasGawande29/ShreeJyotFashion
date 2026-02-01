/**
 * Wishlist Controller
 * Handle HTTP requests for wishlist operations
 */

import { Request, Response } from 'express';
import wishlistService from '../services/wishlistService';
import logger from '../utils/logger';

class WishlistController {
  /**
   * Get user's wishlist
   * GET /api/wishlist
   */
  async getWishlist(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const wishlist = await wishlistService.getUserWishlist(userId);

      res.status(200).json({
        success: true,
        message: 'Wishlist retrieved successfully',
        data: wishlist,
      });
    } catch (error: any) {
      logger.error('Error fetching wishlist:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch wishlist',
        error: error.message,
      });
    }
  }

  /**
   * Add product to wishlist
   * POST /api/wishlist
   * Body: { product_id }
   */
  async addToWishlist(req: Request, res: Response): Promise<any> {
    try {
      const userId = (req as any).user.userId;
      const { product_id } = req.body;

      const result = await wishlistService.addToWishlist(userId, product_id);

      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          wishlistItem: result.wishlistItem,
        },
      });
    } catch (error: any) {
      logger.error('Error adding to wishlist:', error);
      
      if (error.message.includes('not found') || error.message.includes('already in wishlist') || error.message.includes('not available')) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to add item to wishlist',
        error: error.message,
      });
    }
  }

  /**
   * Remove item from wishlist
   * DELETE /api/wishlist/:id
   */
  async removeFromWishlist(req: Request, res: Response): Promise<any> {
    try {
      const userId = (req as any).user.userId;
      const wishlistItemId = parseInt(req.params.id);

      const result = await wishlistService.removeFromWishlist(wishlistItemId, userId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      logger.error('Error removing from wishlist:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to remove item from wishlist',
        error: error.message,
      });
    }
  }

  /**
   * Remove product from wishlist by product ID
   * DELETE /api/wishlist/product/:productId
   */
  async removeByProductId(req: Request, res: Response): Promise<any> {
    try {
      const userId = (req as any).user.userId;
      const productId = parseInt(req.params.productId);

      const result = await wishlistService.removeByProductId(userId, productId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      logger.error('Error removing from wishlist by product ID:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to remove item from wishlist',
        error: error.message,
      });
    }
  }

  /**
   * Clear entire wishlist
   * DELETE /api/wishlist
   */
  async clearWishlist(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const result = await wishlistService.clearWishlist(userId);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          deletedCount: result.deletedCount,
        },
      });
    } catch (error: any) {
      logger.error('Error clearing wishlist:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clear wishlist',
        error: error.message,
      });
    }
  }

  /**
   * Move wishlist item to cart
   * POST /api/wishlist/:id/move-to-cart
   * Body: { variant_id?, quantity? }
   */
  async moveToCart(req: Request, res: Response): Promise<any> {
    try {
      const userId = (req as any).user.userId;
      const wishlistItemId = parseInt(req.params.id);
      const { variant_id, quantity } = req.body;

      const result = await wishlistService.moveToCart(
        wishlistItemId,
        userId,
        variant_id || null,
        quantity || 1
      );

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          cartItem: result.cartItem,
        },
      });
    } catch (error: any) {
      logger.error('Error moving to cart:', error);
      
      if (error.message.includes('not found') || error.message.includes('not available') || error.message.includes('available')) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to move item to cart',
        error: error.message,
      });
    }
  }

  /**
   * Check if product is in wishlist
   * GET /api/wishlist/check/:productId
   */
  async checkWishlist(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const productId = parseInt(req.params.productId);

      const result = await wishlistService.isInWishlist(userId, productId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error('Error checking wishlist:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check wishlist',
        error: error.message,
      });
    }
  }

  /**
   * Get wishlist count
   * GET /api/wishlist/count
   */
  async getWishlistCount(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const result = await wishlistService.getWishlistCount(userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error('Error fetching wishlist count:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch wishlist count',
        error: error.message,
      });
    }
  }
}

export default new WishlistController();
