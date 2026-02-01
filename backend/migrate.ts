/**
 * Run migrations programmatically
 * Creates user_profiles and addresses tables
 */

import { sequelize } from './src/config/database';
import User from './src/models/User';
import UserProfile from './src/models/UserProfile';
import Address from './src/models/Address';

const runMigrations = async () => {
  try {
    console.log('🔄 Starting migrations...\n');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Sync UserProfile table
    console.log('📋 Creating user_profiles table...');
    await UserProfile.sync({ alter: true });
    console.log('✅ user_profiles table created\n');

    // Sync Address table
    console.log('📋 Creating addresses table...');
    await Address.sync({ alter: true });
    console.log('✅ addresses table created\n');

    console.log('🎉 All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();
