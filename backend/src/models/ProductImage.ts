import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// ProductImage attributes interface
interface ProductImageAttributes {
  id: number;
  product_id: number;
  image_url: string;
  image_type: 'primary' | 'gallery' | 'thumbnail';
  display_order: number;
  alt_text?: string;
  is_primary: boolean;
  created_at?: Date;
}

// Optional fields for creation
interface ProductImageCreationAttributes extends Optional<ProductImageAttributes, 
  'id' | 'image_type' | 'display_order' | 'alt_text' | 'is_primary'
> {}

// ProductImage model class
class ProductImage extends Model<ProductImageAttributes, ProductImageCreationAttributes> implements ProductImageAttributes {
  public id!: number;
  public product_id!: number;
  public image_url!: string;
  public image_type!: 'primary' | 'gallery' | 'thumbnail';
  public display_order!: number;
  public alt_text?: string;
  public is_primary!: boolean;
  
  // Timestamps
  public readonly created_at!: Date;

  // Association placeholders
  public readonly product?: any;
}

// Initialize ProductImage model
ProductImage.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Image URL is required',
        },
        isUrl: {
          msg: 'Image URL must be a valid URL',
        },
      },
    },
    image_type: {
      type: DataTypes.ENUM('primary', 'gallery', 'thumbnail'),
      allowNull: false,
      defaultValue: 'gallery',
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    alt_text: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_primary: {
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
  },
  {
    sequelize,
    tableName: 'product_images',
    timestamps: false, // Only has created_at, not updated_at
    createdAt: 'created_at',
    updatedAt: false,
  }
);

export default ProductImage;
