import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// OrderItem attributes interface
interface OrderItemAttributes {
  id: number;
  order_id: number;
  product_id: number;
  variant_id?: number;
  
  product_name: string;
  product_sku: string;
  variant_sku?: string;
  size?: string;
  color?: string;
  
  quantity: number;
  unit_price: number;
  subtotal: number;
  
  created_at?: Date;
  updated_at?: Date;
}

// Optional fields for creation
interface OrderItemCreationAttributes extends Optional<OrderItemAttributes,
  'id' | 'variant_id' | 'variant_sku' | 'size' | 'color'
> {}

// OrderItem model class
class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> 
  implements OrderItemAttributes {
  public id!: number;
  public order_id!: number;
  public product_id!: number;
  public variant_id?: number;
  
  public product_name!: string;
  public product_sku!: string;
  public variant_sku?: string;
  public size?: string;
  public color?: string;
  
  public quantity!: number;
  public unit_price!: number;
  public subtotal!: number;
  
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  /**
   * Calculate subtotal
   */
  public calculateSubtotal(): number {
    return this.unit_price * this.quantity;
  }
}

// Initialize OrderItem model
OrderItem.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    variant_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'product_variants',
        key: 'id',
      },
    },
    
    // Snapshot of product data at order time
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    product_sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    variant_sku: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
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
    tableName: 'order_items',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'idx_order_items_order',
        fields: ['order_id'],
      },
      {
        name: 'idx_order_items_product',
        fields: ['product_id'],
      },
      {
        name: 'idx_order_items_variant',
        fields: ['variant_id'],
      },
    ],
    hooks: {
      beforeCreate: (orderItem) => {
        orderItem.subtotal = orderItem.unit_price * orderItem.quantity;
      },
      beforeUpdate: (orderItem) => {
        if (orderItem.changed('quantity') || orderItem.changed('unit_price')) {
          orderItem.subtotal = orderItem.unit_price * orderItem.quantity;
        }
      },
    },
  }
);

export default OrderItem;
