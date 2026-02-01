import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// ProductPrice attributes interface
interface ProductPriceAttributes {
  id: number;
  product_id: number;
  mrp: number;
  sale_price?: number;
  discount_percentage: number;
  rental_price_per_day?: number;
  rental_price_3days?: number;
  rental_price_7days?: number;
  security_deposit?: number;
  late_fee_per_day: number;
  effective_from: Date;
  effective_to?: Date;
  is_current: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Optional fields for creation
interface ProductPriceCreationAttributes extends Optional<ProductPriceAttributes,
  'id' | 'sale_price' | 'discount_percentage' | 'rental_price_per_day' | 
  'rental_price_3days' | 'rental_price_7days' | 'security_deposit' | 
  'late_fee_per_day' | 'effective_from' | 'effective_to' | 'is_current'
> {}

// ProductPrice model class
class ProductPrice extends Model<ProductPriceAttributes, ProductPriceCreationAttributes> 
  implements ProductPriceAttributes {
  public id!: number;
  public product_id!: number;
  public mrp!: number;
  public sale_price?: number;
  public discount_percentage!: number;
  public rental_price_per_day?: number;
  public rental_price_3days?: number;
  public rental_price_7days?: number;
  public security_deposit?: number;
  public late_fee_per_day!: number;
  public effective_from!: Date;
  public effective_to?: Date;
  public is_current!: boolean;
  
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  /**
   * Get the effective price for sale (sale_price or mrp)
   */
  public getEffectivePrice(): number {
    return this.sale_price || this.mrp;
  }

  /**
   * Get the discount amount
   */
  public getDiscountAmount(): number {
    if (this.sale_price && this.mrp > this.sale_price) {
      return this.mrp - this.sale_price;
    }
    return 0;
  }

  /**
   * Calculate actual discount percentage
   */
  public getActualDiscountPercentage(): number {
    if (this.sale_price && this.mrp > this.sale_price) {
      return ((this.mrp - this.sale_price) / this.mrp) * 100;
    }
    return 0;
  }

  /**
   * Check if price is active
   */
  public isActive(): boolean {
    const now = new Date();
    const isCurrentlyActive = this.is_current;
    const isWithinEffectivePeriod = 
      this.effective_from <= now && 
      (!this.effective_to || this.effective_to >= now);
    
    return isCurrentlyActive && isWithinEffectivePeriod;
  }

  /**
   * Get rental price for duration
   */
  public getRentalPrice(days: number): number {
    if (days <= 1 && this.rental_price_per_day) {
      return this.rental_price_per_day;
    } else if (days <= 3 && this.rental_price_3days) {
      return this.rental_price_3days;
    } else if (days <= 7 && this.rental_price_7days) {
      return this.rental_price_7days;
    } else if (this.rental_price_per_day) {
      return this.rental_price_per_day * days;
    }
    return 0;
  }
}

// Initialize ProductPrice model
ProductPrice.init(
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
      onDelete: 'CASCADE',
    },
    mrp: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: 'Maximum Retail Price',
    },
    sale_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
      comment: 'Discounted selling price',
    },
    discount_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    rental_price_per_day: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    rental_price_3days: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    rental_price_7days: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    security_deposit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    late_fee_per_day: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 100,
      validate: {
        min: 0,
      },
    },
    effective_from: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'When this price becomes effective',
    },
    effective_to: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When this price expires (null = no expiry)',
    },
    is_current: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether this is the currently active price',
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
    tableName: 'product_prices',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'idx_product_prices_product',
        fields: ['product_id'],
      },
      {
        name: 'idx_product_prices_current',
        fields: ['is_current'],
      },
      {
        name: 'idx_product_prices_effective',
        fields: ['effective_from', 'effective_to'],
      },
    ],
  }
);

export default ProductPrice;
