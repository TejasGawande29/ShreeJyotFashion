import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Product attributes interface
interface ProductAttributes {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  brand?: string;
  material?: string;
  care_instructions?: string;
  is_sale: boolean;
  is_rental: boolean;
  is_featured: boolean;
  is_active: boolean;
  is_deleted: boolean;
  views_count: number;
  sales_count: number;
  rental_count: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Optional fields for creation
interface ProductCreationAttributes extends Optional<ProductAttributes, 
  'id' | 'description' | 'brand' | 'material' | 'care_instructions' | 
  'is_sale' | 'is_rental' | 'is_featured' | 'is_active' | 'is_deleted' | 
  'views_count' | 'sales_count' | 'rental_count' | 'meta_title' | 
  'meta_description' | 'meta_keywords'
> {}

// Product model class
class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public category_id!: number;
  public name!: string;
  public slug!: string;
  public sku!: string;
  public description?: string;
  public brand?: string;
  public material?: string;
  public care_instructions?: string;
  public is_sale!: boolean;
  public is_rental!: boolean;
  public is_featured!: boolean;
  public is_active!: boolean;
  public is_deleted!: boolean;
  public views_count!: number;
  public sales_count!: number;
  public rental_count!: number;
  public meta_title?: string;
  public meta_description?: string;
  public meta_keywords?: string;
  
  // Timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Association placeholders
  public readonly category?: any;
  public readonly variants?: any[];
  public readonly images?: any[];
  public readonly prices?: any[];

  /**
   * Increment views count
   */
  async incrementViews(): Promise<void> {
    this.views_count += 1;
    await this.save();
  }

  /**
   * Check if product is available for sale
   */
  isAvailableForSale(): boolean {
    return this.is_sale && this.is_active && !this.is_deleted;
  }

  /**
   * Check if product is available for rental
   */
  isAvailableForRental(): boolean {
    return this.is_rental && this.is_active && !this.is_deleted;
  }
}

// Initialize Product model
Product.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Product name is required',
        },
        len: {
          args: [1, 255],
          msg: 'Product name must be between 1 and 255 characters',
        },
      },
    },
    slug: {
      type: DataTypes.STRING(300),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Product slug is required',
        },
        is: {
          args: /^[a-z0-9-]+$/,
          msg: 'Slug must contain only lowercase letters, numbers, and hyphens',
        },
      },
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'SKU is required',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    material: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    care_instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_sale: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_rental: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    views_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sales_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    rental_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    meta_title: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    meta_keywords: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeValidate: (product: Product) => {
        // Auto-generate slug from name if not provided
        if (!product.slug && product.name) {
          product.slug = product.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        }

        // Auto-generate SKU if not provided (simple implementation)
        if (!product.sku && product.name) {
          const timestamp = Date.now().toString().slice(-6);
          const namePrefix = product.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
          product.sku = `PRD-${namePrefix}-${timestamp}`;
        }

        // Auto-generate meta_title from name if not provided
        if (!product.meta_title && product.name) {
          product.meta_title = product.name;
        }
      },
    },
  }
);

export default Product;
