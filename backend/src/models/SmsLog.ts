import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// SMS status enum
export enum SmsStatus {
  SENT = 'sent',
  FAILED = 'failed',
}

// SMS type enum
export enum SmsType {
  ORDER_CONFIRMATION = 'order_confirmation',
  ORDER_SHIPPED = 'order_shipped',
  ORDER_DELIVERED = 'order_delivered',
  RENTAL_CONFIRMATION = 'rental_confirmation',
  RENTAL_REMINDER = 'rental_reminder',
  PAYMENT_SUCCESS = 'payment_success',
  OTP = 'otp',
  PROMOTIONAL = 'promotional',
}

// SmsLog attributes interface
interface SmsLogAttributes {
  id: number;
  user_id: number | null;
  phone_number: string;
  message: string;
  sms_type: SmsType;
  status: SmsStatus;
  sent_at: Date | null;
  gateway_response: any | null;
}

// Optional attributes for creation
interface SmsLogCreationAttributes extends Optional<SmsLogAttributes, 'id' | 'user_id' | 'sent_at' | 'gateway_response'> {}

// SmsLog model
class SmsLog extends Model<SmsLogAttributes, SmsLogCreationAttributes> implements SmsLogAttributes {
  public id!: number;
  public user_id!: number | null;
  public phone_number!: string;
  public message!: string;
  public sms_type!: SmsType;
  public status!: SmsStatus;
  public sent_at!: Date | null;
  public gateway_response!: any | null;

  // Timestamps (not in DB schema)
  public readonly created_at?: Date;
}

SmsLog.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[+]?[0-9]{10,15}$/,
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sms_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(SmsStatus)),
      allowNull: false,
      defaultValue: SmsStatus.SENT,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    gateway_response: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'sms_logs',
    timestamps: false,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['phone_number'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['sms_type'],
      },
      {
        fields: ['sent_at'],
      },
    ],
  }
);

export default SmsLog;
