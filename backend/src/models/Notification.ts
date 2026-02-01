import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Notification type enum
export enum NotificationType {
  ORDER_PLACED = 'order_placed',
  ORDER_SHIPPED = 'order_shipped',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  RENTAL_CONFIRMED = 'rental_confirmed',
  RENTAL_REMINDER = 'rental_reminder',
  RENTAL_OVERDUE = 'rental_overdue',
  REFUND_PROCESSED = 'refund_processed',
  REVIEW_APPROVED = 'review_approved',
  PROMOTIONAL = 'promotional',
}

// Notification attributes interface
interface NotificationAttributes {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  action_url: string | null;
  is_read: boolean;
  read_at: Date | null;
  created_at: Date;
}

// Optional attributes for creation
interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'action_url' | 'is_read' | 'read_at' | 'created_at'> {}

// Notification model
class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: number;
  public user_id!: number;
  public type!: NotificationType;
  public title!: string;
  public message!: string;
  public action_url!: string | null;
  public is_read!: boolean;
  public read_at!: Date | null;
  public created_at!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM(...Object.values(NotificationType)),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    action_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: false,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['is_read'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

export default Notification;
