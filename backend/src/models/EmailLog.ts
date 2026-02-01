import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Email status enum
export enum EmailStatus {
  SENT = 'sent',
  FAILED = 'failed',
  BOUNCED = 'bounced',
}

// Email type enum
export enum EmailType {
  ORDER_CONFIRMATION = 'order_confirmation',
  ORDER_SHIPPED = 'order_shipped',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',
  RENTAL_CONFIRMATION = 'rental_confirmation',
  RENTAL_REMINDER = 'rental_reminder',
  RENTAL_OVERDUE = 'rental_overdue',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  REFUND_PROCESSED = 'refund_processed',
  REVIEW_APPROVED = 'review_approved',
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password_reset',
  PROMOTIONAL = 'promotional',
}

// EmailLog attributes interface
interface EmailLogAttributes {
  id: number;
  user_id: number | null;
  email_to: string;
  email_subject: string;
  email_body: string | null;
  email_type: EmailType;
  status: EmailStatus;
  sent_at: Date | null;
  error_message: string | null;
}

// Optional attributes for creation
interface EmailLogCreationAttributes extends Optional<EmailLogAttributes, 'id' | 'user_id' | 'email_body' | 'sent_at' | 'error_message'> {}

// EmailLog model
class EmailLog extends Model<EmailLogAttributes, EmailLogCreationAttributes> implements EmailLogAttributes {
  public id!: number;
  public user_id!: number | null;
  public email_to!: string;
  public email_subject!: string;
  public email_body!: string | null;
  public email_type!: EmailType;
  public status!: EmailStatus;
  public sent_at!: Date | null;
  public error_message!: string | null;

  // Timestamps (not in DB schema)
  public readonly created_at?: Date;
}

EmailLog.init(
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
    email_to: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    email_subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(EmailStatus)),
      allowNull: false,
      defaultValue: EmailStatus.SENT,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'email_logs',
    timestamps: false,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['email_to'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['email_type'],
      },
      {
        fields: ['sent_at'],
      },
    ],
  }
);

export default EmailLog;
