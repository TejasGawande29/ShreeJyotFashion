import { ProductImage } from '../models';
import { Op } from 'sequelize';
import logger from '../utils/logger';

/**
 * Get all images for a product
 */
export const getProductImages = async (productId: number) => {
  const images = await ProductImage.findAll({
    where: {
      product_id: productId,
    },
    order: [
      ['is_primary', 'DESC'], // Primary image first
      ['display_order', 'ASC'],
      ['created_at', 'ASC'],
    ],
  });

  return images;
};

/**
 * Get a single image by ID
 */
export const getImageById = async (imageId: number) => {
  const image = await ProductImage.findOne({
    where: {
      id: imageId,
    },
  });

  return image;
};

/**
 * Create a new product image
 */
export const createImage = async (data: {
  product_id: number;
  image_url: string;
  image_type?: 'primary' | 'gallery' | 'thumbnail';
  alt_text?: string;
  display_order?: number;
  is_primary?: boolean;
}) => {
  // Check if product exists
  const { Product } = require('../models');
  const product = await Product.findOne({
    where: { id: data.product_id, is_deleted: false },
  });

  if (!product) {
    throw new Error(`Product with id ${data.product_id} not found`);
  }

  // If this is marked as primary, unset other primary images for this product
  if (data.is_primary) {
    await ProductImage.update(
      { is_primary: false },
      {
        where: {
          product_id: data.product_id,
          is_primary: true,
        },
      }
    );
  }

  // If no display_order provided, set it to the next available number
  if (data.display_order === undefined) {
    const maxOrder: any = await ProductImage.max('display_order', {
      where: { product_id: data.product_id },
    });
    data.display_order = (maxOrder || 0) + 1;
  }

  const image = await ProductImage.create(data as any);

  return image;
};

/**
 * Update a product image
 */
export const updateImage = async (
  imageId: number,
  data: {
    image_url?: string;
    image_type?: 'primary' | 'gallery' | 'thumbnail';
    alt_text?: string;
    display_order?: number;
    is_primary?: boolean;
  }
) => {
  const image = await ProductImage.findOne({
    where: {
      id: imageId,
    },
  });

  if (!image) {
    return null;
  }

  // If this is being set as primary, unset other primary images for this product
  if (data.is_primary) {
    await ProductImage.update(
      { is_primary: false },
      {
        where: {
          product_id: image.product_id,
          is_primary: true,
          id: { [Op.ne]: imageId },
        },
      }
    );
  }

  await image.update(data);

  return image;
};

/**
 * Delete a product image
 */
export const deleteImage = async (imageId: number) => {
  const image = await ProductImage.findOne({
    where: {
      id: imageId,
    },
  });

  if (!image) {
    return false;
  }

  await image.destroy();

  return true;
};

/**
 * Set an image as primary
 */
export const setPrimaryImage = async (imageId: number) => {
  const image = await ProductImage.findOne({
    where: {
      id: imageId,
    },
  });

  if (!image) {
    throw new Error('Image not found');
  }

  // Unset all other primary images for this product
  await ProductImage.update(
    { is_primary: false },
    {
      where: {
        product_id: image.product_id,
        is_primary: true,
      },
    }
  );

  // Set this image as primary
  await image.update({ is_primary: true });

  return image;
};

/**
 * Reorder images for a product
 */
export const reorderImages = async (
  productId: number,
  imageOrders: Array<{ id: number; display_order: number }>
) => {
  // Check if product exists
  const { Product } = require('../models');
  const product = await Product.findOne({
    where: { id: productId, is_deleted: false },
  });

  if (!product) {
    throw new Error(`Product with id ${productId} not found`);
  }

  // Update each image's display_order
  for (const item of imageOrders) {
    await ProductImage.update(
      { display_order: item.display_order },
      {
        where: {
          id: item.id,
          product_id: productId,
        },
      }
    );
  }

  // Return updated images
  return getProductImages(productId);
};
