import Product from '../models/Product';
import Category from '../models/Category';
import ProductVariant from '../models/ProductVariant';
import ProductImage from '../models/ProductImage';
import sequelize from '../config/database';
import { Op } from 'sequelize';

interface ProductImportData {
  name: string;
  description?: string;
  price: number;
  discount_price?: number;
  category_name?: string;
  category_id?: number;
  sku?: string;
  stock_quantity?: number;
  is_featured?: boolean;
  is_active?: boolean;
  tags?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  // Variant data (optional)
  variant_size?: string;
  variant_color?: string;
  variant_color_code?: string;
  variant_stock?: number;
  variant_sku?: string;
  // Image data (optional)
  image_url?: string;
  image_type?: 'primary' | 'gallery' | 'thumbnail';
  image_alt_text?: string;
}

interface ImportResult {
  success: boolean;
  total: number;
  imported: number;
  skipped: number;
  errors: Array<{ row: number; error: string; data?: any }>;
}

interface ExportOptions {
  includeVariants?: boolean;
  includeImages?: boolean;
  categoryId?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

/**
 * Parse CSV string to array of objects
 */
export const parseCSV = (csvString: string): ProductImportData[] => {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must contain header and at least one data row');
  }

  const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
  const results: ProductImportData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/"/g, ''));
    const row: any = {};

    headers.forEach((header, index) => {
      const value = values[index];
      if (value) {
        // Convert string values to appropriate types
        if (['price', 'discount_price', 'stock_quantity', 'variant_stock'].includes(header)) {
          row[header] = parseFloat(value);
        } else if (['is_featured', 'is_active'].includes(header)) {
          row[header] = value.toLowerCase() === 'true' || value === '1';
        } else if (header === 'category_id') {
          row[header] = parseInt(value);
        } else {
          row[header] = value;
        }
      }
    });

    results.push(row);
  }

  return results;
};

/**
 * Convert array of objects to CSV string
 */
export const generateCSV = (data: any[]): string => {
  if (data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      if (value === null || value === undefined) {
        return '';
      }
      // Escape quotes and wrap in quotes if contains comma
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

/**
 * Import products from array of data (CSV or JSON)
 */
export const importProducts = async (
  productsData: ProductImportData[]
): Promise<ImportResult> => {
  const result: ImportResult = {
    success: true,
    total: productsData.length,
    imported: 0,
    skipped: 0,
    errors: [],
  };

  const transaction = await sequelize.transaction();

  try {
    for (let i = 0; i < productsData.length; i++) {
      const data = productsData[i];
      const rowNumber = i + 2; // +2 because row 1 is header, and we're 0-indexed

      try {
        // Validate required fields
        if (!data.name || !data.price) {
          result.errors.push({
            row: rowNumber,
            error: 'Missing required fields: name and price',
            data,
          });
          result.skipped++;
          continue;
        }

        // Get or validate category
        let categoryId = data.category_id;
        if (data.category_name && !categoryId) {
          const category = await Category.findOne({
            where: { name: data.category_name, is_deleted: false } as any,
            transaction,
          });
          if (category) {
            categoryId = category.id;
          } else {
            result.errors.push({
              row: rowNumber,
              error: `Category '${data.category_name}' not found`,
              data,
            });
            result.skipped++;
            continue;
          }
        }

        // Check for duplicate SKU
        if (data.sku) {
          const existingProduct = await Product.findOne({
            where: { sku: data.sku, is_deleted: false } as any,
            transaction,
          });
          if (existingProduct) {
            result.errors.push({
              row: rowNumber,
              error: `Product with SKU '${data.sku}' already exists`,
              data,
            });
            result.skipped++;
            continue;
          }
        }

        // Create product
        const product = await Product.create(
          {
            name: data.name,
            description: data.description || null,
            price: data.price,
            discount_price: data.discount_price || null,
            category_id: categoryId || null,
            sku: data.sku || null,
            stock_quantity: data.stock_quantity || 0,
            is_featured: data.is_featured || false,
            is_active: data.is_active !== undefined ? data.is_active : true,
            tags: data.tags || null,
            meta_title: data.meta_title || null,
            meta_description: data.meta_description || null,
            meta_keywords: data.meta_keywords || null,
          } as any,
          { transaction }
        );

        // Create variant if variant data is provided
        if (data.variant_size || data.variant_color || data.variant_sku) {
          await ProductVariant.create(
            {
              product_id: product.id,
              size: data.variant_size || null,
              color: data.variant_color || null,
              color_code: data.variant_color_code || null,
              stock_quantity: data.variant_stock || 0,
              stock_allocated: 0,
              sku_variant: data.variant_sku || null,
              is_active: true,
            } as any,
            { transaction }
          );
        }

        // Create image if image data is provided
        if (data.image_url) {
          await ProductImage.create(
            {
              product_id: product.id,
              image_url: data.image_url,
              image_type: data.image_type || 'gallery',
              alt_text: data.image_alt_text || null,
              display_order: 0,
              is_primary: data.image_type === 'primary' || false,
            } as any,
            { transaction }
          );
        }

        result.imported++;
      } catch (error: any) {
        result.errors.push({
          row: rowNumber,
          error: error.message,
          data,
        });
        result.skipped++;
      }
    }

    await transaction.commit();
    result.success = result.errors.length === 0;
  } catch (error: any) {
    await transaction.rollback();
    result.success = false;
    result.errors.push({
      row: 0,
      error: `Transaction failed: ${error.message}`,
    });
  }

  return result;
};

/**
 * Export products to array format (for CSV or JSON)
 */
export const exportProducts = async (options: ExportOptions = {}): Promise<any[]> => {
  const whereClause: any = { is_deleted: false };

  if (options.categoryId) {
    whereClause.category_id = options.categoryId;
  }
  if (options.isActive !== undefined) {
    whereClause.is_active = options.isActive;
  }
  if (options.isFeatured !== undefined) {
    whereClause.is_featured = options.isFeatured;
  }

  const products = await Product.findAll({
    where: whereClause as any,
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      },
      ...(options.includeVariants
        ? [
            {
              model: ProductVariant,
              as: 'variants',
              where: { is_active: true },
              required: false,
            },
          ]
        : []),
      ...(options.includeImages
        ? [
            {
              model: ProductImage,
              as: 'images',
              required: false,
            },
          ]
        : []),
    ],
    order: [['created_at', 'DESC']],
  });

  const exportData: any[] = [];

  for (const product of products) {
    const productData: any = product.toJSON();

    if (options.includeVariants && productData.variants?.length > 0) {
      // Create a row for each variant
      for (const variant of productData.variants) {
        const row: any = {
          product_id: productData.id,
          name: productData.name,
          description: productData.description,
          price: productData.price,
          discount_price: productData.discount_price,
          category_id: productData.category_id,
          category_name: productData.category?.name || '',
          sku: productData.sku,
          stock_quantity: productData.stock_quantity,
          is_featured: productData.is_featured,
          is_active: productData.is_active,
          tags: productData.tags,
          variant_id: variant.id,
          variant_size: variant.size,
          variant_color: variant.color,
          variant_color_code: variant.color_code,
          variant_stock: variant.stock_quantity,
          variant_allocated: variant.stock_allocated,
          variant_sku: variant.sku_variant,
          variant_active: variant.is_active,
        };

        if (options.includeImages && productData.images?.length > 0) {
          const primaryImage = productData.images.find((img: any) => img.is_primary);
          if (primaryImage) {
            row.image_url = primaryImage.image_url;
            row.image_type = primaryImage.image_type;
            row.image_alt_text = primaryImage.alt_text;
          }
        }

        exportData.push(row);
      }
    } else {
      // Single row for product
      const row: any = {
        product_id: productData.id,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        discount_price: productData.discount_price,
        category_id: productData.category_id,
        category_name: productData.category?.name || '',
        sku: productData.sku,
        stock_quantity: productData.stock_quantity,
        is_featured: productData.is_featured,
        is_active: productData.is_active,
        tags: productData.tags,
        meta_title: productData.meta_title,
        meta_description: productData.meta_description,
        meta_keywords: productData.meta_keywords,
      };

      if (options.includeImages && productData.images?.length > 0) {
        const primaryImage = productData.images.find((img: any) => img.is_primary);
        if (primaryImage) {
          row.image_url = primaryImage.image_url;
          row.image_type = primaryImage.image_type;
          row.image_alt_text = primaryImage.alt_text;
        }
      }

      exportData.push(row);
    }
  }

  return exportData;
};

/**
 * Export products as CSV string
 */
export const exportProductsAsCSV = async (options: ExportOptions = {}): Promise<string> => {
  const data = await exportProducts(options);
  return generateCSV(data);
};

/**
 * Import products from CSV string
 */
export const importProductsFromCSV = async (csvString: string): Promise<ImportResult> => {
  const productsData = parseCSV(csvString);
  return importProducts(productsData);
};

/**
 * Import products from JSON array
 */
export const importProductsFromJSON = async (
  jsonData: ProductImportData[]
): Promise<ImportResult> => {
  if (!Array.isArray(jsonData)) {
    throw new Error('JSON data must be an array of products');
  }
  return importProducts(jsonData);
};
