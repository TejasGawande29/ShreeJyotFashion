import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Discount type enum
export enum DiscountType {
  PERCENTAGE = 'percentage',
  FLAT = 'flat'
}

// Applicable to enum
export enum ApplicableTo {
  ALL = 'all',
  CATEGORY = 'category',
  PRODUCT = 'product'
}

// Coupon attributes interface
interface CouponAttributes {
  id: number;
  code: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_value?: number;
  max_discount?: number;
  usage_limit?: number;
  usage_per_user?: number;
  used_count?: number;
  applicable_to?: ApplicableTo;
  category_ids?: number[];
  product_ids?: number[];
  valid_from: Date;
  valid_to: Date;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Optional fields for creation
interface CouponCreationAttributes extends Optional<CouponAttributes,
  'id' | 'description' | 'min_order_value' | 'max_discount' | 'usage_limit' |
  'usage_per_user' | 'used_count' | 'applicable_to' | 'category_ids' |
  'product_ids' | 'is_active' | 'created_at' | 'updated_at'
> {}

// Coupon model class
class Coupon extends Model<CouponAttributes, CouponCreationAttributes> implements CouponAttributes {
  public id!: number;
  public code!: string;
  public description?: string;
  public discount_type!: DiscountType;
  public discount_value!: number;
  public min_order_value?: number;
  public max_discount?: number;
  public usage_limit?: number;
  public usage_per_user?: number;
  public used_count?: number;
  public applicable_to?: ApplicableTo;
  public category_ids?: number[];
  public product_ids?: number[];
  public valid_from!: Date;
  public valid_to!: Date;
  public is_active?: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Helper method to check if coupon is valid
  public isValid(): boolean {
    const now = new Date();
    return (
      this.is_active === true &&
      now >= this.valid_from &&
      now <= this.valid_to &&
      (this.usage_limit === null || this.usage_limit === undefined || this.used_count! < this.usage_limit)
    );
  }

  // Helper method to calculate discount
  public calculateDiscount(orderAmount: number): number {
    if (this.discount_type === DiscountType.PERCENTAGE) {
      const discount = (orderAmount * this.discount_value) / 100;
      if (this.max_discount) {
        return Math.min(discount, this.max_discount);
      }
      return discount;
    } else {
      // Flat discount
      return Math.min(this.discount_value, orderAmount);
    }
  }
}

// Initialize Coupon model
Coupon.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    discount_type: {
      type: DataTypes.ENUM('percentage', 'flat'),
      allowNull: false,
    },
    discount_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    min_order_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    max_discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    usage_limit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    usage_per_user: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    used_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    applicable_to: {
      type: DataTypes.ENUM('all', 'category', 'product'),
      allowNull: true,
      defaultValue: 'all',
    },
    category_ids: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    product_ids: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    valid_from: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    valid_to: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    created_at: {
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
    tableName: 'coupons',
    timestamps: false,
    underscored: true,
  }
);

export default Coupon;
