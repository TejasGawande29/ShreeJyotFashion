/**
 * Cart Routes
 * API routes for cart management
 */

import { Router } from 'express';
import cartController from '../controllers/cartController';
import { authenticate } from '../middlewares/authMiddleware';
import {
  validateAddToCart,
  validateUpdateCartItem,
  validateMergeCart,
} from '../validators/cartValidator';

const router = Router();

/**
 * All cart routes require authentication
 */

// Get cart count (before :id route to avoid conflict)
router.get('/count', authenticate, cartController.getCartCount);

// Validate cart
router.get('/validate', authenticate, cartController.validateCart);

// Get user's cart
router.get('/', authenticate, cartController.getCart);

// Add item to cart
router.post('/', authenticate, validateAddToCart, cartController.addToCart);

// Merge guest cart with user cart
router.post('/merge', authenticate, validateMergeCart, cartController.mergeCart);

// Update cart item quantity
router.put('/:id', authenticate, validateUpdateCartItem, cartController.updateCartItem);

// Remove item from cart
router.delete('/:id', authenticate, cartController.removeFromCart);

// Clear entire cart
router.delete('/', authenticate, cartController.clearCart);

export default router;
