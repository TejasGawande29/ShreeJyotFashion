-- Migration: Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id INTEGER PRIMARY KEY REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  date_of_birth DATE,
  gender VARCHAR(50),
  bio TEXT,
  avatar_url TEXT,
  preferred_language VARCHAR(2) NOT NULL DEFAULT 'en',
  preferred_currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  notifications_email BOOLEAN NOT NULL DEFAULT TRUE,
  notifications_sms BOOLEAN NOT NULL DEFAULT TRUE,
  notifications_push BOOLEAN NOT NULL DEFAULT TRUE,
  marketing_emails BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- Migration: Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  address_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
  address_type VARCHAR(20) NOT NULL,
  recipient_name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  alternate_phone VARCHAR(15),
  address_line1 VARCHAR(200) NOT NULL,
  address_line2 VARCHAR(200),
  landmark VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'India',
  postal_code VARCHAR(10) NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_is_default ON addresses(is_default);
CREATE INDEX IF NOT EXISTS idx_addresses_address_type ON addresses(address_type);
CREATE INDEX IF NOT EXISTS idx_addresses_is_deleted ON addresses(is_deleted);
CREATE INDEX IF NOT EXISTS idx_addresses_created_at ON addresses(created_at);
