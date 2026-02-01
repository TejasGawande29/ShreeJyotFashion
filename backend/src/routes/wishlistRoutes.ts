/**
 * Wishlist Routes
 * API routes for wishlist management
 */

import { Router } from 'express';
import wishlistController from '../controllers/wishlistController';
import { authenticate } from '../middlewares/authMiddleware';
import {
  validateAddToWishlist,
  validateMoveToCart,
} from '../validators/wishlistValidator';

const router = Router();

/**
 * All wishlist routes require authentication
 */

// Get wishlist count (before :id route to avoid conflict)
router.get('/count', authenticate, wishlistController.getWishlistCount);

// Check if product is in wishlist
router.get('/check/:productId', authenticate, wishlistController.checkWishlist);

// Get user's wishlist
router.get('/', authenticate, wishlistController.getWishlist);

// Add product to wishlist
router.post('/', authenticate, validateAddToWishlist, wishlistController.addToWishlist);

// Move wishlist item to cart
router.post('/:id/move-to-cart', authenticate, validateMoveToCart, wishlistController.moveToCart);

// Remove item from wishlist by wishlist item ID
router.delete('/:id', authenticate, wishlistController.removeFromWishlist);

// Remove item from wishlist by product ID
router.delete('/product/:productId', authenticate, wishlistController.removeByProductId);

// Clear entire wishlist
router.delete('/', authenticate, wishlistController.clearWishlist);

export default router;
