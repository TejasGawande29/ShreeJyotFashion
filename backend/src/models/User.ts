import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcrypt';

// User attributes interface
interface UserAttributes {
  id: number;
  email: string;
  phone?: string;
  password_hash: string;
  role: 'customer' | 'admin' | 'staff';
  is_verified: boolean;
  is_active: boolean;
  is_deleted: boolean;
  last_login_at?: Date;
  failed_login_attempts: number;
  account_locked_until?: Date;
  created_at?: Date;
  updated_at?: Date;
}

// Optional fields for creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role' | 'is_verified' | 'is_active' | 'is_deleted' | 'failed_login_attempts'> {}

// User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public phone?: string;
  public password_hash!: string;
  public role!: 'customer' | 'admin' | 'staff';
  public is_verified!: boolean;
  public is_active!: boolean;
  public is_deleted!: boolean;
  public last_login_at?: Date;
  public failed_login_attempts!: number;
  public account_locked_until?: Date;
  
  // Timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Instance methods
  
  /**
   * Compare password with hashed password
   * @param password - Plain text password
   * @returns Promise<boolean>
   */
  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }

  /**
   * Check if user account is locked
   * @returns boolean
   */
  isLocked(): boolean {
    if (!this.account_locked_until) return false;
    return new Date() < this.account_locked_until;
  }

  /**
   * Lock user account for specified duration
   * @param minutes - Duration in minutes
   */
  async lockAccount(minutes: number = 30): Promise<void> {
    this.account_locked_until = new Date(Date.now() + minutes * 60 * 1000);
    await this.save();
  }

  /**
   * Unlock user account
   */
  async unlockAccount(): Promise<void> {
    this.failed_login_attempts = 0;
    this.account_locked_until = undefined;
    await this.save();
  }

  /**
   * Record failed login attempt
   */
  async recordFailedLogin(): Promise<void> {
    this.failed_login_attempts += 1;
    
    // Lock account after 5 failed attempts
    if (this.failed_login_attempts >= 5) {
      await this.lockAccount(30); // Lock for 30 minutes
    } else {
      await this.save();
    }
  }

  /**
   * Reset failed login attempts
   */
  async resetFailedLogins(): Promise<void> {
    this.failed_login_attempts = 0;
    await this.save();
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(): Promise<void> {
    this.last_login_at = new Date();
    await this.save();
  }

  /**
   * Get user without sensitive data
   * @returns Object with safe user data
   */
  toSafeObject() {
    const { password_hash, failed_login_attempts, account_locked_until, ...safeData } = this.toJSON();
    return safeData;
  }
}

// Initialize User model
User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address',
        },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      validate: {
        is: {
          args: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
          msg: 'Please provide a valid phone number',
        },
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('customer', 'admin', 'staff'),
      allowNull: false,
      defaultValue: 'customer',
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    failed_login_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    account_locked_until: {
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
    tableName: 'users',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      // Hash password before creating user
      beforeCreate: async (user: User) => {
        if (user.password_hash) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
      // Hash password before updating if it changed
      beforeUpdate: async (user: User) => {
        if (user.changed('password_hash')) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
    },
  }
);

export default User;
