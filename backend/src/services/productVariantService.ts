import { ProductVariant } from '../models';
import { Op } from 'sequelize';
import logger from '../utils/logger';

/**
 * Get all variants for a product
 */
export const getProductVariants = async (productId: number) => {
  const variants = await ProductVariant.findAll({
    where: {
      product_id: productId,
    },
    order: [['created_at', 'ASC']],
  });

  return variants;
};

/**
 * Get a single variant by ID
 */
export const getVariantById = async (variantId: number) => {
  const variant = await ProductVariant.findOne({
    where: {
      id: variantId,
    },
  });

  return variant;
};

/**
 * Create a new product variant
 */
export const createVariant = async (data: {
  product_id: number;
  size?: string;
  color?: string;
  color_code?: string;
  stock_quantity?: number;
  stock_allocated?: number;
  sku_variant?: string;
  is_active?: boolean;
}) => {
  // Check if product exists
  const { Product } = require('../models');
  const product = await Product.findOne({
    where: { id: data.product_id, is_deleted: false } as any,
  });

  if (!product) {
    throw new Error(`Product with id ${data.product_id} not found`);
  }

  // Check for duplicate variant (same size + color for same product)
  if (data.size || data.color) {
    const where: any = {
      product_id: data.product_id,
    };
    
    if (data.size) where.size = data.size;
    if (data.color) where.color = data.color;
    
    const existingVariant = await ProductVariant.findOne({ where });

    if (existingVariant) {
      throw new Error(
        `Variant with size "${data.size || 'N/A'}" and color "${data.color || 'N/A'}" already exists for this product`
      );
    }
  }

  // Check for duplicate SKU if provided
  if (data.sku_variant) {
    const existingSku = await ProductVariant.findOne({
      where: {
        sku_variant: data.sku_variant,
      },
    });

    if (existingSku) {
      throw new Error(`SKU "${data.sku_variant}" already exists`);
    }
  }

  const variant = await ProductVariant.create(data as any);

  return variant;
};

/**
 * Update a product variant
 */
export const updateVariant = async (
  variantId: number,
  data: {
    size?: string;
    color?: string;
    color_code?: string;
    stock_quantity?: number;
    stock_allocated?: number;
    sku_variant?: string;
    is_active?: boolean;
  }
) => {
  const variant = await ProductVariant.findOne({
    where: {
      id: variantId,
    },
  });

  if (!variant) {
    return null;
  }

  // Check for duplicate variant (excluding current variant)
  if (data.size !== undefined || data.color !== undefined) {
    const where: any = {
      product_id: variant.product_id,
      id: { [Op.ne]: variantId },
    };
    
    if (data.size !== undefined) where.size = data.size;
    else if (variant.size) where.size = variant.size;
    
    if (data.color !== undefined) where.color = data.color;
    else if (variant.color) where.color = variant.color;

    const existingVariant = await ProductVariant.findOne({ where });

    if (existingVariant) {
      throw new Error(
        `Variant with size "${data.size ?? variant.size}" and color "${data.color ?? variant.color}" already exists for this product`
      );
    }
  }

  // Check for duplicate SKU (excluding current variant)
  if (data.sku_variant) {
    const existingSku = await ProductVariant.findOne({
      where: {
        sku_variant: data.sku_variant,
        id: { [Op.ne]: variantId },
      },
    });

    if (existingSku) {
      throw new Error(`SKU "${data.sku_variant}" already exists`);
    }
  }

  await variant.update(data);

  return variant;
};

/**
 * Delete a product variant (soft delete)
 */
export const deleteVariant = async (variantId: number) => {
  const variant = await ProductVariant.findOne({
    where: {
      id: variantId,
    },
  });

  if (!variant) {
    return false;
  }

  await variant.update({
    is_active: false,
  });

  return true;
};

/**
 * Reserve stock for a variant
 */
export const reserveVariantStock = async (variantId: number, quantity: number) => {
  const variant = await ProductVariant.findOne({
    where: {
      id: variantId,
    },
  });

  if (!variant) {
    throw new Error('Variant not found');
  }

  await variant.reserveStock(quantity);

  return variant;
};

/**
 * Release reserved stock for a variant
 */
export const releaseVariantStock = async (variantId: number, quantity: number) => {
  const variant = await ProductVariant.findOne({
    where: {
      id: variantId,
    },
  });

  if (!variant) {
    throw new Error('Variant not found');
  }

  await variant.releaseStock(quantity);

  return variant;
};

/**
 * Add stock to a variant
 */
export const addVariantStock = async (variantId: number, quantity: number) => {
  const variant = await ProductVariant.findOne({
    where: {
      id: variantId,
    },
  });

  if (!variant) {
    throw new Error('Variant not found');
  }

  await variant.addStock(quantity);

  return variant;
};

/**
 * Reduce stock from a variant (for completed sales)
 */
export const reduceVariantStock = async (variantId: number, quantity: number) => {
  const variant = await ProductVariant.findOne({
    where: {
      id: variantId,
    },
  });

  if (!variant) {
    throw new Error('Variant not found');
  }

  await variant.reduceStock(quantity);

  return variant;
};
