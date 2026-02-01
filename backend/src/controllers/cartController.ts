/**
 * Cart Controller
 * Handle HTTP requests for cart operations
 */

import { Request, Response } from 'express';
import cartService from '../services/cartService';
import logger from '../utils/logger';

class CartController {
  /**
   * Get user's cart
   * GET /api/cart
   */
  async getCart(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const cart = await cartService.getUserCart(userId);

      res.status(200).json({
        success: true,
        message: 'Cart retrieved successfully',
        data: cart,
      });
    } catch (error: any) {
      logger.error('Error fetching cart:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cart',
        error: error.message,
      });
    }
  }

  /**
   * Add item to cart
   * POST /api/cart
   * Body: { product_id, variant_id?, quantity }
   */
  async addToCart(req: Request, res: Response): Promise<any> {
    try {
      const userId = (req as any).user.userId;
      const { product_id, variant_id, quantity } = req.body;

      const result = await cartService.addToCart(userId, product_id, variant_id || null, quantity);

      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          cartItem: result.cartItem,
          action: result.action,
        },
      });
    } catch (error: any) {
      logger.error('Error adding to cart:', error);
      
      if (error.message.includes('not found') || error.message.includes('available')) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to add item to cart',
        error: error.message,
      });
    }
  }

  /**
   * Update cart item quantity
   * PUT /api/cart/:id
   * Body: { quantity }
   */
  async updateCartItem(req: Request, res: Response): Promise<any> {
    try {
      const userId = (req as any).user.userId;
      const cartItemId = parseInt(req.params.id);
      const { quantity } = req.body;

      const result = await cartService.updateCartItem(cartItemId, userId, quantity);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          cartItem: result.cartItem,
        },
      });
    } catch (error: any) {
      logger.error('Error updating cart item:', error);
      
      if (error.message.includes('not found') || error.message.includes('available')) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update cart item',
        error: error.message,
      });
    }
  }

  /**
   * Remove item from cart
   * DELETE /api/cart/:id
   */
  async removeFromCart(req: Request, res: Response): Promise<any> {
    try {
      const userId = (req as any).user.userId;
      const cartItemId = parseInt(req.params.id);

      const result = await cartService.removeFromCart(cartItemId, userId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      logger.error('Error removing from cart:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to remove item from cart',
        error: error.message,
      });
    }
  }

  /**
   * Clear entire cart
   * DELETE /api/cart
   */
  async clearCart(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const result = await cartService.clearCart(userId);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          deletedCount: result.deletedCount,
        },
      });
    } catch (error: any) {
      logger.error('Error clearing cart:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clear cart',
        error: error.message,
      });
    }
  }

  /**
   * Get cart count
   * GET /api/cart/count
   */
  async getCartCount(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const count = await cartService.getCartCount(userId);

      res.status(200).json({
        success: true,
        data: count,
      });
    } catch (error: any) {
      logger.error('Error fetching cart count:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cart count',
        error: error.message,
      });
    }
  }

  /**
   * Merge guest cart with user cart
   * POST /api/cart/merge
   * Body: { items: [{ product_id, variant_id?, quantity }] }
   */
  async mergeCart(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { items } = req.body;

      const result = await cartService.mergeCart(userId, items);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          merged_items: result.merged_items,
        },
      });
    } catch (error: any) {
      logger.error('Error merging cart:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to merge cart',
        error: error.message,
      });
    }
  }

  /**
   * Validate cart before checkout
   * GET /api/cart/validate
   */
  async validateCart(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const validation = await cartService.validateCart(userId);

      res.status(200).json({
        success: true,
        data: validation,
      });
    } catch (error: any) {
      logger.error('Error validating cart:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to validate cart',
        error: error.message,
      });
    }
  }
}

export default new CartController();
