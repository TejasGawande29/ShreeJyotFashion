import { Request, Response } from 'express';
import * as bulkService from '../services/bulkProductService';
import logger from '../utils/logger';

/**
 * Import products from CSV file
 * POST /api/products/bulk/import/csv
 * Admin only
 */
export const importFromCSV = async (req: Request, res: Response): Promise<any> => {
  try {
    const { csvData } = req.body;

    if (!csvData || typeof csvData !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'CSV data is required as a string',
      });
    }

    const result = await bulkService.importProductsFromCSV(csvData);

    return res.status(result.success ? 200 : 207).json({
      success: result.success,
      message: result.success
        ? 'Products imported successfully'
        : 'Products imported with some errors',
      data: result,
    });
  } catch (error: any) {
    logger.error('Error in importFromCSV:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to import products from CSV',
      error: error.message,
    });
  }
};

/**
 * Import products from JSON array
 * POST /api/products/bulk/import/json
 * Admin only
 */
export const importFromJSON = async (req: Request, res: Response): Promise<any> => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: 'Products array is required',
      });
    }

    const result = await bulkService.importProductsFromJSON(products);

    return res.status(result.success ? 200 : 207).json({
      success: result.success,
      message: result.success
        ? 'Products imported successfully'
        : 'Products imported with some errors',
      data: result,
    });
  } catch (error: any) {
    logger.error('Error in importFromJSON:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to import products from JSON',
      error: error.message,
    });
  }
};

/**
 * Export products to CSV
 * GET /api/products/bulk/export/csv
 * Admin only
 */
export const exportToCSV = async (req: Request, res: Response): Promise<any> => {
  try {
    const options = {
      includeVariants: req.query.includeVariants === 'true',
      includeImages: req.query.includeImages === 'true',
      categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
      isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
      isFeatured:
        req.query.isFeatured !== undefined ? req.query.isFeatured === 'true' : undefined,
    };

    const csvData = await bulkService.exportProductsAsCSV(options);

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products-export.csv');

    return res.status(200).send(csvData);
  } catch (error: any) {
    logger.error('Error in exportToCSV:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to export products to CSV',
      error: error.message,
    });
  }
};

/**
 * Export products to JSON
 * GET /api/products/bulk/export/json
 * Admin only
 */
export const exportToJSON = async (req: Request, res: Response): Promise<any> => {
  try {
    const options = {
      includeVariants: req.query.includeVariants === 'true',
      includeImages: req.query.includeImages === 'true',
      categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
      isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
      isFeatured:
        req.query.isFeatured !== undefined ? req.query.isFeatured === 'true' : undefined,
    };

    const jsonData = await bulkService.exportProducts(options);

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=products-export.json');

    return res.status(200).json({
      success: true,
      message: 'Products exported successfully',
      count: jsonData.length,
      data: jsonData,
    });
  } catch (error: any) {
    logger.error('Error in exportToJSON:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to export products to JSON',
      error: error.message,
    });
  }
};

/**
 * Get import template (CSV format)
 * GET /api/products/bulk/template/csv
 * Public access for convenience
 */
export const getCSVTemplate = async (_req: Request, res: Response): Promise<any> => {
  try {
    const template = `name,description,price,discount_price,category_name,category_id,sku,stock_quantity,is_featured,is_active,tags,meta_title,meta_description,meta_keywords,variant_size,variant_color,variant_color_code,variant_stock,variant_sku,image_url,image_type,image_alt_text
Wedding Lehenga,Beautiful red wedding lehenga,25000,22000,Lehengas,1,LEHENGA-001,10,true,true,"wedding,red,traditional",Wedding Lehenga Red,Beautiful wedding lehenga in red,wedding lehenga red bridal,Large,Red,#FF0000,5,LEHENGA-001-L-RED,https://example.com/image.jpg,primary,Wedding Lehenga Red Front View
Saree Collection,Elegant silk saree,15000,,Sarees,2,SAREE-001,20,false,true,"saree,silk",Silk Saree,Elegant silk saree,silk saree traditional,,,,,,,,,`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products-import-template.csv');

    return res.status(200).send(template);
  } catch (error: any) {
    logger.error('Error in getCSVTemplate:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate CSV template',
      error: error.message,
    });
  }
};

/**
 * Get import template (JSON format)
 * GET /api/products/bulk/template/json
 * Public access for convenience
 */
export const getJSONTemplate = async (_req: Request, res: Response): Promise<any> => {
  try {
    const template = [
      {
        name: 'Wedding Lehenga',
        description: 'Beautiful red wedding lehenga',
        price: 25000,
        discount_price: 22000,
        category_name: 'Lehengas',
        category_id: 1,
        sku: 'LEHENGA-001',
        stock_quantity: 10,
        is_featured: true,
        is_active: true,
        tags: 'wedding,red,traditional',
        meta_title: 'Wedding Lehenga Red',
        meta_description: 'Beautiful wedding lehenga in red',
        meta_keywords: 'wedding lehenga red bridal',
        variant_size: 'Large',
        variant_color: 'Red',
        variant_color_code: '#FF0000',
        variant_stock: 5,
        variant_sku: 'LEHENGA-001-L-RED',
        image_url: 'https://example.com/image.jpg',
        image_type: 'primary',
        image_alt_text: 'Wedding Lehenga Red Front View',
      },
      {
        name: 'Saree Collection',
        description: 'Elegant silk saree',
        price: 15000,
        category_name: 'Sarees',
        category_id: 2,
        sku: 'SAREE-001',
        stock_quantity: 20,
        is_featured: false,
        is_active: true,
        tags: 'saree,silk',
        meta_title: 'Silk Saree',
        meta_description: 'Elegant silk saree',
        meta_keywords: 'silk saree traditional',
      },
    ];

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=products-import-template.json');

    return res.status(200).json({
      success: true,
      message: 'Template generated successfully',
      data: template,
    });
  } catch (error: any) {
    logger.error('Error in getJSONTemplate:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate JSON template',
      error: error.message,
    });
  }
};
