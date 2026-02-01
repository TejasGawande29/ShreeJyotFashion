import { Request, Response } from 'express';
import * as productService from '../services/productService';
import logger from '../utils/logger';

/**
 * Get all products with optional filters and pagination
 * GET /api/products
 * Public access
 */
export const listProducts = async (req: Request, res: Response) => {
  try {
    const filters = {
      search: req.query.search as string | undefined,
      category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
      brand: req.query.brand as string | undefined,
      min_price: req.query.min_price ? Number(req.query.min_price) : undefined,
      max_price: req.query.max_price ? Number(req.query.max_price) : undefined,
      is_sale: req.query.is_sale === 'true' ? true : req.query.is_sale === 'false' ? false : undefined,
      is_rental: req.query.is_rental === 'true' ? true : req.query.is_rental === 'false' ? false : undefined,
      is_featured: req.query.is_featured === 'true' ? true : req.query.is_featured === 'false' ? false : undefined,
    };

    const pagination = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    };

    const result = await productService.getAllProducts(filters, pagination);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    logger.error('Error in listProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message,
    });
  }
};

/**
 * Get a single product by ID or slug
 * GET /api/products/:identifier
 * Public access
 */
export const getProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { identifier } = req.params;

    // Check if identifier is a number (ID) or string (slug)
    const isNumeric = /^\d+$/.test(identifier);
    
    let product;
    if (isNumeric) {
      product = await productService.getProductById(Number(identifier));
    } else {
      product = await productService.getProductBySlug(identifier);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error: any) {
    logger.error('Error in getProduct:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: error.message,
    });
  }
};

/**
 * Create a new product
 * POST /api/products
 * Admin only
 */
export const createProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const productData = req.body;

    const product = await productService.createProduct(productData);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error: any) {
    logger.error('Error in createProduct:', error);
    
    // Handle validation errors
    if (error.message.includes('already exists') || error.message.includes('not found')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

/**
 * Update an existing product
 * PUT /api/products/:id
 * Admin only
 */
export const updateProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const productId = Number(req.params.id);
    const updateData = req.body;

    const product = await productService.updateProduct(productId, updateData);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error: any) {
    logger.error('Error in updateProduct:', error);

    // Handle validation errors
    if (error.message.includes('already exists') || error.message.includes('not found')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

/**
 * Delete a product (soft delete)
 * DELETE /api/products/:id
 * Admin only
 */
export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const productId = Number(req.params.id);

    const success = await productService.deleteProduct(productId);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    logger.error('Error in deleteProduct:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};

/**
 * Get featured products
 * GET /api/products/featured
 * Public access
 */
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const products = await productService.getFeaturedProducts(limit);

    res.status(200).json({
      success: true,
      message: 'Featured products retrieved successfully',
      data: products,
    });
  } catch (error: any) {
    logger.error('Error in getFeaturedProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured products',
      error: error.message,
    });
  }
};

/**
 * Search products by name or description
 * GET /api/products/search
 * Public access
 */
export const searchProducts = async (req: Request, res: Response): Promise<any> => {
  try {
    const query = req.query.q as string;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const products = await productService.searchProducts(query);

    return res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: products,
    });
  } catch (error: any) {
    logger.error('Error in searchProducts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: error.message,
    });
  }
};
