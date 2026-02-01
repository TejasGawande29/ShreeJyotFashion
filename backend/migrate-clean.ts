/**
 * Clean up old tables and run fresh migrations
 */

import { sequelize } from './src/config/database';

const cleanAndMigrate = async () => {
  try {
    console.log('🔄 Cleaning up old tables...\n');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Drop tables if they exist
    console.log('🗑️  Dropping old tables...');
    await sequelize.query('DROP TABLE IF EXISTS addresses CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS user_profiles CASCADE;');
    await sequelize.query('DROP TYPE IF EXISTS enum_user_profiles_gender CASCADE;');
    await sequelize.query('DROP TYPE IF EXISTS gender_type CASCADE;');
    console.log('✅ Old tables dropped\n');

    // Now sync the models
    const { default: UserProfile } = await import('./src/models/UserProfile');
    const { default: Address } = await import('./src/models/Address');

    console.log('📋 Creating user_profiles table...');
    await UserProfile.sync();
    console.log('✅ user_profiles table created\n');

    console.log('📋 Creating addresses table...');
    await Address.sync();
    console.log('✅ addresses table created\n');

    console.log('🎉 All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

cleanAndMigrate();
