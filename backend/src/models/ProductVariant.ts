import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// ProductVariant attributes interface
interface ProductVariantAttributes {
  id: number;
  product_id: number;
  size?: string;
  color?: string;
  color_code?: string;
  stock_quantity: number;
  stock_allocated: number;
  sku_variant?: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Optional fields for creation
interface ProductVariantCreationAttributes extends Optional<ProductVariantAttributes, 
  'id' | 'size' | 'color' | 'color_code' | 'stock_quantity' | 'stock_allocated' | 
  'sku_variant' | 'is_active'
> {}

// ProductVariant model class
class ProductVariant extends Model<ProductVariantAttributes, ProductVariantCreationAttributes> implements ProductVariantAttributes {
  public id!: number;
  public product_id!: number;
  public size?: string;
  public color?: string;
  public color_code?: string;
  public stock_quantity!: number;
  public stock_allocated!: number;
  public sku_variant?: string;
  public is_active!: boolean;
  
  // Timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Association placeholders
  public readonly product?: any;

  /**
   * Get available stock (total - allocated)
   */
  getAvailableStock(): number {
    return Math.max(0, this.stock_quantity - this.stock_allocated);
  }

  /**
   * Check if variant is in stock
   */
  isInStock(): boolean {
    return this.getAvailableStock() > 0 && this.is_active;
  }

  /**
   * Reserve stock for order/rental
   */
  async reserveStock(quantity: number): Promise<boolean> {
    if (this.getAvailableStock() < quantity) {
      return false;
    }

    this.stock_allocated += quantity;
    await this.save();
    return true;
  }

  /**
   * Release reserved stock
   */
  async releaseStock(quantity: number): Promise<void> {
    this.stock_allocated = Math.max(0, this.stock_allocated - quantity);
    await this.save();
  }

  /**
   * Add stock
   */
  async addStock(quantity: number): Promise<void> {
    this.stock_quantity += quantity;
    await this.save();
  }

  /**
   * Reduce stock (for completed sales)
   */
  async reduceStock(quantity: number): Promise<boolean> {
    if (this.stock_quantity < quantity) {
      return false;
    }

    this.stock_quantity -= quantity;
    this.stock_allocated = Math.max(0, this.stock_allocated - quantity);
    await this.save();
    return true;
  }
}

// Initialize ProductVariant model
ProductVariant.init(
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
    size: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    color_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: {
          args: /^#[0-9A-Fa-f]{6}$/,
          msg: 'Color code must be a valid hex color (e.g., #FF0000)',
        },
      },
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Stock quantity cannot be negative',
        },
      },
    },
    stock_allocated: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Stock allocated cannot be negative',
        },
      },
    },
    sku_variant: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: 'product_variants',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default ProductVariant;
