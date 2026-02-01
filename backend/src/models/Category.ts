import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Category attributes interface
interface CategoryAttributes {
  id: number;
  parent_id?: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Optional fields for creation
interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'parent_id' | 'description' | 'image_url' | 'display_order' | 'is_active' | 'is_deleted'> {}

// Category model class
class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public parent_id?: number;
  public name!: string;
  public slug!: string;
  public description?: string;
  public image_url?: string;
  public display_order!: number;
  public is_active!: boolean;
  public is_deleted!: boolean;
  
  // Timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Association placeholders
  public readonly parent?: Category;
  public readonly children?: Category[];
  public readonly products?: any[]; // Will be typed when Product model is created
}

// Initialize Category model
Category.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Category name is required',
        },
        len: {
          args: [1, 100],
          msg: 'Category name must be between 1 and 100 characters',
        },
      },
    },
    slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Category slug is required',
        },
        is: {
          args: /^[a-z0-9-]+$/,
          msg: 'Slug must contain only lowercase letters, numbers, and hyphens',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Image URL must be a valid URL',
        },
      },
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    tableName: 'categories',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeValidate: (category: Category) => {
        // Auto-generate slug from name if not provided
        if (!category.slug && category.name) {
          category.slug = category.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        }
      },
    },
  }
);

// Define associations (will be set up after all models are created)
export const setupCategoryAssociations = () => {
  // Self-referential for parent-child hierarchy
  Category.hasMany(Category, {
    as: 'children',
    foreignKey: 'parent_id',
  });

  Category.belongsTo(Category, {
    as: 'parent',
    foreignKey: 'parent_id',
  });
};

export default Category;
