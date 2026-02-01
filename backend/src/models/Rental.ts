import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Rental status enum - matches database enum
export enum RentalStatus {
  BOOKED = 'booked',
  CONFIRMED = 'confirmed',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  ACTIVE = 'active',
  RETURN_REQUESTED = 'return_requested',
  PICKUP_SCHEDULED = 'pickup_scheduled',
  RETURNED = 'returned',
  INSPECTING = 'inspecting',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

// Deposit status enum - matches database enum
export enum DepositStatus {
  HELD = 'held',
  REFUNDED = 'refunded',
  FORFEITED = 'forfeited',
  PARTIALLY_REFUNDED = 'partially_refunded'
}

// Delivery type enum - matches database enum
export enum DeliveryType {
  STANDARD = 'standard',
  EXPRESS = 'express',
  PICKUP = 'pickup'
}

// Rental attributes interface - matches database schema exactly
interface RentalAttributes {
  id: number;
  order_id: number;
  user_id: number;
  product_id: number;
  variant_id: number | null;
  rental_start_date: Date;
  rental_end_date: Date;
  actual_return_date: Date | null;
  rental_days: number;
  daily_rate: number;
  total_rental_amount: number;
  security_deposit: number;
  late_fee: number;
  damage_charges: number;
  refund_amount: number;
  rental_status: RentalStatus;
  deposit_status: DepositStatus;
  delivery_type: DeliveryType;
  is_extended: boolean;
  extension_count: number;
  created_at?: Date;
  updated_at?: Date;
}

// Optional fields during creation
interface RentalCreationAttributes extends Optional<RentalAttributes, 
  'id' | 'variant_id' | 'actual_return_date' | 'late_fee' | 'damage_charges' | 
  'refund_amount' | 'is_extended' | 'extension_count' | 'created_at' | 'updated_at'> {}

class Rental extends Model<RentalAttributes, RentalCreationAttributes> implements RentalAttributes {
  public id!: number;
  public order_id!: number;
  public user_id!: number;
  public product_id!: number;
  public variant_id!: number | null;
  public rental_start_date!: Date;
  public rental_end_date!: Date;
  public actual_return_date!: Date | null;
  public rental_days!: number;
  public daily_rate!: number;
  public total_rental_amount!: number;
  public security_deposit!: number;
  public late_fee!: number;
  public damage_charges!: number;
  public refund_amount!: number;
  public rental_status!: RentalStatus;
  public deposit_status!: DepositStatus;
  public delivery_type!: DeliveryType;
  public is_extended!: boolean;
  public extension_count!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Rental.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    variant_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    rental_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    rental_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    actual_return_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    rental_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    daily_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_rental_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    security_deposit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    late_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    damage_charges: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    rental_status: {
      type: DataTypes.ENUM(
        'booked', 'confirmed', 'out_for_delivery', 'active', 'return_requested',
        'pickup_scheduled', 'returned', 'inspecting', 'completed', 'overdue', 'cancelled'
      ),
      allowNull: false,
      defaultValue: 'booked',
    },
    deposit_status: {
      type: DataTypes.ENUM('held', 'refunded', 'forfeited', 'partially_refunded'),
      allowNull: false,
      defaultValue: 'held',
    },
    delivery_type: {
      type: DataTypes.ENUM('standard', 'express', 'pickup'),
      allowNull: false,
      defaultValue: 'standard',
    },
    is_extended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    extension_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'rentals',
    sequelize,
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Rental;
