/**
 * Cart Validators
 * Input validation for cart operations using Joi
 */

import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Add to cart validation schema
const addToCartSchema = Joi.object({
  product_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Product ID must be a number',
    'number.positive': 'Product ID must be positive',
    'any.required': 'Product ID is required',
  }),
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

// Update cart item validation schema
const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).max(99).required().messages({
    'number.base': 'Quantity must be a number',
    'number.min': 'Quantity must be at least 1',
    'number.max': 'Quantity cannot exceed 99',
    'any.required': 'Quantity is required',
  }),
});

// Merge cart validation schema
const mergeCartSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.number().integer().positive().required(),
        variant_id: Joi.number().integer().positive().allow(null).optional(),
        quantity: Joi.number().integer().min(1).max(99).required(),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one item is required',
      'any.required': 'Cart items are required',
    }),
});

/**
 * Validate add to cart request
 */
export const validateAddToCart = (req: Request, res: Response, next: NextFunction): any => {
  const { error, value } = addToCartSchema.validate(req.body, {
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
 * Validate update cart item request
 */
export const validateUpdateCartItem = (req: Request, res: Response, next: NextFunction): any => {
  const { error, value } = updateCartItemSchema.validate(req.body, {
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
 * Validate merge cart request
 */
export const validateMergeCart = (req: Request, res: Response, next: NextFunction): any => {
  const { error, value } = mergeCartSchema.validate(req.body, {
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
