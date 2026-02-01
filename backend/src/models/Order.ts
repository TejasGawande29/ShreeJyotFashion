import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Order attributes interface
interface OrderAttributes {
  id: number;
  order_number: string;
  user_id: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  
  // Shipping address
  shipping_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  
  // Billing address (optional, can use shipping)
  billing_name?: string;
  billing_email?: string;
  billing_phone?: string;
  billing_address_line1?: string;
  billing_address_line2?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postal_code?: string;
  billing_country?: string;
  
  notes?: string;
  tracking_number?: string;
  
  ordered_at: Date;
  confirmed_at?: Date;
  shipped_at?: Date;
  delivered_at?: Date;
  cancelled_at?: Date;
  
  created_at?: Date;
  updated_at?: Date;
}

// Optional fields for creation
interface OrderCreationAttributes extends Optional<OrderAttributes,
  'id' | 'order_number' | 'status' | 'payment_status' | 'shipping_amount' | 
  'discount_amount' | 'shipping_address_line2' | 'billing_name' | 'billing_email' | 
  'billing_phone' | 'billing_address_line1' | 'billing_address_line2' | 
  'billing_city' | 'billing_state' | 'billing_postal_code' | 'billing_country' |
  'notes' | 'tracking_number' | 'payment_method' | 'ordered_at' | 'confirmed_at' | 
  'shipped_at' | 'delivered_at' | 'cancelled_at'
> {}

// Order model class
class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public order_number!: string;
  public user_id!: number;
  public status!: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  public payment_status!: 'pending' | 'paid' | 'failed' | 'refunded';
  public payment_method?: string;
  public subtotal!: number;
  public tax_amount!: number;
  public shipping_amount!: number;
  public discount_amount!: number;
  public total_amount!: number;
  
  public shipping_name!: string;
  public shipping_email!: string;
  public shipping_phone!: string;
  public shipping_address_line1!: string;
  public shipping_address_line2?: string;
  public shipping_city!: string;
  public shipping_state!: string;
  public shipping_postal_code!: string;
  public shipping_country!: string;
  
  public billing_name?: string;
  public billing_email?: string;
  public billing_phone?: string;
  public billing_address_line1?: string;
  public billing_address_line2?: string;
  public billing_city?: string;
  public billing_state?: string;
  public billing_postal_code?: string;
  public billing_country?: string;
  
  public notes?: string;
  public tracking_number?: string;
  
  public ordered_at!: Date;
  public confirmed_at?: Date;
  public shipped_at?: Date;
  public delivered_at?: Date;
  public cancelled_at?: Date;
  
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  /**
   * Generate unique order number
   */
  public static generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  /**
   * Check if order can be cancelled
   */
  public canBeCancelled(): boolean {
    return ['pending', 'confirmed'].includes(this.status);
  }

  /**
   * Check if order is completed
   */
  public isCompleted(): boolean {
    return this.status === 'delivered';
  }

  /**
   * Check if order is active (not cancelled/delivered)
   */
  public isActive(): boolean {
    return !['cancelled', 'delivered', 'returned'].includes(this.status);
  }

  /**
   * Get order age in days
   */
  public getAgeDays(): number {
    const now = new Date();
    const orderDate = new Date(this.ordered_at);
    const diffTime = Math.abs(now.getTime() - orderDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

// Initialize Order model
Order.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    order_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'),
      allowNull: false,
      defaultValue: 'pending',
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    shipping_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    
    // Shipping address
    shipping_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    shipping_email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    shipping_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    shipping_address_line1: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    shipping_address_line2: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    shipping_city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    shipping_state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    shipping_postal_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    shipping_country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'India',
    },
    
    // Billing address
    billing_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    billing_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    billing_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    billing_address_line1: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    billing_address_line2: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    billing_city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    billing_state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    billing_postal_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    billing_country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tracking_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    
    ordered_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    confirmed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    shipped_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelled_at: {
      type: DataTypes.DATE,
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
    tableName: 'orders',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'idx_orders_user',
        fields: ['user_id'],
      },
      {
        name: 'idx_orders_status',
        fields: ['status'],
      },
      {
        name: 'idx_orders_payment_status',
        fields: ['payment_status'],
      },
      {
        name: 'idx_orders_order_number',
        fields: ['order_number'],
        unique: true,
      },
      {
        name: 'idx_orders_ordered_at',
        fields: ['ordered_at'],
      },
    ],
    hooks: {
      beforeCreate: async (order) => {
        if (!order.order_number) {
          order.order_number = Order.generateOrderNumber();
        }
      },
    },
  }
);

export default Order;
