-- ============================================================================
-- Shreejyot Fashion - E-commerce Database Schema (PostgreSQL)
-- Version: 1.0
-- Date: October 19, 2025
-- Description: Complete database schema for e-commerce platform with 
--              sales and rental functionality
-- ============================================================================

-- Drop existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS sms_logs CASCADE;
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS coupon_usage CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS review_helpful CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_status_log CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS rental_returns CASCADE;
DROP TABLE IF EXISTS rentals CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS product_prices CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'manager', 'staff');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE address_type AS ENUM ('home', 'work', 'other');
CREATE TYPE order_type AS ENUM ('sale', 'rental');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE rental_status AS ENUM ('booked', 'confirmed', 'out_for_delivery', 'active', 'return_requested', 'pickup_scheduled', 'returned', 'inspecting', 'completed', 'overdue', 'cancelled');
CREATE TYPE deposit_status AS ENUM ('held', 'refunded', 'forfeited', 'partially_refunded');
CREATE TYPE product_condition AS ENUM ('excellent', 'good', 'fair', 'damaged', 'unusable');
CREATE TYPE payment_method AS ENUM ('credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cod');
CREATE TYPE payment_gateway AS ENUM ('razorpay', 'stripe', 'paytm', 'phonepe', 'cod');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE notification_type AS ENUM ('order_placed', 'order_shipped', 'order_delivered', 'order_cancelled', 'payment_success', 'payment_failed', 'rental_confirmed', 'rental_reminder', 'rental_overdue', 'refund_processed', 'review_approved', 'promotional');
CREATE TYPE image_type AS ENUM ('primary', 'gallery', 'thumbnail');
CREATE TYPE delivery_type AS ENUM ('standard', 'express', 'pickup');
CREATE TYPE setting_type AS ENUM ('string', 'number', 'boolean', 'json');
CREATE TYPE banner_position AS ENUM ('homepage_main', 'homepage_secondary', 'category', 'product_detail');
CREATE TYPE email_status AS ENUM ('sent', 'failed', 'bounced');
CREATE TYPE sms_status AS ENUM ('sent', 'failed');
CREATE TYPE refund_status AS ENUM ('pending', 'processed', 'failed');
CREATE TYPE applicable_to AS ENUM ('all', 'sale', 'rental');

-- ============================================================================
-- TABLE: users
-- Description: Core user accounts table
-- ============================================================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active, is_deleted);

COMMENT ON TABLE users IS 'Core user accounts for customers and admins';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password';

-- ============================================================================
-- TABLE: user_profiles
-- Description: Extended user information
-- ============================================================================
CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    gender gender_type,
    avatar_url VARCHAR(500),
    aadhar_number VARCHAR(20),
    pan_number VARCHAR(20),
    id_proof_url VARCHAR(500),
    id_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_profiles_user ON user_profiles(user_id);

COMMENT ON TABLE user_profiles IS 'Extended user profile information';
COMMENT ON COLUMN user_profiles.aadhar_number IS 'For rental ID verification';

-- ============================================================================
-- TABLE: addresses
-- Description: User shipping and billing addresses
-- ============================================================================
CREATE TABLE addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    address_type address_type NOT NULL DEFAULT 'home',
    full_name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_default BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_addresses_default ON addresses(user_id, is_default);

COMMENT ON TABLE addresses IS 'User shipping and billing addresses';

-- ============================================================================
-- TABLE: categories
-- Description: Product categories with hierarchical structure
-- ============================================================================
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active, is_deleted);

COMMENT ON TABLE categories IS 'Hierarchical product categories (Men, Women, Kids, etc.)';
COMMENT ON COLUMN categories.parent_id IS 'NULL for root categories';

-- ============================================================================
-- TABLE: products
-- Description: Core product information
-- ============================================================================
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    material VARCHAR(100),
    care_instructions TEXT,
    is_sale BOOLEAN DEFAULT TRUE,
    is_rental BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    sales_count INT DEFAULT 0,
    rental_count INT DEFAULT 0,
    meta_title VARCHAR(200),
    meta_description TEXT,
    meta_keywords VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_active ON products(is_active, is_deleted);
CREATE INDEX idx_products_sale_rental ON products(is_sale, is_rental, is_active);
CREATE INDEX idx_products_featured ON products(is_featured, is_active);

-- Full-text search index
CREATE INDEX idx_products_search ON products USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

COMMENT ON TABLE products IS 'Core product catalog';
COMMENT ON COLUMN products.is_sale IS 'Available for purchase';
COMMENT ON COLUMN products.is_rental IS 'Available for rent';

-- ============================================================================
-- TABLE: product_variants
-- Description: Product variations (size, color, stock)
-- ============================================================================
CREATE TABLE product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    size VARCHAR(50),
    color VARCHAR(50),
    color_code VARCHAR(20),
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    stock_allocated INT DEFAULT 0 CHECK (stock_allocated >= 0),
    sku_variant VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku_variant);
CREATE INDEX idx_product_variants_stock ON product_variants(stock_quantity, stock_allocated);

COMMENT ON TABLE product_variants IS 'Product size, color, and stock variants';
COMMENT ON COLUMN product_variants.stock_allocated IS 'Stock currently on rent or reserved';

-- ============================================================================
-- TABLE: product_prices
-- Description: Product pricing information
-- ============================================================================
CREATE TABLE product_prices (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    mrp DECIMAL(10,2) NOT NULL CHECK (mrp >= 0),
    sale_price DECIMAL(10,2) CHECK (sale_price >= 0),
    discount_percentage DECIMAL(5,2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    rental_price_per_day DECIMAL(10,2) CHECK (rental_price_per_day >= 0),
    rental_price_3days DECIMAL(10,2) CHECK (rental_price_3days >= 0),
    rental_price_7days DECIMAL(10,2) CHECK (rental_price_7days >= 0),
    security_deposit DECIMAL(10,2) CHECK (security_deposit >= 0),
    late_fee_per_day DECIMAL(10,2) DEFAULT 100 CHECK (late_fee_per_day >= 0),
    effective_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    effective_to TIMESTAMP,
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_product_prices_product ON product_prices(product_id);
CREATE INDEX idx_product_prices_current ON product_prices(is_current);

COMMENT ON TABLE product_prices IS 'Product pricing with history tracking';
COMMENT ON COLUMN product_prices.is_current IS 'Currently active price';

-- ============================================================================
-- TABLE: product_images
-- Description: Product image gallery
-- ============================================================================
CREATE TABLE product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type image_type DEFAULT 'gallery',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id, is_primary);

COMMENT ON TABLE product_images IS 'Product image gallery';

-- ============================================================================
-- TABLE: cart_items
-- Description: Shopping cart items
-- ============================================================================
CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    variant_id BIGINT,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    UNIQUE(user_id, product_id, variant_id)
);

CREATE INDEX idx_cart_items_user ON cart_items(user_id);

COMMENT ON TABLE cart_items IS 'User shopping cart';

-- ============================================================================
-- TABLE: wishlist_items
-- Description: User wishlist
-- ============================================================================
CREATE TABLE wishlist_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlist_items_user ON wishlist_items(user_id);

COMMENT ON TABLE wishlist_items IS 'User wishlist';

-- ============================================================================
-- TABLE: orders
-- Description: Customer orders (both sale and rental)
-- ============================================================================
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_type order_type NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
    tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
    shipping_charges DECIMAL(10,2) DEFAULT 0 CHECK (shipping_charges >= 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    coupon_code VARCHAR(50),
    status order_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    shipping_address_id BIGINT,
    billing_address_id BIGINT,
    delivery_type delivery_type DEFAULT 'standard',
    tracking_number VARCHAR(100),
    notes TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (shipping_address_id) REFERENCES addresses(id),
    FOREIGN KEY (billing_address_id) REFERENCES addresses(id)
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status, payment_status);
CREATE INDEX idx_orders_type ON orders(order_type);
CREATE INDEX idx_orders_date ON orders(ordered_at);

COMMENT ON TABLE orders IS 'Customer orders for both sales and rentals';

-- ============================================================================
-- TABLE: order_items
-- Description: Items in an order
-- ============================================================================
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    variant_id BIGINT,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) NOT NULL,
    size VARCHAR(50),
    color VARCHAR(50),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    discount DECIMAL(10,2) DEFAULT 0 CHECK (discount >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

COMMENT ON TABLE order_items IS 'Order line items with product snapshots';

-- ============================================================================
-- TABLE: rentals
-- Description: Rental-specific order details
-- ============================================================================
CREATE TABLE rentals (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    variant_id BIGINT,
    rental_start_date DATE NOT NULL,
    rental_end_date DATE NOT NULL,
    actual_return_date DATE,
    rental_days INT NOT NULL CHECK (rental_days > 0),
    daily_rate DECIMAL(10,2) NOT NULL CHECK (daily_rate >= 0),
    total_rental_amount DECIMAL(10,2) NOT NULL CHECK (total_rental_amount >= 0),
    security_deposit DECIMAL(10,2) NOT NULL CHECK (security_deposit >= 0),
    late_fee DECIMAL(10,2) DEFAULT 0 CHECK (late_fee >= 0),
    damage_charges DECIMAL(10,2) DEFAULT 0 CHECK (damage_charges >= 0),
    refund_amount DECIMAL(10,2) DEFAULT 0 CHECK (refund_amount >= 0),
    rental_status rental_status NOT NULL DEFAULT 'booked',
    deposit_status deposit_status NOT NULL DEFAULT 'held',
    delivery_type delivery_type NOT NULL DEFAULT 'delivery',
    is_extended BOOLEAN DEFAULT FALSE,
    extension_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);

CREATE INDEX idx_rentals_order ON rentals(order_id);
CREATE INDEX idx_rentals_user ON rentals(user_id);
CREATE INDEX idx_rentals_product ON rentals(product_id);
CREATE INDEX idx_rentals_status ON rentals(rental_status);
CREATE INDEX idx_rentals_dates ON rentals(rental_start_date, rental_end_date);
CREATE INDEX idx_rentals_overdue ON rentals(rental_end_date, rental_status) 
    WHERE rental_status NOT IN ('completed', 'cancelled');

COMMENT ON TABLE rentals IS 'Rental booking details and tracking';
COMMENT ON COLUMN rentals.rental_days IS 'Booked rental duration';

-- ============================================================================
-- TABLE: rental_returns
-- Description: Rental return inspection details
-- ============================================================================
CREATE TABLE rental_returns (
    id BIGSERIAL PRIMARY KEY,
    rental_id BIGINT UNIQUE NOT NULL,
    return_initiated_at TIMESTAMP,
    pickup_scheduled_at TIMESTAMP,
    product_received_at TIMESTAMP,
    inspected_at TIMESTAMP,
    inspected_by BIGINT,
    product_condition product_condition NOT NULL DEFAULT 'good',
    damage_description TEXT,
    damage_images JSONB,
    damage_charges DECIMAL(10,2) DEFAULT 0 CHECK (damage_charges >= 0),
    cleaning_charges DECIMAL(10,2) DEFAULT 0 CHECK (cleaning_charges >= 0),
    late_return_days INT DEFAULT 0 CHECK (late_return_days >= 0),
    late_fee DECIMAL(10,2) DEFAULT 0 CHECK (late_fee >= 0),
    total_deductions DECIMAL(10,2) DEFAULT 0 CHECK (total_deductions >= 0),
    refund_amount DECIMAL(10,2) NOT NULL CHECK (refund_amount >= 0),
    refund_status refund_status NOT NULL DEFAULT 'pending',
    refund_processed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE,
    FOREIGN KEY (inspected_by) REFERENCES users(id)
);

CREATE INDEX idx_rental_returns_rental ON rental_returns(rental_id);
CREATE INDEX idx_rental_returns_status ON rental_returns(refund_status);

COMMENT ON TABLE rental_returns IS 'Rental return and inspection details';

-- ============================================================================
-- TABLE: payments
-- Description: Payment transactions
-- ============================================================================
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    payment_gateway payment_gateway NOT NULL,
    transaction_id VARCHAR(255),
    payment_method payment_method NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(10) DEFAULT 'INR',
    status payment_status NOT NULL DEFAULT 'pending',
    payment_date TIMESTAMP,
    refund_amount DECIMAL(10,2) DEFAULT 0 CHECK (refund_amount >= 0),
    refund_date TIMESTAMP,
    gateway_response JSONB,
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);
CREATE INDEX idx_payments_status ON payments(status);

COMMENT ON TABLE payments IS 'Payment transactions and gateway records';

-- ============================================================================
-- TABLE: order_status_log
-- Description: Track all status changes for orders
-- ============================================================================
CREATE TABLE order_status_log (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by BIGINT,
    notes TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id)
);

CREATE INDEX idx_order_status_log_order ON order_status_log(order_id);
CREATE INDEX idx_order_status_log_date ON order_status_log(changed_at);

COMMENT ON TABLE order_status_log IS 'Audit trail for order status changes';

-- ============================================================================
-- TABLE: reviews
-- Description: Product reviews and ratings
-- ============================================================================
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    images JSONB,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    UNIQUE(product_id, user_id, order_id)
);

CREATE INDEX idx_reviews_product ON reviews(product_id, is_approved);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

COMMENT ON TABLE reviews IS 'Product reviews and ratings';

-- ============================================================================
-- TABLE: review_helpful
-- Description: Track which users found reviews helpful
-- ============================================================================
CREATE TABLE review_helpful (
    id BIGSERIAL PRIMARY KEY,
    review_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(review_id, user_id)
);

CREATE INDEX idx_review_helpful_review ON review_helpful(review_id);

COMMENT ON TABLE review_helpful IS 'Review helpfulness votes';

-- ============================================================================
-- TABLE: coupons
-- Description: Discount coupons and promotional codes
-- ============================================================================
CREATE TABLE coupons (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type discount_type NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value >= 0),
    min_order_value DECIMAL(10,2) DEFAULT 0 CHECK (min_order_value >= 0),
    max_discount DECIMAL(10,2),
    usage_limit INT,
    usage_per_user INT DEFAULT 1,
    used_count INT DEFAULT 0,
    applicable_to applicable_to DEFAULT 'all',
    category_ids JSONB,
    product_ids JSONB,
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_valid ON coupons(valid_from, valid_to, is_active);

COMMENT ON TABLE coupons IS 'Promotional discount coupons';

-- ============================================================================
-- TABLE: coupon_usage
-- Description: Track coupon usage by users
-- ============================================================================
CREATE TABLE coupon_usage (
    id BIGSERIAL PRIMARY KEY,
    coupon_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL CHECK (discount_amount >= 0),
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE INDEX idx_coupon_usage_coupon ON coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user ON coupon_usage(user_id);

COMMENT ON TABLE coupon_usage IS 'Coupon usage tracking';

-- ============================================================================
-- TABLE: notifications
-- Description: User notifications
-- ============================================================================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

COMMENT ON TABLE notifications IS 'User notifications';

-- ============================================================================
-- TABLE: settings
-- Description: Application-wide settings
-- ============================================================================
CREATE TABLE settings (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type setting_type NOT NULL DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_key ON settings(key);

COMMENT ON TABLE settings IS 'Application configuration settings';

-- ============================================================================
-- TABLE: banners
-- Description: Homepage and promotional banners
-- ============================================================================
CREATE TABLE banners (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    mobile_image_url VARCHAR(500),
    link_url VARCHAR(500),
    position banner_position NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP,
    valid_to TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_banners_position ON banners(position, is_active);
CREATE INDEX idx_banners_active ON banners(is_active);

COMMENT ON TABLE banners IS 'Promotional banners';

-- ============================================================================
-- TABLE: email_logs
-- Description: Track all emails sent
-- ============================================================================
CREATE TABLE email_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    email_to VARCHAR(255) NOT NULL,
    email_subject VARCHAR(500) NOT NULL,
    email_body TEXT,
    email_type VARCHAR(100) NOT NULL,
    status email_status NOT NULL DEFAULT 'sent',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    error_message TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_email_logs_user ON email_logs(user_id);
CREATE INDEX idx_email_logs_email ON email_logs(email_to);
CREATE INDEX idx_email_logs_sent ON email_logs(sent_at);

COMMENT ON TABLE email_logs IS 'Email sending logs';

-- ============================================================================
-- TABLE: sms_logs
-- Description: Track all SMS sent
-- ============================================================================
CREATE TABLE sms_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    phone_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    sms_type VARCHAR(100) NOT NULL,
    status sms_status NOT NULL DEFAULT 'sent',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    gateway_response JSONB,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_sms_logs_user ON sms_logs(user_id);
CREATE INDEX idx_sms_logs_phone ON sms_logs(phone_number);
CREATE INDEX idx_sms_logs_sent ON sms_logs(sent_at);

COMMENT ON TABLE sms_logs IS 'SMS sending logs';

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_prices_updated_at BEFORE UPDATE ON product_prices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rentals_updated_at BEFORE UPDATE ON rentals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rental_returns_updated_at BEFORE UPDATE ON rental_returns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Available products with current prices
CREATE OR REPLACE VIEW vw_available_products AS
SELECT 
    p.id,
    p.name,
    p.slug,
    p.sku,
    p.category_id,
    c.name AS category_name,
    p.description,
    p.brand,
    p.is_sale,
    p.is_rental,
    p.is_featured,
    pp.mrp,
    pp.sale_price,
    pp.discount_percentage,
    pp.rental_price_per_day,
    pp.security_deposit,
    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) AS primary_image,
    (SELECT AVG(rating) FROM reviews WHERE product_id = p.id AND is_approved = TRUE) AS avg_rating,
    (SELECT COUNT(*) FROM reviews WHERE product_id = p.id AND is_approved = TRUE) AS review_count,
    p.views_count,
    p.sales_count,
    p.rental_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_prices pp ON p.id = pp.product_id AND pp.is_current = TRUE
WHERE p.is_active = TRUE AND p.is_deleted = FALSE;

COMMENT ON VIEW vw_available_products IS 'Active products with current prices and ratings';

-- View: Active rentals dashboard
CREATE OR REPLACE VIEW vw_active_rentals AS
SELECT 
    r.id AS rental_id,
    r.order_id,
    o.order_number,
    u.id AS user_id,
    u.email AS user_email,
    up.first_name,
    up.last_name,
    p.id AS product_id,
    p.name AS product_name,
    p.sku,
    r.rental_start_date,
    r.rental_end_date,
    r.actual_return_date,
    r.rental_status,
    r.deposit_status,
    r.total_rental_amount,
    r.security_deposit,
    CASE 
        WHEN r.rental_end_date < CURRENT_DATE AND r.rental_status NOT IN ('completed', 'cancelled') 
        THEN (CURRENT_DATE - r.rental_end_date) 
        ELSE 0 
    END AS overdue_days
FROM rentals r
JOIN orders o ON r.order_id = o.id
JOIN users u ON r.user_id = u.id
LEFT JOIN user_profiles up ON u.id = up.user_id
JOIN products p ON r.product_id = p.id
WHERE r.rental_status NOT IN ('completed', 'cancelled');

COMMENT ON VIEW vw_active_rentals IS 'Currently active rental bookings';

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert default admin user (password: Admin@123 - bcrypt hashed)
INSERT INTO users (email, password_hash, role, is_verified, is_active) VALUES
('admin@shreejyotfashion.com', '$2b$10$XgIqZOHHn7VfMQ7kLVJzOOh1pXbOZKDKZQxbKXZ5FXKzQXjz8XjzO', 'admin', TRUE, TRUE);

-- Insert default settings
INSERT INTO settings (key, value, type, description, is_public) VALUES
('site_name', 'Shreejyot Fashion', 'string', 'Website name', TRUE),
('site_email', 'info@shreejyotfashion.com', 'string', 'Contact email', TRUE),
('site_phone', '+91 9876543210', 'string', 'Contact phone', TRUE),
('default_currency', 'INR', 'string', 'Default currency', TRUE),
('tax_percentage', '18', 'number', 'GST percentage', FALSE),
('free_shipping_threshold', '1000', 'number', 'Free shipping above this amount', TRUE),
('cod_enabled', 'true', 'boolean', 'Cash on Delivery enabled', FALSE),
('min_rental_days', '3', 'number', 'Minimum rental days', TRUE),
('default_late_fee', '100', 'number', 'Default late return fee per day', FALSE),
('default_security_deposit_percentage', '50', 'number', 'Security deposit percentage of product price', FALSE);

-- Insert root categories
INSERT INTO categories (name, slug, description, display_order, is_active) VALUES
('Men', 'men', 'Men''s clothing and accessories', 1, TRUE),
('Women', 'women', 'Women''s clothing and accessories', 2, TRUE),
('Kids', 'kids', 'Kids'' clothing', 3, TRUE);

-- ============================================================================
-- DATABASE SETUP COMPLETE
-- ============================================================================

-- Grant permissions (adjust as needed for your environment)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Verify table creation
SELECT 
    tablename, 
    schemaname 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- End of schema
