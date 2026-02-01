import { Request, Response } from 'express';
import * as reviewService from '../services/reviewService';
import logger from '../utils/logger';

/**
 * POST /api/reviews
 * Create a new review
 */
export const createReview = async (req: Request, res: Response) => {
  try {
    const {
      product_id,
      rating,
      title,
      comment,
      images,
      order_id
    } = req.body;
    
    const userId = req.user!.userId;

    // Validation
    if (!product_id || !rating) {
      return res.status(400).json({ error: 'product_id and rating are required' });
    }

    const review = await reviewService.createReview(
      product_id,
      userId,
      rating,
      title,
      comment,
      images,
      order_id
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. It will be visible after admin approval.',
      review
    });
  } catch (error: any) {
    logger.error('Error creating review:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/reviews/product/:productId
 * Get all reviews for a product
 */
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId);
    const {
      page = '1',
      limit = '10',
      sort = 'recent'
    } = req.query;

    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const result = await reviewService.getProductReviews(productId, {
      limit: parseInt(limit as string),
      offset,
      sortBy: sort as any,
      includeUnapproved: false
    });

    res.json({
      success: true,
      ...result,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(result.total / parseInt(limit as string))
    });
  } catch (error: any) {
    logger.error('Error getting product reviews:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/reviews/product/:productId/stats
 * Get review statistics for a product
 */
export const getProductReviewStats = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId);

    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const stats = await reviewService.getProductReviewStats(productId);

    res.json({
      success: true,
      ...stats
    });
  } catch (error: any) {
    logger.error('Error getting review stats:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/reviews/:id
 * Get single review by ID
 */
export const getReviewById = async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id);

    if (isNaN(reviewId)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    const review = await reviewService.getReviewById(reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ success: true, review });
  } catch (error: any) {
    logger.error('Error getting review:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/reviews/my-review/:productId
 * Get user's own review for a product
 */
export const getMyProductReview = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId);
    const userId = req.user!.userId;

    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const review = await reviewService.getUserProductReview(productId, userId);

    res.json({ success: true, review });
  } catch (error: any) {
    logger.error('Error getting user review:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * PUT /api/reviews/:id
 * Update a review
 */
export const updateReview = async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id);
    const userId = req.user!.userId;
    const { rating, title, comment, images } = req.body;

    if (isNaN(reviewId)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    const review = await reviewService.updateReview(reviewId, userId, {
      rating,
      title,
      comment,
      images
    });

    res.json({
      success: true,
      message: 'Review updated successfully. It will require re-approval.',
      review
    });
  } catch (error: any) {
    logger.error('Error updating review:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE /api/reviews/:id
 * Delete a review
 */
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id);
    const userId = req.user!.userId;

    if (isNaN(reviewId)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    await reviewService.deleteReview(reviewId, userId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error: any) {
    logger.error('Error deleting review:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/reviews/:id/helpful
 * Mark review as helpful/not helpful
 */
export const markHelpful = async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id);
    const userId = req.user!.userId;
    const { is_helpful } = req.body;

    if (isNaN(reviewId)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    if (typeof is_helpful !== 'boolean') {
      return res.status(400).json({ error: 'is_helpful must be a boolean' });
    }

    await reviewService.markReviewHelpful(reviewId, userId, is_helpful);

    res.json({
      success: true,
      message: 'Vote recorded successfully'
    });
  } catch (error: any) {
    logger.error('Error marking review helpful:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/reviews/admin/all
 * Get all reviews (Admin only)
 */
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const {
      status = 'all',
      page = '1',
      limit = '20'
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const result = await reviewService.getAllReviews({
      status: status as any,
      limit: parseInt(limit as string),
      offset
    });

    res.json({
      success: true,
      ...result,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(result.total / parseInt(limit as string))
    });
  } catch (error: any) {
    logger.error('Error getting all reviews:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * PUT /api/reviews/admin/:id/moderate
 * Approve or reject a review (Admin only)
 */
export const moderateReview = async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id);
    const { is_approved } = req.body;

    if (isNaN(reviewId)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    if (typeof is_approved !== 'boolean') {
      return res.status(400).json({ error: 'is_approved must be a boolean' });
    }

    const review = await reviewService.moderateReview(reviewId, is_approved);

    res.json({
      success: true,
      message: `Review ${is_approved ? 'approved' : 'rejected'} successfully`,
      review
    });
  } catch (error: any) {
    logger.error('Error moderating review:', error);
    res.status(500).json({ error: error.message });
  }
};
