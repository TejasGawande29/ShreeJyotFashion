/**
 * UserProfile Model
 * Extended user information and preferences
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// UserProfile attributes interface
interface UserProfileAttributes {
  id: number;
  user_id: number;
  
  // Personal information
  first_name?: string;
  last_name?: string;
  date_of_birth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  avatar_url?: string;
  
  // Preferences
  preferred_language: string;
  preferred_currency: string;
  newsletter_subscribed: boolean;
  sms_notifications: boolean;
  email_notifications: boolean;
  
  // Additional info
  bio?: string;
  alternate_phone?: string;
  
  created_at?: Date;
  updated_at?: Date;
}

// Optional fields for creation
interface UserProfileCreationAttributes extends Optional<
  UserProfileAttributes,
  'id' | 'preferred_language' | 'preferred_currency' | 'newsletter_subscribed' | 'sms_notifications' | 'email_notifications'
> {}

// UserProfile model class
class UserProfile extends Model<UserProfileAttributes, UserProfileCreationAttributes> implements UserProfileAttributes {
  public id!: number;
  public user_id!: number;
  
  public first_name?: string;
  public last_name?: string;
  public date_of_birth?: Date;
  public gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  public avatar_url?: string;
  
  public preferred_language!: string;
  public preferred_currency!: string;
  public newsletter_subscribed!: boolean;
  public sms_notifications!: boolean;
  public email_notifications!: boolean;
  
  public bio?: string;
  public alternate_phone?: string;
  
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  /**
   * Get full name
   */
  public getFullName(): string {
    if (this.first_name && this.last_name) {
      return `${this.first_name} ${this.last_name}`;
    }
    return this.first_name || this.last_name || 'User';
  }

  /**
   * Get initials
   */
  public getInitials(): string {
    const firstName = this.first_name?.[0] || '';
    const lastName = this.last_name?.[0] || '';
    return `${firstName}${lastName}`.toUpperCase() || 'U';
  }

  /**
   * Calculate age from date of birth
   */
  public getAge(): number | null {
    if (!this.date_of_birth) return null;
    
    const today = new Date();
    const birthDate = new Date(this.date_of_birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}

// Initialize UserProfile model
UserProfile.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    
    // Personal information
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: {
          args: [2, 50],
          msg: 'First name must be between 2 and 50 characters',
        },
      },
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: {
          args: [2, 50],
          msg: 'Last name must be between 2 and 50 characters',
        },
      },
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
        isBefore: {
          args: new Date().toISOString().split('T')[0],
          msg: 'Date of birth must be in the past',
        },
      },
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Please provide a valid URL',
        },
      },
    },
    
    // Preferences
    preferred_language: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'en',
    },
    preferred_currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'INR',
    },
    newsletter_subscribed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    sms_notifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    email_notifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    
    // Additional info
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Bio cannot exceed 500 characters',
        },
      },
    },
    alternate_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: {
          args: /^[0-9+\-\s()]+$/,
          msg: 'Please provide a valid phone number',
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'user_profiles',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        name: 'idx_user_profiles_user_id',
        fields: ['user_id'],
        unique: true,
      },
    ],
  }
);

export default UserProfile;
