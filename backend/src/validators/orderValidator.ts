/**
 * Order Validators
 * Joi validation schemas for order operations
 */

import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Shipping address schema
const shippingAddressSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 100 characters',
  }),
  email: Joi.string().email().max(100).required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email',
  }),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
    'string.empty': 'Phone number is required',
    'string.pattern.base': 'Please provide a valid phone number (10-15 digits)',
  }),
  address_line1: Joi.string().min(5).max(200).required().messages({
    'string.empty': 'Address line 1 is required',
    'string.min': 'Address must be at least 5 characters',
  }),
  address_line2: Joi.string().max(200).optional().allow(''),
  city: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'City is required',
  }),
  state: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'State is required',
  }),
  postal_code: Joi.string().min(4).max(20).required().messages({
    'string.empty': 'Postal code is required',
  }),
  country: Joi.string().max(100).optional().default('India'),
});

// Create order validation
const createOrderSchema = Joi.object({
  shipping_address: shippingAddressSchema.required().messages({
    'any.required': 'Shipping address is required',
  }),
  billing_address: shippingAddressSchema.optional(),
  payment_method: Joi.string().valid('cod', 'razorpay', 'card', 'upi', 'wallet').optional().messages({
    'any.only': 'Invalid payment method',
  }),
  notes: Joi.string().max(500).optional().allow(''),
});

// Update order status validation
const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')
    .required()
    .messages({
      'any.only': 'Invalid order status',
      'any.required': 'Status is required',
    }),
  tracking_number: Joi.string().max(100).optional().allow(''),
});

// Get orders query validation
const getOrdersQuerySchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')
    .optional(),
  payment_status: Joi.string().valid('pending', 'paid', 'failed', 'refunded').optional(),
  user_id: Joi.number().integer().positive().optional(),
  from_date: Joi.date().iso().optional(),
  to_date: Joi.date().iso().min(Joi.ref('from_date')).optional(),
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(20),
});

/**
 * Validate create order request
 */
export const validateCreateOrder = (req: Request, res: Response, next: NextFunction): any => {
  const { error } = createOrderSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors,
    });
  }

  next();
};

/**
 * Validate update order status request
 */
export const validateUpdateOrderStatus = (req: Request, res: Response, next: NextFunction): any => {
  const { error } = updateOrderStatusSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors,
    });
  }

  next();
};

/**
 * Validate get orders query parameters
 */
export const validateGetOrdersQuery = (req: Request, res: Response, next: NextFunction): any => {
  const { error, value } = getOrdersQuerySchema.validate(req.query, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors,
    });
  }

  // Store validated values in req.body or res.locals instead of replacing req.query
  res.locals.validatedQuery = value;
  next();
};
