/**
 * Model associations setup
 * Import all models and define their relationships
 */

import Category, { setupCategoryAssociations } from './Category';
import Product from './Product';
import ProductVariant from './ProductVariant';
import ProductImage from './ProductImage';
import ProductPrice from './ProductPrice';
import User from './User';
import UserProfile from './UserProfile';
import Address from './Address';
import CartItem from './CartItem';
import WishlistItem from './WishlistItem';
import Order from './Order';
import OrderItem from './OrderItem';
import Rental from './Rental';
import Payment from './Payment';
import Review from './Review';
import ReviewHelpful from './ReviewHelpful';
import Coupon from './Coupon';
import CouponUsage from './CouponUsage';
import EmailLog from './EmailLog';
import SmsLog from './SmsLog';
import Notification from './Notification';

// Setup Category self-referential associations
setupCategoryAssociations();

// Category <-> Product
Category.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'products',
});

Product.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category',
});

// Product <-> ProductVariant
Product.hasMany(ProductVariant, {
  foreignKey: 'product_id',
  as: 'variants',
  onDelete: 'CASCADE',
});

ProductVariant.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// Product <-> ProductImage
Product.hasMany(ProductImage, {
  foreignKey: 'product_id',
  as: 'images',
  onDelete: 'CASCADE',
});

ProductImage.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// Product <-> ProductPrice
Product.hasMany(ProductPrice, {
  foreignKey: 'product_id',
  as: 'prices',
  onDelete: 'CASCADE',
});

Product.hasOne(ProductPrice, {
  foreignKey: 'product_id',
  as: 'currentPrice',
  scope: {
    is_current: true,
  },
});

ProductPrice.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// User <-> CartItem
User.hasMany(CartItem, {
  foreignKey: 'user_id',
  as: 'cartItems',
  onDelete: 'CASCADE',
});

CartItem.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// User <-> UserProfile (One-to-One)
User.hasOne(UserProfile, {
  foreignKey: 'user_id',
  as: 'profile',
  onDelete: 'CASCADE',
});

UserProfile.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// User <-> Address (One-to-Many)
User.hasMany(Address, {
  foreignKey: 'user_id',
  as: 'addresses',
  onDelete: 'CASCADE',
});

Address.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Product <-> CartItem
Product.hasMany(CartItem, {
  foreignKey: 'product_id',
  as: 'cartItems',
  onDelete: 'CASCADE',
});

CartItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// ProductVariant <-> CartItem
ProductVariant.hasMany(CartItem, {
  foreignKey: 'variant_id',
  as: 'cartItems',
  onDelete: 'SET NULL',
});

CartItem.belongsTo(ProductVariant, {
  foreignKey: 'variant_id',
  as: 'variant',
});

// User <-> WishlistItem
User.hasMany(WishlistItem, {
  foreignKey: 'user_id',
  as: 'wishlistItems',
  onDelete: 'CASCADE',
});

WishlistItem.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Product <-> WishlistItem
Product.hasMany(WishlistItem, {
  foreignKey: 'product_id',
  as: 'wishlistItems',
  onDelete: 'CASCADE',
});

WishlistItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// User <-> Order
User.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'orders',
  onDelete: 'CASCADE',
});

Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Order <-> OrderItem
Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  as: 'items',
  onDelete: 'CASCADE',
});

OrderItem.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
});

// Product <-> OrderItem
Product.hasMany(OrderItem, {
  foreignKey: 'product_id',
  as: 'orderItems',
});

OrderItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// ProductVariant <-> OrderItem
ProductVariant.hasMany(OrderItem, {
  foreignKey: 'variant_id',
  as: 'orderItems',
});

OrderItem.belongsTo(ProductVariant, {
  foreignKey: 'variant_id',
  as: 'variant',
});

// User <-> Rental
User.hasMany(Rental, {
  foreignKey: 'user_id',
  as: 'rentals',
  onDelete: 'CASCADE',
});

Rental.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Rental <-> Product (direct relationship - single product per rental)
Rental.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

Product.hasMany(Rental, {
  foreignKey: 'product_id',
  as: 'rentals',
});

// Rental <-> ProductVariant (optional - for specific size/color)
Rental.belongsTo(ProductVariant, {
  foreignKey: 'variant_id',
  as: 'variant',
});

ProductVariant.hasMany(Rental, {
  foreignKey: 'variant_id',
  as: 'rentals',
});

// Payment <-> Order
Payment.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
});

Order.hasMany(Payment, {
  foreignKey: 'order_id',
  as: 'payments',
});

// Payment <-> User
Payment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

User.hasMany(Payment, {
  foreignKey: 'user_id',
  as: 'payments',
});

// Review <-> Product
Review.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

Product.hasMany(Review, {
  foreignKey: 'product_id',
  as: 'reviews',
});

// Review <-> User
Review.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

User.hasMany(Review, {
  foreignKey: 'user_id',
  as: 'reviews',
});

// Review <-> Order (for verified purchase)
Review.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
});

Order.hasMany(Review, {
  foreignKey: 'order_id',
  as: 'reviews',
});

// ReviewHelpful <-> Review
ReviewHelpful.belongsTo(Review, {
  foreignKey: 'review_id',
  as: 'review',
});

Review.hasMany(ReviewHelpful, {
  foreignKey: 'review_id',
  as: 'helpful_votes',
});

// ReviewHelpful <-> User
ReviewHelpful.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

User.hasMany(ReviewHelpful, {
  foreignKey: 'user_id',
  as: 'review_votes',
});

// CouponUsage <-> Coupon
CouponUsage.belongsTo(Coupon, {
  foreignKey: 'coupon_id',
  as: 'coupon',
});

Coupon.hasMany(CouponUsage, {
  foreignKey: 'coupon_id',
  as: 'usages',
});

// CouponUsage <-> User
CouponUsage.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

User.hasMany(CouponUsage, {
  foreignKey: 'user_id',
  as: 'coupon_usages',
});

// CouponUsage <-> Order
CouponUsage.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
});

Order.hasMany(CouponUsage, {
  foreignKey: 'order_id',
  as: 'coupon_usages',
});

// User <-> EmailLog
User.hasMany(EmailLog, {
  foreignKey: 'user_id',
  as: 'email_logs',
});

EmailLog.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// User <-> SmsLog
User.hasMany(SmsLog, {
  foreignKey: 'user_id',
  as: 'sms_logs',
});

SmsLog.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// User <-> Notification
User.hasMany(Notification, {
  foreignKey: 'user_id',
  as: 'notifications',
});

Notification.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Export all models
export {
  User,
  UserProfile,
  Address,
  Category,
  Product,
  ProductVariant,
  ProductImage,
  ProductPrice,
  CartItem,
  WishlistItem,
  Order,
  OrderItem,
  Rental,
  Payment,
  Review,
  ReviewHelpful,
  Coupon,
  CouponUsage,
  EmailLog,
  SmsLog,
  Notification,
};

// Export default object with all models
export default {
  User,
  UserProfile,
  Address,
  Category,
  Product,
  ProductVariant,
  ProductImage,
  ProductPrice,
  CartItem,
  WishlistItem,
  Order,
  OrderItem,
  Rental,
  Payment,
  Review,
  ReviewHelpful,
  Coupon,
  CouponUsage,
  EmailLog,
  SmsLog,
  Notification,
};
