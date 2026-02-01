import { Request, Response } from 'express';
import * as searchService from '../services/searchService';
import logger from '../utils/logger';
import { isElasticsearchEnabled } from '../config/elasticsearch';

/**
 * Search products
 * GET /api/search/products
 */
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const {
      q,
      category,
      min_price,
      max_price,
      sizes,
      colors,
      availability,
      min_rating,
      in_stock,
      sort_by,
      page = '1',
      limit = '20',
    } = req.query;

    const params = {
      query: q as string,
      category: category as string,
      minPrice: min_price ? parseFloat(min_price as string) : undefined,
      maxPrice: max_price ? parseFloat(max_price as string) : undefined,
      sizes: sizes ? (sizes as string).split(',') : undefined,
      colors: colors ? (colors as string).split(',') : undefined,
      availability: availability as 'sale' | 'rental' | 'both',
      minRating: min_rating ? parseFloat(min_rating as string) : undefined,
      inStock: in_stock === 'true',
      sortBy: sort_by as any,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    };

    const results = await searchService.searchProducts(params);

    res.json({
      success: true,
      elasticsearch_enabled: isElasticsearchEnabled(),
      ...results,
    });
  } catch (error: any) {
    logger.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: error.message,
    });
  }
};

/**
 * Autocomplete suggestions
 * GET /api/search/autocomplete
 */
export const autocomplete = async (req: Request, res: Response) => {
  try {
    const { q, limit = '10' } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required',
      });
    }

    const suggestions = await searchService.getAutocompleteSuggestions(
      q as string,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      suggestions,
      elasticsearch_enabled: isElasticsearchEnabled(),
    });
  } catch (error: any) {
    logger.error('Error getting autocomplete:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get autocomplete suggestions',
      error: error.message,
    });
  }
};

/**
 * Index a product (Admin only)
 * POST /api/search/index/:productId
 */
export const indexProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!isElasticsearchEnabled()) {
      return res.status(503).json({
        success: false,
        message: 'Elasticsearch is not available',
      });
    }

    await searchService.indexProduct(parseInt(productId));

    res.json({
      success: true,
      message: `Product ${productId} indexed successfully`,
    });
  } catch (error: any) {
    logger.error('Error indexing product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to index product',
      error: error.message,
    });
  }
};

/**
 * Bulk index products (Admin only)
 * POST /api/search/index/bulk
 */
export const bulkIndexProducts = async (req: Request, res: Response) => {
  try {
    if (!isElasticsearchEnabled()) {
      return res.status(503).json({
        success: false,
        message: 'Elasticsearch is not available',
      });
    }

    const { product_ids } = req.body;

    const result = await searchService.bulkIndexProducts(product_ids);

    res.json({
      success: true,
      message: 'Bulk indexing completed',
      ...result,
    });
  } catch (error: any) {
    logger.error('Error bulk indexing products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk index products',
      error: error.message,
    });
  }
};

/**
 * Delete product from index (Admin only)
 * DELETE /api/search/index/:productId
 */
export const deleteFromIndex = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!isElasticsearchEnabled()) {
      return res.status(503).json({
        success: false,
        message: 'Elasticsearch is not available',
      });
    }

    await searchService.deleteFromIndex(parseInt(productId));

    res.json({
      success: true,
      message: `Product ${productId} deleted from index`,
    });
  } catch (error: any) {
    logger.error('Error deleting from index:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete from index',
      error: error.message,
    });
  }
};

/**
 * Get Elasticsearch status
 * GET /api/search/status
 */
export const getSearchStatus = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      elasticsearch_enabled: isElasticsearchEnabled(),
      message: isElasticsearchEnabled()
        ? 'Elasticsearch is available'
        : 'Elasticsearch is not available - using fallback database search',
    });
  } catch (error: any) {
    logger.error('Error getting search status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get search status',
      error: error.message,
    });
  }
};

export default {
  searchProducts,
  autocomplete,
  indexProduct,
  bulkIndexProducts,
  deleteFromIndex,
  getSearchStatus,
};
