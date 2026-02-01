import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Validation schema for creating a product
 */
const productSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'Product name is required',
    'string.min': 'Product name must be at least 1 character',
    'string.max': 'Product name must not exceed 255 characters',
  }),
  slug: Joi.string().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(255).optional().messages({
    'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
    'string.max': 'Slug must not exceed 255 characters',
  }),
  sku: Joi.string().max(100).optional().messages({
    'string.max': 'SKU must not exceed 100 characters',
  }),
  category_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Category ID must be a number',
    'number.integer': 'Category ID must be an integer',
    'number.positive': 'Category ID must be positive',
    'any.required': 'Category ID is required',
  }),
  brand: Joi.string().max(100).optional().allow(null, '').messages({
    'string.max': 'Brand must not exceed 100 characters',
  }),
  description: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Description must be a string',
  }),
  short_description: Joi.string().max(500).optional().allow(null, '').messages({
    'string.max': 'Short description must not exceed 500 characters',
  }),
  base_price: Joi.number().precision(2).min(0).required().messages({
    'number.base': 'Base price must be a number',
    'number.min': 'Base price cannot be negative',
    'any.required': 'Base price is required',
  }),
  sale_price: Joi.number().precision(2).min(0).optional().allow(null).messages({
    'number.base': 'Sale price must be a number',
    'number.min': 'Sale price cannot be negative',
  }),
  rental_price_per_day: Joi.number().precision(2).min(0).optional().allow(null).messages({
    'number.base': 'Rental price must be a number',
    'number.min': 'Rental price cannot be negative',
  }),
  cost_price: Joi.number().precision(2).min(0).optional().allow(null).messages({
    'number.base': 'Cost price must be a number',
    'number.min': 'Cost price cannot be negative',
  }),
  is_sale: Joi.boolean().default(false).messages({
    'boolean.base': 'is_sale must be a boolean',
  }),
  is_rental: Joi.boolean().default(false).messages({
    'boolean.base': 'is_rental must be a boolean',
  }),
  is_featured: Joi.boolean().default(false).messages({
    'boolean.base': 'is_featured must be a boolean',
  }),
  is_active: Joi.boolean().default(true).messages({
    'boolean.base': 'is_active must be a boolean',
  }),
  stock_quantity: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'Stock quantity must be a number',
    'number.integer': 'Stock quantity must be an integer',
    'number.min': 'Stock quantity cannot be negative',
  }),
  stock_allocated: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'Stock allocated must be a number',
    'number.integer': 'Stock allocated must be an integer',
    'number.min': 'Stock allocated cannot be negative',
  }),
  reorder_level: Joi.number().integer().min(0).optional().allow(null).messages({
    'number.base': 'Reorder level must be a number',
    'number.integer': 'Reorder level must be an integer',
    'number.min': 'Reorder level cannot be negative',
  }),
  weight_grams: Joi.number().min(0).optional().allow(null).messages({
    'number.base': 'Weight must be a number',
    'number.min': 'Weight cannot be negative',
  }),
  dimensions: Joi.string().max(100).optional().allow(null, '').messages({
    'string.max': 'Dimensions must not exceed 100 characters',
  }),
  material: Joi.string().max(255).optional().allow(null, '').messages({
    'string.max': 'Material must not exceed 255 characters',
  }),
  care_instructions: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Care instructions must be a string',
  }),
  meta_title: Joi.string().max(255).optional().allow(null, '').messages({
    'string.max': 'Meta title must not exceed 255 characters',
  }),
  meta_description: Joi.string().max(500).optional().allow(null, '').messages({
    'string.max': 'Meta description must not exceed 500 characters',
  }),
  meta_keywords: Joi.string().max(500).optional().allow(null, '').messages({
    'string.max': 'Meta keywords must not exceed 500 characters',
  }),
});

/**
 * Validation schema for updating a product
 * All fields are optional
 */
const productUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional().messages({
    'string.empty': 'Product name cannot be empty',
    'string.min': 'Product name must be at least 1 character',
    'string.max': 'Product name must not exceed 255 characters',
  }),
  slug: Joi.string().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(255).optional().messages({
    'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
    'string.max': 'Slug must not exceed 255 characters',
  }),
  sku: Joi.string().max(100).optional().messages({
    'string.max': 'SKU must not exceed 100 characters',
  }),
  category_id: Joi.number().integer().positive().optional().messages({
    'number.base': 'Category ID must be a number',
    'number.integer': 'Category ID must be an integer',
    'number.positive': 'Category ID must be positive',
  }),
  brand: Joi.string().max(100).optional().allow(null, '').messages({
    'string.max': 'Brand must not exceed 100 characters',
  }),
  description: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Description must be a string',
  }),
  short_description: Joi.string().max(500).optional().allow(null, '').messages({
    'string.max': 'Short description must not exceed 500 characters',
  }),
  base_price: Joi.number().precision(2).min(0).optional().messages({
    'number.base': 'Base price must be a number',
    'number.min': 'Base price cannot be negative',
  }),
  sale_price: Joi.number().precision(2).min(0).optional().allow(null).messages({
    'number.base': 'Sale price must be a number',
    'number.min': 'Sale price cannot be negative',
  }),
  rental_price_per_day: Joi.number().precision(2).min(0).optional().allow(null).messages({
    'number.base': 'Rental price must be a number',
    'number.min': 'Rental price cannot be negative',
  }),
  cost_price: Joi.number().precision(2).min(0).optional().allow(null).messages({
    'number.base': 'Cost price must be a number',
    'number.min': 'Cost price cannot be negative',
  }),
  is_sale: Joi.boolean().optional().messages({
    'boolean.base': 'is_sale must be a boolean',
  }),
  is_rental: Joi.boolean().optional().messages({
    'boolean.base': 'is_rental must be a boolean',
  }),
  is_featured: Joi.boolean().optional().messages({
    'boolean.base': 'is_featured must be a boolean',
  }),
  is_active: Joi.boolean().optional().messages({
    'boolean.base': 'is_active must be a boolean',
  }),
  stock_quantity: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Stock quantity must be a number',
    'number.integer': 'Stock quantity must be an integer',
    'number.min': 'Stock quantity cannot be negative',
  }),
  stock_allocated: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Stock allocated must be a number',
    'number.integer': 'Stock allocated must be an integer',
    'number.min': 'Stock allocated cannot be negative',
  }),
  reorder_level: Joi.number().integer().min(0).optional().allow(null).messages({
    'number.base': 'Reorder level must be a number',
    'number.integer': 'Reorder level must be an integer',
    'number.min': 'Reorder level cannot be negative',
  }),
  weight_grams: Joi.number().min(0).optional().allow(null).messages({
    'number.base': 'Weight must be a number',
    'number.min': 'Weight cannot be negative',
  }),
  dimensions: Joi.string().max(100).optional().allow(null, '').messages({
    'string.max': 'Dimensions must not exceed 100 characters',
  }),
  material: Joi.string().max(255).optional().allow(null, '').messages({
    'string.max': 'Material must not exceed 255 characters',
  }),
  care_instructions: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Care instructions must be a string',
  }),
  meta_title: Joi.string().max(255).optional().allow(null, '').messages({
    'string.max': 'Meta title must not exceed 255 characters',
  }),
  meta_description: Joi.string().max(500).optional().allow(null, '').messages({
    'string.max': 'Meta description must not exceed 500 characters',
  }),
  meta_keywords: Joi.string().max(500).optional().allow(null, '').messages({
    'string.max': 'Meta keywords must not exceed 500 characters',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

/**
 * Middleware to validate product creation
 */
export const validateProduct = (req: Request, res: Response, next: NextFunction): any => {
  const { error, value } = productSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    logger.warn('Product validation failed:', errors);

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req.body = value;
  next();
};

/**
 * Middleware to validate product update
 */
export const validateProductUpdate = (req: Request, res: Response, next: NextFunction): any => {
  const { error, value } = productUpdateSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    logger.warn('Product update validation failed:', errors);

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req.body = value;
  next();
};
