/**
 * User Profile Validators
 * Joi validation schemas for profile and address management
 */

import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

/**
 * Profile update validation
 */
export const updateProfileSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name must not exceed 50 characters',
  }),
  last_name: Joi.string().min(2).max(50).messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name must not exceed 50 characters',
  }),
  date_of_birth: Joi.date().max('now').messages({
    'date.max': 'Date of birth cannot be in the future',
  }),
  gender: Joi.string().valid('male', 'female', 'other', 'prefer_not_to_say').messages({
    'any.only': 'Gender must be one of: male, female, other, prefer_not_to_say',
  }),
  bio: Joi.string().max(500).allow('').messages({
    'string.max': 'Bio must not exceed 500 characters',
  }),
  avatar_url: Joi.string().uri().allow('').messages({
    'string.uri': 'Avatar URL must be a valid URL',
  }),
  preferred_language: Joi.string().length(2).messages({
    'string.length': 'Language code must be exactly 2 characters (e.g., en, hi)',
  }),
  preferred_currency: Joi.string().length(3).messages({
    'string.length': 'Currency code must be exactly 3 characters (e.g., INR, USD)',
  }),
  notifications_email: Joi.boolean(),
  notifications_sms: Joi.boolean(),
  notifications_push: Joi.boolean(),
  marketing_emails: Joi.boolean(),
});

/**
 * Account settings update validation
 */
export const updateAccountSettingsSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Please provide a valid email address',
  }),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).messages({
    'string.pattern.base': 'Phone number must be a valid 10-digit Indian mobile number',
  }),
  current_password: Joi.string().when('new_password', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }).messages({
    'any.required': 'Current password is required to set a new password',
  }),
  new_password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

/**
 * Address creation/update validation
 */
export const addressSchema = Joi.object({
  address_type: Joi.string().valid('shipping', 'billing', 'both').required().messages({
    'any.only': 'Address type must be one of: shipping, billing, both',
    'any.required': 'Address type is required',
  }),
  recipient_name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Recipient name must be at least 2 characters long',
    'string.max': 'Recipient name must not exceed 100 characters',
    'any.required': 'Recipient name is required',
  }),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({
    'string.pattern.base': 'Phone number must be a valid 10-digit Indian mobile number',
    'any.required': 'Phone number is required',
  }),
  alternate_phone: Joi.string().pattern(/^[6-9]\d{9}$/).allow('').messages({
    'string.pattern.base': 'Alternate phone must be a valid 10-digit Indian mobile number',
  }),
  address_line1: Joi.string().min(5).max(200).required().messages({
    'string.min': 'Address line 1 must be at least 5 characters long',
    'string.max': 'Address line 1 must not exceed 200 characters',
    'any.required': 'Address line 1 is required',
  }),
  address_line2: Joi.string().max(200).allow('').messages({
    'string.max': 'Address line 2 must not exceed 200 characters',
  }),
  landmark: Joi.string().max(100).allow('').messages({
    'string.max': 'Landmark must not exceed 100 characters',
  }),
  city: Joi.string().min(2).max(100).required().messages({
    'string.min': 'City must be at least 2 characters long',
    'string.max': 'City must not exceed 100 characters',
    'any.required': 'City is required',
  }),
  state: Joi.string().min(2).max(100).required().messages({
    'string.min': 'State must be at least 2 characters long',
    'string.max': 'State must not exceed 100 characters',
    'any.required': 'State is required',
  }),
  country: Joi.string().min(2).max(100).default('India').messages({
    'string.min': 'Country must be at least 2 characters long',
    'string.max': 'Country must not exceed 100 characters',
  }),
  postal_code: Joi.string().pattern(/^\d{6}$/).required().messages({
    'string.pattern.base': 'Postal code must be a valid 6-digit Indian PIN code',
    'any.required': 'Postal code is required',
  }),
  is_default: Joi.boolean().default(false),
});

/**
 * Address update validation (all fields optional)
 */
export const updateAddressSchema = Joi.object({
  address_type: Joi.string().valid('shipping', 'billing', 'both').messages({
    'any.only': 'Address type must be one of: shipping, billing, both',
  }),
  recipient_name: Joi.string().min(2).max(100).messages({
    'string.min': 'Recipient name must be at least 2 characters long',
    'string.max': 'Recipient name must not exceed 100 characters',
  }),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).messages({
    'string.pattern.base': 'Phone number must be a valid 10-digit Indian mobile number',
  }),
  alternate_phone: Joi.string().pattern(/^[6-9]\d{9}$/).allow('').messages({
    'string.pattern.base': 'Alternate phone must be a valid 10-digit Indian mobile number',
  }),
  address_line1: Joi.string().min(5).max(200).messages({
    'string.min': 'Address line 1 must be at least 5 characters long',
    'string.max': 'Address line 1 must not exceed 200 characters',
  }),
  address_line2: Joi.string().max(200).allow('').messages({
    'string.max': 'Address line 2 must not exceed 200 characters',
  }),
  landmark: Joi.string().max(100).allow('').messages({
    'string.max': 'Landmark must not exceed 100 characters',
  }),
  city: Joi.string().min(2).max(100).messages({
    'string.min': 'City must be at least 2 characters long',
    'string.max': 'City must not exceed 100 characters',
  }),
  state: Joi.string().min(2).max(100).messages({
    'string.min': 'State must be at least 2 characters long',
    'string.max': 'State must not exceed 100 characters',
  }),
  country: Joi.string().min(2).max(100).messages({
    'string.min': 'Country must be at least 2 characters long',
    'string.max': 'Country must not exceed 100 characters',
  }),
  postal_code: Joi.string().pattern(/^\d{6}$/).messages({
    'string.pattern.base': 'Postal code must be a valid 6-digit Indian PIN code',
  }),
  is_default: Joi.boolean(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

/**
 * Query parameter validation for addresses list
 */
export const getAddressesQuerySchema = Joi.object({
  type: Joi.string().valid('shipping', 'billing', 'both').messages({
    'any.only': 'Address type filter must be one of: shipping, billing, both',
  }),
});

/**
 * Query parameter validation for order history
 */
export const getOrderHistoryQuerySchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled').messages({
    'any.only': 'Status filter must be one of: pending, confirmed, shipped, delivered, cancelled',
  }),
  from_date: Joi.date().iso().messages({
    'date.format': 'From date must be a valid ISO date',
  }),
  to_date: Joi.date().iso().min(Joi.ref('from_date')).messages({
    'date.format': 'To date must be a valid ISO date',
    'date.min': 'To date must be after from date',
  }),
  page: Joi.number().integer().min(1).default(1).messages({
    'number.min': 'Page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit must not exceed 100',
  }),
});

/**
 * Address ID parameter validation
 */
export const addressIdSchema = Joi.object({
  id: Joi.number().integer().min(1).required().messages({
    'number.min': 'Address ID must be a positive integer',
    'any.required': 'Address ID is required',
  }),
});

/**
 * Middleware: Validate profile update
 */
export const validateUpdateProfile = (req: Request, res: Response, next: NextFunction): any => {
  const { error } = updateProfileSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
  }
  next();
};

/**
 * Middleware: Validate account settings update
 */
export const validateUpdateAccountSettings = (req: Request, res: Response, next: NextFunction): any => {
  const { error } = updateAccountSettingsSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
  }
  next();
};

/**
 * Middleware: Validate address creation
 */
export const validateCreateAddress = (req: Request, res: Response, next: NextFunction): any => {
  const { error } = addressSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
  }
  next();
};

/**
 * Middleware: Validate address update
 */
export const validateUpdateAddress = (req: Request, res: Response, next: NextFunction): any => {
  const { error } = updateAddressSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
  }
  next();
};

/**
 * Middleware: Validate address ID param
 */
export const validateAddressId = (req: Request, res: Response, next: NextFunction): any => {
  const { error } = addressIdSchema.validate(req.params, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
  }
  next();
};

/**
 * Middleware: Validate addresses query params
 */
export const validateGetAddressesQuery = (req: Request, res: Response, next: NextFunction): any => {
  const { error } = getAddressesQuerySchema.validate(req.query, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
  }
  next();
};

/**
 * Middleware: Validate order history query params
 */
export const validateGetOrderHistory = (req: Request, res: Response, next: NextFunction): any => {
  const { error } = getOrderHistoryQuerySchema.validate(req.query, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
  }
  next();
};
