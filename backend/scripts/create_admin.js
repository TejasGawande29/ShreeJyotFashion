/**
 * Script to create an admin user
 * Run with: node backend/scripts/create_admin.js
 */

const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'shreejyot_fashion',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  dialect: 'postgres',
  logging: false,
});

// Define User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(20),
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
  failed_login_attempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  account_locked_until: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

async function createAdminUser() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const adminEmail = 'admin@shreejyot.com';
    const adminPassword = 'Admin@123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log(`⚠️  Admin user already exists: ${adminEmail}`);
      
      // Update password if needed
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await existingAdmin.update({
        password_hash: hashedPassword,
        role: 'admin',
        is_verified: true,
        is_active: true,
        is_deleted: false,
        failed_login_attempts: 0,
        account_locked_until: null,
      });
      
      console.log('✅ Admin user password updated');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
      console.log('Role:', 'admin');
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Create admin user
      const admin = await User.create({
        email: adminEmail,
        phone: '+91 9876543210',
        password_hash: hashedPassword,
        role: 'admin',
        is_verified: true,
        is_active: true,
        is_deleted: false,
        failed_login_attempts: 0,
        account_locked_until: null,
      });

      console.log('✅ Admin user created successfully');
      console.log('Email:', admin.email);
      console.log('Password:', adminPassword);
      console.log('Role:', admin.role);
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createAdminUser();
