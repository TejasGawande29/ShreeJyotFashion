import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';
import logger from '../utils/logger';

/**
 * Get all categories with hierarchy
 * GET /api/categories
 * Public access
 */
export const listCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error: any) {
    logger.error('Error in listCategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: error.message,
    });
  }
};

/**
 * Get root categories (top-level categories only)
 * GET /api/categories/roots
 * Public access
 */
export const getRootCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getRootCategories();

    res.status(200).json({
      success: true,
      message: 'Root categories retrieved successfully',
      data: categories,
    });
  } catch (error: any) {
    logger.error('Error in getRootCategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve root categories',
      error: error.message,
    });
  }
};

/**
 * Get a single category by ID or slug
 * GET /api/categories/:identifier
 * Public access
 */
export const getCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { identifier } = req.params;

    // Check if identifier is a number (ID) or string (slug)
    const isNumeric = /^\d+$/.test(identifier);
    
    let category;
    if (isNumeric) {
      category = await categoryService.getCategoryById(Number(identifier));
    } else {
      category = await categoryService.getCategoryBySlug(identifier);
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: category,
    });
  } catch (error: any) {
    logger.error('Error in getCategory:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve category',
      error: error.message,
    });
  }
};

/**
 * Get category with product count
 * GET /api/categories/:id/products/count
 * Public access
 */
export const getCategoryProductCount = async (req: Request, res: Response): Promise<any> => {
  try {
    const categoryId = Number(req.params.id);

    const category = await categoryService.getCategoryWithProductCount(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category with product count retrieved successfully',
      data: category,
    });
  } catch (error: any) {
    logger.error('Error in getCategoryProductCount:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve category product count',
      error: error.message,
    });
  }
};

/**
 * Create a new category
 * POST /api/categories
 * Admin only
 */
export const createCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const categoryData = req.body;

    const category = await categoryService.createCategory(categoryData);

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error: any) {
    logger.error('Error in createCategory:', error);
    
    // Handle validation errors
    if (error.message.includes('already exists') || error.message.includes('not found')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message,
    });
  }
};

/**
 * Update an existing category
 * PUT /api/categories/:id
 * Admin only
 */
export const updateCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const categoryId = Number(req.params.id);
    const updateData = req.body;

    const category = await categoryService.updateCategory(categoryId, updateData);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error: any) {
    logger.error('Error in updateCategory:', error);

    // Handle validation errors
    if (error.message.includes('already exists') || error.message.includes('not found') || error.message.includes('circular')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message,
    });
  }
};

/**
 * Delete a category (soft delete)
 * DELETE /api/categories/:id
 * Admin only
 */
export const deleteCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const categoryId = Number(req.params.id);

    const success = await categoryService.deleteCategory(categoryId);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    logger.error('Error in deleteCategory:', error);

    // Handle validation errors
    if (error.message.includes('has products') || error.message.includes('has subcategories')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message,
    });
  }
};
