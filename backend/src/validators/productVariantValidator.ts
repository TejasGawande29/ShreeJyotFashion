import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

/**
 * Validation schema for creating a product variant
 */
const createVariantSchema = Joi.object({
  size: Joi.string().trim().optional().allow(null, ''),
  color: Joi.string().trim().optional().allow(null, ''),
  color_code: Joi.string()
    .trim()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'color_code must be a valid hex color (e.g., #FF5733)',
    }),
  stock_quantity: Joi.number().integer().min(0).default(0),
  stock_allocated: Joi.number().integer().min(0).default(0),
  sku_variant: Joi.string().trim().optional().allow(null, ''),
  is_active: Joi.boolean().default(true),
}).min(1);

/**
 * Validation schema for updating a product variant
 */
const updateVariantSchema = Joi.object({
  size: Joi.string().trim().optional().allow(null, ''),
  color: Joi.string().trim().optional().allow(null, ''),
  color_code: Joi.string()
    .trim()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'color_code must be a valid hex color (e.g., #FF5733)',
    }),
  stock_quantity: Joi.number().integer().min(0).optional(),
  stock_allocated: Joi.number().integer().min(0).optional(),
  sku_variant: Joi.string().trim().optional().allow(null, ''),
  is_active: Joi.boolean().optional(),
}).min(1);

/**
 * Validation schema for stock quantity operations
 */
const stockQuantitySchema = Joi.object({
  quantity: Joi.number().integer().min(1).required().messages({
    'number.min': 'Quantity must be at least 1',
    'any.required': 'Quantity is required',
  }),
});

/**
 * Middleware to validate product variant creation
 */
export const validateVariant = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const { error } = createVariantSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

/**
 * Middleware to validate product variant update
 */
export const validateVariantUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const { error } = updateVariantSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

/**
 * Middleware to validate stock quantity operations
 */
export const validateStockQuantity = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const { error } = stockQuantitySchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};
