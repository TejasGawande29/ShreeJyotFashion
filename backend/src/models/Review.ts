import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Review attributes interface (aligned with DB structure)
interface ReviewAttributes {
  id: number;
  product_id: number;
  user_id: number;
  order_id?: number;
  rating: number; // 1-5 stars
  title?: string;
  comment?: string;
  images?: string[]; // Array of image URLs stored as JSONB
  is_verified_purchase?: boolean;
  is_approved?: boolean;
  helpful_count?: number;
  is_deleted?: boolean;
  reviewed_at?: Date;
  updated_at?: Date;
}

// Optional fields for creation
interface ReviewCreationAttributes extends Optional<ReviewAttributes, 
  'id' | 'order_id' | 'title' | 'comment' | 'images' | 'is_verified_purchase' | 
  'is_approved' | 'helpful_count' | 'is_deleted' | 'reviewed_at' | 'updated_at'
> {}

// Review model class
class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: number;
  public product_id!: number;
  public user_id!: number;
  public order_id?: number;
  public rating!: number;
  public title?: string;
  public comment?: string;
  public images?: string[];
  public is_verified_purchase?: boolean;
  public is_approved?: boolean;
  public helpful_count?: number;
  public is_deleted?: boolean;
  public reviewed_at?: Date;
  public readonly updated_at!: Date;
}

// Initialize Review model
Review.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    rating: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    is_verified_purchase: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false, // Requires admin approval
    },
    helpful_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'reviews',
    timestamps: false, // Using custom reviewed_at and updated_at
    underscored: true,
  }
);

export default Review;
