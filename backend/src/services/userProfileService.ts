/**
 * User Profile Service
 * Business logic for user profile and address management
 */

import UserProfile from '../models/UserProfile';
import Address from '../models/Address';
import User from '../models/User';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

/**
 * Get or create user profile
 */
export const getOrCreateProfile = async (userId: number) => {
  let profile = await UserProfile.findOne({
    where: { user_id: userId },
  });

  // If profile doesn't exist, create one
  if (!profile) {
    profile = await UserProfile.create({
      user_id: userId,
    });
  }

  return profile;
};

/**
 * Get complete user profile with user info
 */
export const getCompleteProfile = async (userId: number) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'email', 'phone', 'role', 'is_verified', 'created_at'],
    include: [
      {
        model: UserProfile,
        as: 'profile',
      },
    ],
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Ensure profile exists
  const userJson = user.toJSON() as any;
  if (!userJson.profile) {
    const profile = await getOrCreateProfile(userId);
    return {
      ...userJson,
      profile,
    };
  }

  return userJson;
};

/**
 * Update user profile
 */
export const updateProfile = async (userId: number, profileData: Partial<UserProfile>) => {
  const profile = await getOrCreateProfile(userId);

  // Update only allowed fields
  const allowedFields = [
    'first_name',
    'last_name',
    'date_of_birth',
    'gender',
    'avatar_url',
    'preferred_language',
    'preferred_currency',
    'newsletter_subscribed',
    'sms_notifications',
    'email_notifications',
    'bio',
    'alternate_phone',
  ];

  const updates: any = {};
  allowedFields.forEach((field) => {
    if (field in profileData) {
      updates[field] = (profileData as any)[field];
    }
  });

  await profile.update(updates);

  return profile;
};

/**
 * Update account settings (email, phone, password)
 */
export const updateAccountSettings = async (
  userId: number,
  settings: {
    email?: string;
    phone?: string;
    current_password?: string;
    new_password?: string;
  }
) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // If changing password, verify current password
  if (settings.new_password) {
    if (!settings.current_password) {
      throw new Error('Current password is required to set new password');
    }

    const isPasswordValid = await user.comparePassword(settings.current_password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(settings.new_password, salt);
  }

  // Update email if provided
  if (settings.email && settings.email !== user.email) {
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email: settings.email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }
    user.email = settings.email;
    user.is_verified = false; // Reset verification status
  }

  // Update phone if provided
  if (settings.phone) {
    user.phone = settings.phone;
  }

  await user.save();

  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    is_verified: user.is_verified,
  };
};

/**
 * Get user addresses
 */
export const getUserAddresses = async (userId: number, addressType?: string) => {
  const where: any = {
    user_id: userId,
    is_deleted: false,
  };

  if (addressType) {
    where[Op.or] = [{ address_type: addressType }, { address_type: 'both' }];
  }

  const addresses = await Address.findAll({
    where,
    order: [
      ['is_default', 'DESC'],
      ['created_at', 'DESC'],
    ],
  });

  return addresses;
};

/**
 * Get single address
 */
export const getAddressById = async (userId: number, addressId: number) => {
  const address = await Address.findOne({
    where: {
      id: addressId,
      user_id: userId,
      is_deleted: false,
    },
  });

  if (!address) {
    throw new Error('Address not found');
  }

  return address;
};

/**
 * Create new address
 */
export const createAddress = async (userId: number, addressData: Partial<Address>) => {
  // If setting as default, unset other default addresses of same type
  if (addressData.is_default) {
    await Address.update(
      { is_default: false },
      {
        where: {
          user_id: userId,
          address_type: addressData.address_type || 'both',
          is_deleted: false,
        },
      }
    );
  }

  const address = await Address.create({
    ...addressData,
    user_id: userId,
  } as Address);

  return address;
};

/**
 * Update address
 */
export const updateAddress = async (userId: number, addressId: number, addressData: Partial<Address>) => {
  const address = await getAddressById(userId, addressId);

  // If setting as default, unset other default addresses of same type
  if (addressData.is_default) {
    await Address.update(
      { is_default: false },
      {
        where: {
          user_id: userId,
          address_type: address.address_type,
          is_deleted: false,
          id: { [Op.ne]: addressId },
        },
      }
    );
  }

  await address.update(addressData);

  return address;
};

/**
 * Delete address (soft delete)
 */
export const deleteAddress = async (userId: number, addressId: number) => {
  const address = await getAddressById(userId, addressId);

  await address.update({ is_deleted: true, is_default: false });

  return { message: 'Address deleted successfully' };
};

/**
 * Set address as default
 */
export const setDefaultAddress = async (userId: number, addressId: number) => {
  const address = await getAddressById(userId, addressId);

  // Unset other default addresses of same type
  await Address.update(
    { is_default: false },
    {
      where: {
        user_id: userId,
        address_type: address.address_type,
        is_deleted: false,
        id: { [Op.ne]: addressId },
      },
    }
  );

  await address.update({ is_default: true });

  return address;
};

/**
 * Get user order history
 */
export const getOrderHistory = async (
  userId: number,
  filters: {
    status?: string;
    from_date?: string;
    to_date?: string;
  } = {},
  page: number = 1,
  limit: number = 20
) => {
  const where: any = {
    user_id: userId,
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.from_date || filters.to_date) {
    where.ordered_at = {};
    if (filters.from_date) {
      where.ordered_at[Op.gte] = new Date(filters.from_date);
    }
    if (filters.to_date) {
      where.ordered_at[Op.lte] = new Date(filters.to_date);
    }
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [
      {
        model: OrderItem,
        as: 'items',
        attributes: ['id', 'product_name', 'quantity', 'unit_price', 'subtotal'],
      },
    ],
    limit,
    offset,
    order: [['ordered_at', 'DESC']],
  });

  return {
    orders: rows,
    pagination: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    },
  };
};

/**
 * Get user dashboard statistics
 */
export const getUserDashboard = async (userId: number) => {
  const [profile, addresses, orderStats] = await Promise.all([
    getCompleteProfile(userId),
    getUserAddresses(userId),
    Order.findAll({
      where: { user_id: userId },
      attributes: [
        [Order.sequelize!.fn('COUNT', Order.sequelize!.col('id')), 'total_orders'],
        [Order.sequelize!.fn('SUM', Order.sequelize!.col('total_amount')), 'total_spent'],
      ],
      raw: true,
    }),
  ]);

  const recentOrders = await Order.findAll({
    where: { user_id: userId },
    include: [
      {
        model: OrderItem,
        as: 'items',
        attributes: ['id', 'product_name', 'quantity', 'unit_price'],
      },
    ],
    limit: 5,
    order: [['ordered_at', 'DESC']],
  });

  const stats: any = orderStats[0] || {};

  return {
    profile,
    addresses: {
      total: addresses.length,
      default_shipping: addresses.find((a) => a.is_default && a.address_type !== 'billing'),
      default_billing: addresses.find((a) => a.is_default && a.address_type !== 'shipping'),
    },
    orders: {
      total: stats.total_orders || 0,
      total_spent: stats.total_spent || 0,
      recent: recentOrders,
    },
  };
};
