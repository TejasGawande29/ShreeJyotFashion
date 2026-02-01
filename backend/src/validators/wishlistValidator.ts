/**
 * Wishlist Validators
 * Input validation for wishlist operations using Joi
 */

import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Add to wishlist validation schema
const addToWishlistSchema = Joi.object({
  product_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Product ID must be a number',
    'number.positive': 'Product ID must be positive',
    'any.required': 'Product ID is required',
  }),
});

// Move to cart validation schema
const moveToCartSchema = Joi.object({
  variant_id: Joi.number().integer().positive().allow(null).optional().messages({
    'number.base': 'Variant ID must be a number',
    'number.positive': 'Variant ID must be positive',
  }),
  quantity: Joi.number().integer().min(1).max(99).default(1).messages({
    'number.base': 'Quantity must be a number',
    'number.min': 'Quantity must be at least 1',
    'number.max': 'Quantity cannot exceed 99',
  }),
});

/**
 * Validate add to wishlist request
 */
export const validateAddToWishlist = (req: Request, res: Response, next: NextFunction): any => {
  const { error, value } = addToWishlistSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
  }

  req.body = value;
  next();
};

/**
 * Validate move to cart request
 */
export const validateMoveToCart = (req: Request, res: Response, next: NextFunction): any => {
  const { error, value } = moveToCartSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
  }

  req.body = value;
  next();
};
