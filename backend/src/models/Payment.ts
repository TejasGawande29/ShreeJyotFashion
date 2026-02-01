import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Payment Gateway Enum (matches DB)
export enum PaymentGateway {
  RAZORPAY = 'razorpay',
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  COD = 'cod'
}

// Payment Method Enum (matches DB)
export enum PaymentMethod {
  CARD = 'card',
  NETBANKING = 'netbanking',
  UPI = 'upi',
  WALLET = 'wallet',
  COD = 'cod'
}

// Payment Status Enum (matches DB)
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  CANCELLED = 'cancelled'
}

// Payment attributes interface (aligned with actual DB structure)
interface PaymentAttributes {
  id: number;
  order_id: number;
  user_id: number;
  payment_gateway: PaymentGateway;
  transaction_id?: string;
  payment_method: PaymentMethod;
  amount: number;
  currency?: string;
  status: PaymentStatus;
  payment_date?: Date;
  refund_amount?: number;
  refund_date?: Date;
  gateway_response?: any;
  failure_reason?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Optional fields for creation
interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'transaction_id' | 'currency' | 'status' | 'payment_date' | 'refund_amount' | 'refund_date' | 'gateway_response' | 'failure_reason'> {}

// Payment model class (aligned with actual DB structure)
class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public order_id!: number;
  public user_id!: number;
  public payment_gateway!: PaymentGateway;
  public transaction_id?: string;
  public payment_method!: PaymentMethod;
  public amount!: number;
  public currency?: string;
  public status!: PaymentStatus;
  public payment_date?: Date;
  public refund_amount?: number;
  public refund_date?: Date;
  public gateway_response?: any;
  public failure_reason?: string;
  
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

// Initialize Payment model (aligned with actual DB structure)
Payment.init(
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
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    payment_gateway: {
      type: DataTypes.ENUM('razorpay', 'stripe', 'paypal', 'cod'),
      allowNull: false,
      defaultValue: 'razorpay',
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_method: {
      type: DataTypes.ENUM('card', 'netbanking', 'upi', 'wallet', 'cod'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: true,
      defaultValue: 'INR',
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    refund_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    gateway_response: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    failure_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: true,
    underscored: true,
  }
);

export default Payment;
