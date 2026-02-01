import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Validation schema for creating a category
 */
const categorySchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Category name is required',
    'string.min': 'Category name must be at least 1 character',
    'string.max': 'Category name must not exceed 100 characters',
  }),
  slug: Joi.string().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100).optional().messages({
    'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
    'string.max': 'Slug must not exceed 100 characters',
  }),
  description: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Description must be a string',
  }),
  parent_id: Joi.number().integer().positive().optional().allow(null).messages({
    'number.base': 'Parent ID must be a number',
    'number.integer': 'Parent ID must be an integer',
    'number.positive': 'Parent ID must be positive',
  }),
  image_url: Joi.string().uri().max(500).optional().allow(null, '').messages({
    'string.uri': 'Image URL must be a valid URI',
    'string.max': 'Image URL must not exceed 500 characters',
  }),
  display_order: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'Display order must be a number',
    'number.integer': 'Display order must be an integer',
    'number.min': 'Display order cannot be negative',
  }),
  is_active: Joi.boolean().default(true).messages({
    'boolean.base': 'is_active must be a boolean',
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
 * Validation schema for updating a category
 * All fields are optional
 */
const categoryUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional().messages({
    'string.empty': 'Category name cannot be empty',
    'string.min': 'Category name must be at least 1 character',
    'string.max': 'Category name must not exceed 100 characters',
  }),
  slug: Joi.string().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100).optional().messages({
    'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
    'string.max': 'Slug must not exceed 100 characters',
  }),
  description: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Description must be a string',
  }),
  parent_id: Joi.number().integer().positive().optional().allow(null).messages({
    'number.base': 'Parent ID must be a number',
    'number.integer': 'Parent ID must be an integer',
    'number.positive': 'Parent ID must be positive',
  }),
  image_url: Joi.string().uri().max(500).optional().allow(null, '').messages({
    'string.uri': 'Image URL must be a valid URI',
    'string.max': 'Image URL must not exceed 500 characters',
  }),
  display_order: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Display order must be a number',
    'number.integer': 'Display order must be an integer',
    'number.min': 'Display order cannot be negative',
  }),
  is_active: Joi.boolean().optional().messages({
    'boolean.base': 'is_active must be a boolean',
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
 * Middleware to validate category creation
 */
export const validateCategory = (req: Request, res: Response, next: NextFunction): any => {
  const { error, value } = categorySchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    logger.warn('Category validation failed:', errors);

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
 * Middleware to validate category update
 */
export const validateCategoryUpdate = (req: Request, res: Response, next: NextFunction): any => {
  const { error, value } = categoryUpdateSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    logger.warn('Category update validation failed:', errors);

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req.body = value;
  next();
};
