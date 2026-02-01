import { Op } from 'sequelize';
import Product from '../models/Product';
import Category from '../models/Category';
import ProductVariant from '../models/ProductVariant';
import ProductImage from '../models/ProductImage';

interface CreateProductData {
  category_id: number;
  name: string;
  slug?: string;
  sku?: string;
  description?: string;
  brand?: string;
  material?: string;
  care_instructions?: string;
  is_sale?: boolean;
  is_rental?: boolean;
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

interface UpdateProductData extends Partial<CreateProductData> {}

interface ProductListFilters {
  category_id?: number;
  is_sale?: boolean;
  is_rental?: boolean;
  is_featured?: boolean;
  brand?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Get all products with filters and pagination
 */
export const getAllProducts = async (
  filters: ProductListFilters = {},
  options: PaginationOptions = {}
) => {
  const {
    page = 1,
    limit = 20,
    sortBy = 'created_at',
    sortOrder = 'DESC',
  } = options;

  const offset = (page - 1) * limit;

  // Build where clause
  const where: any = {
    is_active: true,
    is_deleted: false,
  };

  if (filters.category_id) {
    where.category_id = filters.category_id;
  }

  if (filters.is_sale !== undefined) {
    where.is_sale = filters.is_sale;
  }

  if (filters.is_rental !== undefined) {
    where.is_rental = filters.is_rental;
  }

  if (filters.is_featured !== undefined) {
    where.is_featured = filters.is_featured;
  }

  if (filters.brand) {
    where.brand = {
      [Op.iLike]: `%${filters.brand}%`,
    };
  }

  if (filters.search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${filters.search}%` } },
      { description: { [Op.iLike]: `%${filters.search}%` } },
      { sku: { [Op.iLike]: `%${filters.search}%` } },
    ];
  }

  // Get products with associations
  const { count, rows } = await Product.findAndCountAll({
    where,
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug'],
      },
      {
        model: ProductVariant,
        as: 'variants',
        where: { is_active: true },
        required: false,
      },
      {
        model: ProductImage,
        as: 'images',
        where: { is_primary: true },
        required: false,
        limit: 1,
      },
    ],
    limit,
    offset,
    order: [[sortBy, sortOrder]],
    distinct: true,
  });

  return {
    products: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

/**
 * Get single product by ID with all details
 */
export const getProductById = async (productId: number) => {
  const product = await Product.findOne({
    where: {
      id: productId,
      is_active: true,
      is_deleted: false,
    },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'description'],
      },
      {
        model: ProductVariant,
        as: 'variants',
        where: { is_active: true },
        required: false,
      },
      {
        model: ProductImage,
        as: 'images',
        order: [['display_order', 'ASC']],
      },
    ],
  });

  if (!product) {
    throw new Error('Product not found');
  }

  // Increment views count
  await product.incrementViews();

  return product;
};

/**
 * Get product by slug
 */
export const getProductBySlug = async (slug: string) => {
  const product = await Product.findOne({
    where: {
      slug,
      is_active: true,
      is_deleted: false,
    },
    include: [
      {
        model: Category,
        as: 'category',
      },
      {
        model: ProductVariant,
        as: 'variants',
        where: { is_active: true },
        required: false,
      },
      {
        model: ProductImage,
        as: 'images',
        order: [['display_order', 'ASC']],
      },
    ],
  });

  if (!product) {
    throw new Error('Product not found');
  }

  // Increment views count
  await product.incrementViews();

  return product;
};

/**
 * Create new product (Admin only)
 */
export const createProduct = async (data: CreateProductData) => {
  // Verify category exists
  const category = await Category.findByPk(data.category_id);
  if (!category) {
    throw new Error('Category not found');
  }

  // Check if slug already exists (if provided)
  if (data.slug) {
    const existing = await Product.findOne({ where: { slug: data.slug } });
    if (existing) {
      throw new Error('Product with this slug already exists');
    }
  }

  // Check if SKU already exists (if provided)
  if (data.sku) {
    const existing = await Product.findOne({ where: { sku: data.sku } });
    if (existing) {
      throw new Error('Product with this SKU already exists');
    }
  }

  const product = await Product.create(data as any);

  // Fetch with associations
  return await getProductById(product.id);
};

/**
 * Update product (Admin only)
 */
export const updateProduct = async (productId: number, data: UpdateProductData) => {
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  // If updating category, verify it exists
  if (data.category_id) {
    const category = await Category.findByPk(data.category_id);
    if (!category) {
      throw new Error('Category not found');
    }
  }

  // Check slug uniqueness if updating
  if (data.slug && data.slug !== product.slug) {
    const existing = await Product.findOne({
      where: {
        slug: data.slug,
        id: { [Op.ne]: productId },
      },
    });
    if (existing) {
      throw new Error('Product with this slug already exists');
    }
  }

  // Check SKU uniqueness if updating
  if (data.sku && data.sku !== product.sku) {
    const existing = await Product.findOne({
      where: {
        sku: data.sku,
        id: { [Op.ne]: productId },
      },
    });
    if (existing) {
      throw new Error('Product with this SKU already exists');
    }
  }

  await product.update(data);

  // Return updated product with associations
  return await getProductById(productId);
};

/**
 * Delete product (soft delete) (Admin only)
 */
export const deleteProduct = async (productId: number) => {
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  await product.update({
    is_deleted: true,
    is_active: false,
  });

  return { message: 'Product deleted successfully' };
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limit: number = 10) => {
  const products = await Product.findAll({
    where: {
      is_featured: true,
      is_active: true,
      is_deleted: false,
    },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug'],
      },
      {
        model: ProductImage,
        as: 'images',
        where: { is_primary: true },
        required: false,
        limit: 1,
      },
    ],
    limit,
    order: [['created_at', 'DESC']],
  });

  return products;
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (
  categoryId: number,
  options: PaginationOptions = {}
) => {
  return await getAllProducts({ category_id: categoryId }, options);
};

/**
 * Search products
 */
export const searchProducts = async (
  searchQuery: string,
  options: PaginationOptions = {}
) => {
  return await getAllProducts({ search: searchQuery }, options);
};
