// ========================================
// Product Types
// ========================================

export interface Product {
  id: number | string;
  name: string;
  slug: string;
  sku?: string;
  description: string;
  shortDescription?: string;
  categoryId?: number;
  category?: string | Category;
  subcategory?: string;
  brandId?: number;
  brand?: Brand;
  
  // Pricing
  price: number;
  compareAtPrice?: number;
  salePrice?: number;
  discount?: number;
  
  // Sizes and Colors (simplified)
  sizes?: string[];
  colors?: string[];
  
  // Rental (Unique Feature)
  isRentalAvailable: boolean;
  rentalPricePerDay?: number;
  rentalPrice3Days?: number;
  rentalPrice7Days?: number;
  securityDeposit?: number;
  lateFeePerDay?: number;
  
  // Inventory
  stock: number;
  availableForRent?: number;
  lowStockThreshold?: number;
  
  // Images & Media
  images: string[];
  thumbnail?: string;
  
  // Attributes
  variants?: ProductVariant[];
  tags?: string[];
  
  // Reviews
  rating?: number;
  reviewCount?: number;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Status
  isActive?: boolean;
  isFeatured?: boolean;
  
  // Dates
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  sizeId: number;
  size?: Size;
  colorId: number;
  color?: Color;
  stock: number;
  additionalPrice?: number;
  images?: string[];
  isActive: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  image?: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  isActive: boolean;
}

export interface Size {
  id: number;
  name: string;
  code: string;
  categoryId?: number;
  displayOrder: number;
}

export interface Color {
  id: number;
  name: string;
  hexCode: string;
  isActive: boolean;
}

// ========================================
// Cart Types
// ========================================

export interface CartItem {
  id: string;
  productId: number;
  product: Product;
  variantId?: number;
  variant?: ProductVariant;
  quantity: number;
  type: 'sale' | 'rental';
  
  // Rental specific
  rentalStartDate?: string;
  rentalEndDate?: string;
  rentalDays?: number;
  
  // Pricing
  price: number;
  total: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

// ========================================
// User Types
// ========================================

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'super_admin';
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ========================================
// Order Types
// ========================================

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  user?: User;
  
  items: OrderItem[];
  
  // Pricing
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  totalAmount: number;
  
  // Address
  shippingAddressId: number;
  shippingAddress?: Address;
  billingAddressId?: number;
  billingAddress?: Address;
  
  // Status
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  
  // Tracking
  trackingNumber?: string;
  courierName?: string;
  
  // Dates
  orderDate: string;
  shippedDate?: string;
  deliveredDate?: string;
  cancelledDate?: string;
  
  // Notes
  customerNotes?: string;
  adminNotes?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product?: Product;
  variantId?: number;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total: number;
}

// ========================================
// Rental Types (Unique Feature)
// ========================================

export interface Rental {
  id: number;
  rentalNumber: string;
  userId: number;
  user?: User;
  
  productId: number;
  product?: Product;
  variantId?: number;
  variant?: ProductVariant;
  
  // Dates
  startDate: string;
  endDate: string;
  durationDays: number;
  
  // Pricing
  rentalAmount: number;
  securityDeposit: number;
  totalAmount: number;
  
  // Return
  actualReturnDate?: string;
  lateDays?: number;
  lateFee?: number;
  damageCharges?: number;
  cleaningFee?: number;
  refundAmount?: number;
  
  // Status
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'overdue';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'partial_refund';
  
  // Address
  shippingAddressId: number;
  shippingAddress?: Address;
  
  // Inspection
  condition?: 'excellent' | 'good' | 'fair' | 'damaged';
  inspectionNotes?: string;
  inspectionImages?: string[];
  
  // Tracking
  trackingNumberOutbound?: string;
  trackingNumberReturn?: string;
  
  // Notes
  customerNotes?: string;
  adminNotes?: string;
  
  createdAt: string;
  updatedAt: string;
}

// ========================================
// Address Types
// ========================================

export interface Address {
  id: number;
  userId: number;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  
  fullName: string;
  phone: string;
  email?: string;
  
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  landmark?: string;
  
  createdAt: string;
  updatedAt: string;
}

// ========================================
// Review Types
// ========================================

export interface Review {
  id: number;
  productId: number;
  product?: Product;
  userId: number;
  user?: User;
  
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  
  helpfulCount: number;
  
  createdAt: string;
  updatedAt: string;
}

// ========================================
// Wishlist Types
// ========================================

export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  product: Product;
  createdAt: string;
}

// ========================================
// Coupon Types
// ========================================

export interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

// ========================================
// API Response Types
// ========================================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FilterOptions {
  category?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  type?: 'sale' | 'rental' | 'both';
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
  search?: string;
}
