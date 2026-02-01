import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// CouponUsage attributes interface
interface CouponUsageAttributes {
  id: number;
  coupon_id: number;
  user_id: number;
  order_id: number;
  discount_amount: number;
  used_at?: Date;
}

// Optional fields for creation
interface CouponUsageCreationAttributes extends Optional<CouponUsageAttributes, 'id' | 'used_at'> {}

// CouponUsage model class
class CouponUsage extends Model<CouponUsageAttributes, CouponUsageCreationAttributes> implements CouponUsageAttributes {
  public id!: number;
  public coupon_id!: number;
  public user_id!: number;
  public order_id!: number;
  public discount_amount!: number;
  public readonly used_at!: Date;
}

// Initialize CouponUsage model
CouponUsage.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    coupon_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'coupons',
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
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    used_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'coupon_usage',
    timestamps: false,
    underscored: true,
  }
);

export default CouponUsage;
