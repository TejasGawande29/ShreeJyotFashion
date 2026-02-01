import Review from '../models/Review';
import ReviewHelpful from '../models/ReviewHelpful';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import Product from '../models/Product';
import User from '../models/User';
import { Op } from 'sequelize';
import logger from '../utils/logger';

/**
 * Create a new review
 */
export const createReview = async (
  productId: number,
  userId: number,
  rating: number,
  title?: string,
  comment?: string,
  images?: string[],
  orderId?: number
): Promise<Review> => {
  try {
    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check for verified purchase if orderId provided
    let isVerifiedPurchase = false;
    if (orderId) {
      const orderItem = await OrderItem.findOne({
        include: [{
          model: Order,
          as: 'order',
          where: {
            id: orderId,
            user_id: userId,
            status: { [Op.in]: ['delivered', 'completed'] }
          }
        }],
        where: { product_id: productId }
      });
      
      if (orderItem) {
        isVerifiedPurchase = true;
      }
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      where: {
        product_id: productId,
        user_id: userId,
        is_deleted: false
      }
    });

    if (existingReview) {
      throw new Error('You have already reviewed this product');
    }

    // Create review
    const review = await Review.create({
      product_id: productId,
      user_id: userId,
      order_id: orderId,
      rating,
      title,
      comment,
      images: images || [],
      is_verified_purchase: isVerifiedPurchase,
      is_approved: false, // Requires admin approval
      helpful_count: 0,
      is_deleted: false,
      reviewed_at: new Date(),
    });

    logger.info('Review created:', { reviewId: review.id, productId, userId });
    
    return review;
  } catch (error: any) {
    logger.error('Error creating review:', error);
    throw new Error(`Failed to create review: ${error.message}`);
  }
};

/**
 * Get reviews for a product
 */
export const getProductReviews = async (
  productId: number,
  options: {
    includeUnapproved?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: 'recent' | 'rating_high' | 'rating_low' | 'helpful';
  } = {}
): Promise<{ reviews: Review[]; total: number; averageRating: number }> => {
  try {
    const {
      includeUnapproved = false,
      limit = 10,
      offset = 0,
      sortBy = 'recent'
    } = options;

    // Build where clause
    const whereClause: any = {
      product_id: productId,
      is_deleted: false,
    };

    if (!includeUnapproved) {
      whereClause.is_approved = true;
    }

    // Determine sort order
    let order: any = [['reviewed_at', 'DESC']];
    switch (sortBy) {
      case 'rating_high':
        order = [['rating', 'DESC'], ['reviewed_at', 'DESC']];
        break;
      case 'rating_low':
        order = [['rating', 'ASC'], ['reviewed_at', 'DESC']];
        break;
      case 'helpful':
        order = [['helpful_count', 'DESC'], ['reviewed_at', 'DESC']];
        break;
    }

    // Get reviews
    const { rows: reviews, count: total } = await Review.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name']
        }
      ],
      order,
      limit,
      offset,
    });

    // Calculate average rating
    const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = total > 0 ? ratingSum / total : 0;

    return { reviews, total, averageRating };
  } catch (error: any) {
    logger.error('Error getting product reviews:', error);
    throw new Error(`Failed to get reviews: ${error.message}`);
  }
};

/**
 * Get single review by ID
 */
export const getReviewById = async (reviewId: number): Promise<Review | null> => {
  try {
    const review = await Review.findOne({
      where: { id: reviewId, is_deleted: false },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name']
        }
      ]
    });
    
    return review;
  } catch (error: any) {
    logger.error('Error getting review:', error);
    throw new Error(`Failed to get review: ${error.message}`);
  }
};

/**
 * Update a review
 */
export const updateReview = async (
  reviewId: number,
  userId: number,
  updates: {
    rating?: number;
    title?: string;
    comment?: string;
    images?: string[];
  }
): Promise<Review> => {
  try {
    const review = await Review.findOne({
      where: { id: reviewId, user_id: userId, is_deleted: false }
    });

    if (!review) {
      throw new Error('Review not found or access denied');
    }

    // Validate rating if provided
    if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Update review
    if (updates.rating !== undefined) review.rating = updates.rating;
    if (updates.title !== undefined) review.title = updates.title;
    if (updates.comment !== undefined) review.comment = updates.comment;
    if (updates.images !== undefined) review.images = updates.images;
    
    review.is_approved = false; // Reset approval status on edit

    await review.save();

    logger.info('Review updated:', { reviewId, userId });
    
    return review;
  } catch (error: any) {
    logger.error('Error updating review:', error);
    throw new Error(`Failed to update review: ${error.message}`);
  }
};

/**
 * Delete a review (soft delete)
 */
export const deleteReview = async (reviewId: number, userId: number): Promise<void> => {
  try {
    const review = await Review.findOne({
      where: { id: reviewId, user_id: userId, is_deleted: false }
    });

    if (!review) {
      throw new Error('Review not found or access denied');
    }

    review.is_deleted = true;
    await review.save();

    logger.info('Review deleted:', { reviewId, userId });
  } catch (error: any) {
    logger.error('Error deleting review:', error);
    throw new Error(`Failed to delete review: ${error.message}`);
  }
};

/**
 * Approve/reject review (Admin only)
 */
export const moderateReview = async (
  reviewId: number,
  isApproved: boolean
): Promise<Review> => {
  try {
    const review = await Review.findOne({
      where: { id: reviewId, is_deleted: false }
    });

    if (!review) {
      throw new Error('Review not found');
    }

    review.is_approved = isApproved;
    await review.save();

    logger.info('Review moderated:', { reviewId, isApproved });
    
    return review;
  } catch (error: any) {
    logger.error('Error moderating review:', error);
    throw new Error(`Failed to moderate review: ${error.message}`);
  }
};

/**
 * Mark review as helpful/not helpful
 */
export const markReviewHelpful = async (
  reviewId: number,
  userId: number,
  isHelpful: boolean
): Promise<ReviewHelpful> => {
  try {
    // Check if review exists
    const review = await Review.findOne({
      where: { id: reviewId, is_deleted: false }
    });

    if (!review) {
      throw new Error('Review not found');
    }

    // Check if user already voted
    const existingVote = await ReviewHelpful.findOne({
      where: { review_id: reviewId, user_id: userId }
    });

    if (existingVote) {
      // Update existing vote
      const oldVote = existingVote.is_helpful;
      existingVote.is_helpful = isHelpful;
      await existingVote.save();

      // Update helpful count
      if (oldVote !== isHelpful) {
        review.helpful_count = (review.helpful_count || 0) + (isHelpful ? 2 : -2);
        await review.save();
      }

      return existingVote;
    }

    // Create new vote
    const vote = await ReviewHelpful.create({
      review_id: reviewId,
      user_id: userId,
      is_helpful: isHelpful,
    });

    // Update helpful count
    review.helpful_count = (review.helpful_count || 0) + (isHelpful ? 1 : -1);
    await review.save();

    logger.info('Review vote recorded:', { reviewId, userId, isHelpful });
    
    return vote;
  } catch (error: any) {
    logger.error('Error marking review helpful:', error);
    throw new Error(`Failed to mark review helpful: ${error.message}`);
  }
};

/**
 * Get user's review for a product
 */
export const getUserProductReview = async (
  productId: number,
  userId: number
): Promise<Review | null> => {
  try {
    const review = await Review.findOne({
      where: {
        product_id: productId,
        user_id: userId,
        is_deleted: false
      }
    });
    
    return review;
  } catch (error: any) {
    logger.error('Error getting user review:', error);
    throw new Error(`Failed to get review: ${error.message}`);
  }
};

/**
 * Get all reviews (Admin only)
 */
export const getAllReviews = async (options: {
  status?: 'all' | 'approved' | 'pending' | 'rejected';
  limit?: number;
  offset?: number;
}): Promise<{ reviews: Review[]; total: number }> => {
  try {
    const { status = 'all', limit = 20, offset = 0 } = options;

    const whereClause: any = { is_deleted: false };

    switch (status) {
      case 'approved':
        whereClause.is_approved = true;
        break;
      case 'pending':
        whereClause.is_approved = false;
        break;
      case 'rejected':
        whereClause.is_approved = false;
        break;
    }

    const { rows: reviews, count: total } = await Review.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name']
        }
      ],
      order: [['reviewed_at', 'DESC']],
      limit,
      offset,
    });

    return { reviews, total };
  } catch (error: any) {
    logger.error('Error getting all reviews:', error);
    throw new Error(`Failed to get reviews: ${error.message}`);
  }
};

/**
 * Get review statistics for a product
 */
export const getProductReviewStats = async (productId: number): Promise<{
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}> => {
  try {
    const reviews = await Review.findAll({
      where: {
        product_id: productId,
        is_approved: true,
        is_deleted: false
      },
      attributes: ['rating']
    });

    const totalReviews = reviews.length;
    const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalReviews > 0 ? ratingSum / totalReviews : 0;

    // Calculate rating distribution
    const ratingDistribution: { [key: number]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };

    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    return { totalReviews, averageRating, ratingDistribution };
  } catch (error: any) {
    logger.error('Error getting review stats:', error);
    throw new Error(`Failed to get review stats: ${error.message}`);
  }
};
