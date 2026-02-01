/**
 * Address Model
 * Manages shipping and billing addresses for users
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Address attributes interface
interface AddressAttributes {
  id: number;
  user_id: number;
  address_type: 'shipping' | 'billing' | 'both';
  is_default: boolean;
  label: string; // e.g., "Home", "Office", "Parents' House"
  
  // Contact information
  recipient_name: string;
  phone: string;
  email?: string;
  
  // Address details
  address_line1: string;
  address_line2?: string;
  landmark?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  
  // Metadata
  is_deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Optional fields for creation
interface AddressCreationAttributes extends Optional<AddressAttributes, 'id' | 'is_default' | 'is_deleted' | 'country'> {}

// Address model class
class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  public id!: number;
  public user_id!: number;
  public address_type!: 'shipping' | 'billing' | 'both';
  public is_default!: boolean;
  public label!: string;
  
  public recipient_name!: string;
  public phone!: string;
  public email?: string;
  
  public address_line1!: string;
  public address_line2?: string;
  public landmark?: string;
  public city!: string;
  public state!: string;
  public postal_code!: string;
  public country!: string;
  
  public is_deleted!: boolean;
  
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  /**
   * Get formatted address string
   */
  public getFormattedAddress(): string {
    const parts = [
      this.address_line1,
      this.address_line2,
      this.landmark,
      this.city,
      this.state,
      this.postal_code,
      this.country,
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  /**
   * Check if address is complete
   */
  public isComplete(): boolean {
    return !!(
      this.recipient_name &&
      this.phone &&
      this.address_line1 &&
      this.city &&
      this.state &&
      this.postal_code &&
      this.country
    );
  }
}

// Initialize Address model
Address.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    address_type: {
      type: DataTypes.ENUM('shipping', 'billing', 'both'),
      allowNull: false,
      defaultValue: 'both',
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    label: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Home',
      validate: {
        notEmpty: {
          msg: 'Label cannot be empty',
        },
      },
    },
    
    // Contact information
    recipient_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Recipient name is required',
        },
        len: {
          args: [2, 100],
          msg: 'Recipient name must be between 2 and 100 characters',
        },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Phone number is required',
        },
        is: {
          args: /^[0-9+\-\s()]+$/,
          msg: 'Please provide a valid phone number',
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address',
        },
      },
    },
    
    // Address details
    address_line1: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Address line 1 is required',
        },
        len: {
          args: [5, 200],
          msg: 'Address must be between 5 and 200 characters',
        },
      },
    },
    address_line2: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    landmark: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'City is required',
        },
      },
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'State is required',
        },
      },
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Postal code is required',
        },
      },
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'India',
    },
    
    // Metadata
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'addresses',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        name: 'idx_addresses_user_id',
        fields: ['user_id'],
      },
      {
        name: 'idx_addresses_is_default',
        fields: ['user_id', 'is_default'],
      },
      {
        name: 'idx_addresses_type',
        fields: ['user_id', 'address_type'],
      },
    ],
  }
);

export default Address;
