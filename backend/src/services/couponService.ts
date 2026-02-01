import Coupon, { DiscountType, ApplicableTo } from '../models/Coupon';
import CouponUsage from '../models/CouponUsage';
import CartItem from '../models/CartItem';
import Product from '../models/Product';
import { Op } from 'sequelize';
import logger from '../utils/logger';

/**
 * Generate random coupon code
 */
export const generateCouponCode = (prefix: string = 'COUPON', length: number = 8): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = prefix;
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

/**
 * Create a new coupon
 */
export const createCoupon = async (couponData: {
  code?: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_value?: number;
  max_discount?: number;
  usage_limit?: number;
  usage_per_user?: number;
  applicable_to?: ApplicableTo;
  category_ids?: number[];
  product_ids?: number[];
  valid_from: Date;
  valid_to: Date;
  is_active?: boolean;
}): Promise<Coupon> => {
  try {
    // Generate code if not provided
    const code = couponData.code || generateCouponCode();

    // Check if code already exists
    const existing = await Coupon.findOne({ where: { code } });
    if (existing) {
      throw new Error('Coupon code already exists');
    }

    // Validate dates
    if (new Date(couponData.valid_from) >= new Date(couponData.valid_to)) {
      throw new Error('valid_from must be before valid_to');
    }

    // Validate discount value
    if (couponData.discount_type === DiscountType.PERCENTAGE) {
      if (couponData.discount_value <= 0 || couponData.discount_value > 100) {
        throw new Error('Percentage discount must be between 0 and 100');
      }
    } else {
      if (couponData.discount_value <= 0) {
        throw new Error('Discount value must be greater than 0');
      }
    }

    const coupon = await Coupon.create({
      code,
      ...couponData,
      used_count: 0,
    });

    logger.info('Coupon created:', { couponId: coupon.id, code: coupon.code });
    
    return coupon;
  } catch (error: any) {
    logger.error('Error creating coupon:', error);
    throw new Error(`Failed to create coupon: ${error.message}`);
  }
};

/**
 * Get all coupons (Admin)
 */
export const getAllCoupons = async (options: {
  status?: 'all' | 'active' | 'expired' | 'inactive';
  limit?: number;
  offset?: number;
} = {}): Promise<{ coupons: Coupon[]; total: number }> => {
  try {
    const { status = 'all', limit = 20, offset = 0 } = options;

    const whereClause: any = {};
    const now = new Date();

    switch (status) {
      case 'active':
        whereClause.is_active = true;
        whereClause.valid_from = { [Op.lte]: now };
        whereClause.valid_to = { [Op.gte]: now };
        break;
      case 'expired':
        whereClause.valid_to = { [Op.lt]: now };
        break;
      case 'inactive':
        whereClause.is_active = false;
        break;
    }

    const { rows: coupons, count: total } = await Coupon.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return { coupons, total };
  } catch (error: any) {
    logger.error('Error getting coupons:', error);
    throw new Error(`Failed to get coupons: ${error.message}`);
  }
};

/**
 * Get coupon by ID
 */
export const getCouponById = async (couponId: number): Promise<Coupon | null> => {
  try {
    return await Coupon.findByPk(couponId);
  } catch (error: any) {
    logger.error('Error getting coupon:', error);
    throw new Error(`Failed to get coupon: ${error.message}`);
  }
};

/**
 * Get coupon by code
 */
export const getCouponByCode = async (code: string): Promise<Coupon | null> => {
  try {
    return await Coupon.findOne({ where: { code: code.toUpperCase() } });
  } catch (error: any) {
    logger.error('Error getting coupon by code:', error);
    throw new Error(`Failed to get coupon: ${error.message}`);
  }
};

/**
 * Update coupon
 */
export const updateCoupon = async (
  couponId: number,
  updates: Partial<{
    description: string;
    discount_value: number;
    min_order_value: number;
    max_discount: number;
    usage_limit: number;
    usage_per_user: number;
    valid_from: Date;
    valid_to: Date;
    is_active: boolean;
  }>
): Promise<Coupon> => {
  try {
    const coupon = await Coupon.findByPk(couponId);
    if (!coupon) {
      throw new Error('Coupon not found');
    }

    // Validate dates if provided
    const validFrom = updates.valid_from || coupon.valid_from;
    const validTo = updates.valid_to || coupon.valid_to;
    if (new Date(validFrom) >= new Date(validTo)) {
      throw new Error('valid_from must be before valid_to');
    }

    // Update fields
    Object.assign(coupon, updates);
    await coupon.save();

    logger.info('Coupon updated:', { couponId });
    
    return coupon;
  } catch (error: any) {
    logger.error('Error updating coupon:', error);
    throw new Error(`Failed to update coupon: ${error.message}`);
  }
};

/**
 * Delete coupon (deactivate)
 */
export const deleteCoupon = async (couponId: number): Promise<void> => {
  try {
    const coupon = await Coupon.findByPk(couponId);
    if (!coupon) {
      throw new Error('Coupon not found');
    }

    coupon.is_active = false;
    await coupon.save();

    logger.info('Coupon deactivated:', { couponId });
  } catch (error: any) {
    logger.error('Error deleting coupon:', error);
    throw new Error(`Failed to delete coupon: ${error.message}`);
  }
};

/**
 * Validate coupon for user and cart
 */
export const validateCoupon = async (
  code: string,
  userId: number,
  cartItems: Array<{ product_id: number; price: number; quantity: number }>
): Promise<{
  valid: boolean;
  message?: string;
  coupon?: Coupon;
  discountAmount?: number;
}> => {
  try {
    const coupon = await getCouponByCode(code);

    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code' };
    }

    // Check if active
    if (!coupon.is_active) {
      return { valid: false, message: 'Coupon is not active' };
    }

    // Check dates
    const now = new Date();
    if (now < coupon.valid_from) {
      return { valid: false, message: 'Coupon is not yet valid' };
    }
    if (now > coupon.valid_to) {
      return { valid: false, message: 'Coupon has expired' };
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count! >= coupon.usage_limit) {
      return { valid: false, message: 'Coupon usage limit reached' };
    }

    // Check usage per user
    if (coupon.usage_per_user) {
      const userUsageCount = await CouponUsage.count({
        where: {
          coupon_id: coupon.id,
          user_id: userId,
        },
      });

      if (userUsageCount >= coupon.usage_per_user) {
        return { valid: false, message: 'You have already used this coupon maximum times' };
      }
    }

    // Calculate cart total
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Check minimum order value
    if (coupon.min_order_value && cartTotal < coupon.min_order_value) {
      return {
        valid: false,
        message: `Minimum order value of ₹${coupon.min_order_value} required`,
      };
    }

    // Check applicability
    if (coupon.applicable_to === ApplicableTo.CATEGORY && coupon.category_ids && coupon.category_ids.length > 0) {
      // Check if any cart item is in applicable categories
      const productIds = cartItems.map(item => item.product_id);
      const products = await Product.findAll({
        where: { id: { [Op.in]: productIds } },
        attributes: ['id', 'category_id'],
      });

      const hasApplicableProduct = products.some(p => 
        coupon.category_ids!.includes(p.category_id)
      );

      if (!hasApplicableProduct) {
        return { valid: false, message: 'Coupon not applicable to items in cart' };
      }
    }

    if (coupon.applicable_to === ApplicableTo.PRODUCT && coupon.product_ids && coupon.product_ids.length > 0) {
      // Check if any cart item is in applicable products
      const hasApplicableProduct = cartItems.some(item =>
        coupon.product_ids!.includes(item.product_id)
      );

      if (!hasApplicableProduct) {
        return { valid: false, message: 'Coupon not applicable to items in cart' };
      }
    }

    // Calculate discount
    const discountAmount = coupon.calculateDiscount(cartTotal);

    return {
      valid: true,
      message: 'Coupon is valid',
      coupon,
      discountAmount,
    };
  } catch (error: any) {
    logger.error('Error validating coupon:', error);
    throw new Error(`Failed to validate coupon: ${error.message}`);
  }
};

/**
 * Apply coupon to order and record usage
 */
export const applyCoupon = async (
  couponId: number,
  userId: number,
  orderId: number,
  discountAmount: number
): Promise<CouponUsage> => {
  try {
    // Create usage record
    const usage = await CouponUsage.create({
      coupon_id: couponId,
      user_id: userId,
      order_id: orderId,
      discount_amount: discountAmount,
    });

    // Increment coupon used_count
    await Coupon.increment('used_count', {
      where: { id: couponId },
    });

    logger.info('Coupon applied:', { couponId, orderId, discountAmount });
    
    return usage;
  } catch (error: any) {
    logger.error('Error applying coupon:', error);
    throw new Error(`Failed to apply coupon: ${error.message}`);
  }
};

/**
 * Get coupon usage statistics
 */
export const getCouponUsageStats = async (couponId: number): Promise<{
  totalUsage: number;
  totalDiscount: number;
  uniqueUsers: number;
  recentUsages: CouponUsage[];
}> => {
  try {
    const usages = await CouponUsage.findAll({
      where: { coupon_id: couponId },
      include: [
        {
          model: require('./User').default,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
      order: [['used_at', 'DESC']],
      limit: 10,
    });

    const totalUsage = usages.length;
    const totalDiscount = usages.reduce((sum, u) => sum + parseFloat(u.discount_amount.toString()), 0);
    const uniqueUsers = new Set(usages.map(u => u.user_id)).size;

    return {
      totalUsage,
      totalDiscount,
      uniqueUsers,
      recentUsages: usages,
    };
  } catch (error: any) {
    logger.error('Error getting coupon stats:', error);
    throw new Error(`Failed to get coupon stats: ${error.message}`);
  }
};

/**
 * Get user's coupon usage history
 */
export const getUserCouponUsage = async (userId: number): Promise<CouponUsage[]> => {
  try {
    return await CouponUsage.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Coupon,
          as: 'coupon',
        },
      ],
      order: [['used_at', 'DESC']],
    });
  } catch (error: any) {
    logger.error('Error getting user coupon usage:', error);
    throw new Error(`Failed to get usage history: ${error.message}`);
  }
};
