import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

/**
 * Validation schema for creating a product image
 */
const createImageSchema = Joi.object({
  image_url: Joi.string().uri().trim().required().messages({
    'string.uri': 'image_url must be a valid URL',
    'any.required': 'image_url is required',
  }),
  image_type: Joi.string()
    .valid('primary', 'gallery', 'thumbnail')
    .default('gallery')
    .messages({
      'any.only': 'image_type must be one of: primary, gallery, thumbnail',
    }),
  alt_text: Joi.string().trim().max(255).optional().allow(null, ''),
  display_order: Joi.number().integer().min(0).optional(),
  is_primary: Joi.boolean().default(false),
});

/**
 * Validation schema for updating a product image
 */
const updateImageSchema = Joi.object({
  image_url: Joi.string().uri().trim().optional().messages({
    'string.uri': 'image_url must be a valid URL',
  }),
  image_type: Joi.string()
    .valid('primary', 'gallery', 'thumbnail')
    .optional()
    .messages({
      'any.only': 'image_type must be one of: primary, gallery, thumbnail',
    }),
  alt_text: Joi.string().trim().max(255).optional().allow(null, ''),
  display_order: Joi.number().integer().min(0).optional(),
  is_primary: Joi.boolean().optional(),
}).min(1);

/**
 * Validation schema for reordering images
 */
const reorderImagesSchema = Joi.object({
  imageOrders: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().required(),
        display_order: Joi.number().integer().min(0).required(),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'imageOrders must contain at least one image',
      'any.required': 'imageOrders is required',
    }),
});

/**
 * Middleware to validate product image creation
 */
export const validateImage = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const { error } = createImageSchema.validate(req.body, {
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
 * Middleware to validate product image update
 */
export const validateImageUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const { error } = updateImageSchema.validate(req.body, {
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
 * Middleware to validate image reordering
 */
export const validateReorderImages = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const { error } = reorderImagesSchema.validate(req.body, {
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
