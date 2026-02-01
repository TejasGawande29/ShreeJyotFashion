import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// ReviewHelpful attributes interface
interface ReviewHelpfulAttributes {
  id: number;
  review_id: number;
  user_id: number;
  is_helpful: boolean; // true = helpful, false = not helpful
  created_at?: Date;
}

// Optional fields for creation
interface ReviewHelpfulCreationAttributes extends Optional<ReviewHelpfulAttributes, 'id' | 'created_at'> {}

// ReviewHelpful model class
class ReviewHelpful extends Model<ReviewHelpfulAttributes, ReviewHelpfulCreationAttributes> implements ReviewHelpfulAttributes {
  public id!: number;
  public review_id!: number;
  public user_id!: number;
  public is_helpful!: boolean;
  public readonly created_at!: Date;
}

// Initialize ReviewHelpful model
ReviewHelpful.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    review_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'reviews',
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
    is_helpful: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'review_helpful',
    timestamps: false,
    underscored: true,
  }
);

export default ReviewHelpful;
