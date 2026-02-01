import { Op } from 'sequelize';
import Category from '../models/Category';
import Product from '../models/Product';

interface CreateCategoryData {
  parent_id?: number;
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
  display_order?: number;
}

interface UpdateCategoryData extends Partial<CreateCategoryData> {}

/**
 * Get all categories (hierarchical structure)
 */
export const getAllCategories = async (includeInactive: boolean = false) => {
  const where: any = {
    is_deleted: false,
  };

  if (!includeInactive) {
    where.is_active = true;
  }

  const categories = await Category.findAll({
    where,
    include: [
      {
        model: Category,
        as: 'children',
        where: { is_active: true, is_deleted: false },
        required: false,
      },
    ],
    order: [['display_order', 'ASC'], ['name', 'ASC']],
  });

  return categories;
};

/**
 * Get root categories (no parent)
 */
export const getRootCategories = async () => {
  const categories = await Category.findAll({
    where: {
      parent_id: { [Op.is]: null as any },
      is_active: true,
      is_deleted: false,
    },
    include: [
      {
        model: Category,
        as: 'children',
        where: { is_active: true, is_deleted: false },
        required: false,
      },
    ],
    order: [['display_order', 'ASC'], ['name', 'ASC']],
  });

  return categories;
};

/**
 * Get category by ID
 */
export const getCategoryById = async (categoryId: number) => {
  const category = await Category.findOne({
    where: {
      id: categoryId,
      is_deleted: false,
    },
    include: [
      {
        model: Category,
        as: 'parent',
        attributes: ['id', 'name', 'slug'],
      },
      {
        model: Category,
        as: 'children',
        where: { is_active: true, is_deleted: false },
        required: false,
      },
    ],
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = async (slug: string) => {
  const category = await Category.findOne({
    where: {
      slug,
      is_active: true,
      is_deleted: false,
    },
    include: [
      {
        model: Category,
        as: 'parent',
        attributes: ['id', 'name', 'slug'],
      },
      {
        model: Category,
        as: 'children',
        where: { is_active: true, is_deleted: false },
        required: false,
      },
    ],
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

/**
 * Create new category (Admin only)
 */
export const createCategory = async (data: CreateCategoryData) => {
  // If parent_id provided, verify parent exists
  if (data.parent_id) {
    const parent = await Category.findByPk(data.parent_id);
    if (!parent) {
      throw new Error('Parent category not found');
    }
  }

  // Check if slug already exists (if provided)
  if (data.slug) {
    const existing = await Category.findOne({ where: { slug: data.slug } });
    if (existing) {
      throw new Error('Category with this slug already exists');
    }
  }

  const category = await Category.create(data as any);

  return await getCategoryById(category.id);
};

/**
 * Update category (Admin only)
 */
export const updateCategory = async (
  categoryId: number,
  data: UpdateCategoryData
) => {
  const category = await Category.findByPk(categoryId);

  if (!category) {
    throw new Error('Category not found');
  }

  // Prevent circular parent reference
  if (data.parent_id) {
    if (data.parent_id === categoryId) {
      throw new Error('Category cannot be its own parent');
    }

    const parent = await Category.findByPk(data.parent_id);
    if (!parent) {
      throw new Error('Parent category not found');
    }

    // Check if parent_id would create a circular reference
    let checkParent: Category | null = parent;
    while (checkParent && checkParent.parent_id) {
      if (checkParent.parent_id === categoryId) {
        throw new Error('Circular parent reference detected');
      }
      checkParent = await Category.findByPk(checkParent.parent_id);
    }
  }

  // Check slug uniqueness if updating
  if (data.slug && data.slug !== category.slug) {
    const existing = await Category.findOne({
      where: {
        slug: data.slug,
        id: { [Op.ne]: categoryId },
      },
    });
    if (existing) {
      throw new Error('Category with this slug already exists');
    }
  }

  await category.update(data);

  return await getCategoryById(categoryId);
};

/**
 * Delete category (soft delete) (Admin only)
 */
export const deleteCategory = async (categoryId: number) => {
  const category = await Category.findByPk(categoryId);

  if (!category) {
    throw new Error('Category not found');
  }

  // Check if category has products
  const productCount = await Product.count({
    where: {
      category_id: categoryId,
      is_deleted: false,
    },
  });

  if (productCount > 0) {
    throw new Error(
      `Cannot delete category. It has ${productCount} products. Please reassign or delete them first.`
    );
  }

  // Check if category has children
  const childCount = await Category.count({
    where: {
      parent_id: categoryId,
      is_deleted: false,
    },
  });

  if (childCount > 0) {
    throw new Error(
      `Cannot delete category. It has ${childCount} subcategories. Please reassign or delete them first.`
    );
  }

  await category.update({
    is_deleted: true,
    is_active: false,
  });

  return { message: 'Category deleted successfully' };
};

/**
 * Get category with product count
 */
export const getCategoryWithProductCount = async (categoryId: number) => {
  const category = await getCategoryById(categoryId);

  const productCount = await Product.count({
    where: {
      category_id: categoryId,
      is_active: true,
      is_deleted: false,
    },
  });

  return {
    ...category.toJSON(),
    product_count: productCount,
  };
};
