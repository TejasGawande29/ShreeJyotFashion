import Rental, { RentalStatus, DepositStatus, DeliveryType } from '../models/Rental';
import Product from '../models/Product';
import ProductVariant from '../models/ProductVariant';
import ProductPrice from '../models/ProductPrice';
import Order from '../models/Order';
import sequelize from '../config/database';
import { Op } from 'sequelize';
import * as emailService from './emailService';
import * as smsService from './smsService';
import * as notificationService from './notificationService';
import User from '../models/User';

interface RentalBookingData {
  productId: number;
  variantId?: number;
  rentalStartDate: Date;
  rentalEndDate: Date;
  deliveryType?: 'standard' | 'express' | 'pickup';
}

/**
 * Check if a product/variant is available for rental during specified dates
 */
export const checkAvailability = async (
  productId: number,
  variantId: number | null,
  startDate: Date,
  endDate: Date,
  excludeRentalId?: number
): Promise<boolean> => {
  // Check for overlapping rentals that are active (not cancelled/completed/returned)
  const overlappingRentals = await Rental.count({
    where: {
      product_id: productId,
      ...(variantId && { variant_id: variantId }),
      ...(excludeRentalId && { id: { [Op.ne]: excludeRentalId } }), // Exclude specific rental
      rental_status: {
        [Op.notIn]: ['cancelled', 'completed', 'returned'],
      },
      [Op.or]: [
        {
          // New rental starts during existing rental
          rental_start_date: { [Op.lte]: startDate },
          rental_end_date: { [Op.gte]: startDate },
        },
        {
          // New rental ends during existing rental
          rental_start_date: { [Op.lte]: endDate },
          rental_end_date: { [Op.gte]: endDate },
        },
        {
          // New rental completely contains existing rental
          rental_start_date: { [Op.gte]: startDate },
          rental_end_date: { [Op.lte]: endDate },
        },
      ],
    },
  });

  return overlappingRentals === 0;
};

/**
 * Create a new rental booking
 */
export const createRental = async (userId: number, bookingData: RentalBookingData) => {
  const t = await sequelize.transaction();

  try {
    const { productId, variantId, rentalStartDate, rentalEndDate, deliveryType = 'standard' } = bookingData;

    // Validate product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if product is available for rental
    if (!product.is_rental) {
      throw new Error('Product is not available for rental');
    }

    // Validate variant if provided
    if (variantId) {
      const variant = await ProductVariant.findOne({
        where: { id: variantId, product_id: productId },
      });
      if (!variant) {
        throw new Error('Product variant not found');
      }
      if (variant.stock_quantity < 1) {
        throw new Error('Product variant is out of stock');
      }
    }

    // Check availability
    const isAvailable = await checkAvailability(productId, variantId || null, rentalStartDate, rentalEndDate);
    if (!isAvailable) {
      throw new Error('Product is not available for the selected dates');
    }

    // Calculate rental days
    const msPerDay = 1000 * 60 * 60 * 24;
    const rentalDays = Math.ceil((rentalEndDate.getTime() - rentalStartDate.getTime()) / msPerDay);

    if (rentalDays < 1) {
      throw new Error('Rental period must be at least 1 day');
    }

    // Get pricing
    const productPrice = await ProductPrice.findOne({
      where: { product_id: productId },
    });

    if (!productPrice) {
      throw new Error('Product pricing not found');
    }

    const dailyRate = productPrice.rental_price_per_day || 0;
    const totalRentalAmount = dailyRate * rentalDays;
    const securityDeposit = productPrice.security_deposit || 0;

    // Create order first (rental requires order_id)
    const order = await Order.create(
      {
        user_id: userId,
        status: 'pending',
        payment_status: 'pending',
        total_amount: totalRentalAmount + securityDeposit,
        subtotal: totalRentalAmount,
        tax_amount: 0,
        shipping_amount: 0,
        discount_amount: 0,
        order_number: `RNT-${Date.now()}`,
        shipping_name: 'TBD',
        shipping_email: 'TBD',
        shipping_phone: 'TBD',
        shipping_address_line1: 'TBD',
        shipping_city: 'TBD',
        shipping_state: 'TBD',
        shipping_postal_code: 'TBD',
        shipping_country: 'India',
        ordered_at: new Date(),
      },
      { transaction: t }
    );

    // Create rental
    const rental = await Rental.create(
      {
        order_id: order.id,
        user_id: userId,
        product_id: productId,
        variant_id: variantId || null,
        rental_start_date: rentalStartDate,
        rental_end_date: rentalEndDate,
        rental_days: rentalDays,
        daily_rate: dailyRate,
        total_rental_amount: totalRentalAmount,
        security_deposit: securityDeposit,
        late_fee: 0,
        damage_charges: 0,
        refund_amount: 0,
        rental_status: RentalStatus.BOOKED,
        deposit_status: DepositStatus.HELD,
        delivery_type: deliveryType as DeliveryType,
        is_extended: false,
        extension_count: 0,
      },
      { transaction: t }
    );

    await t.commit();

    // Return rental with related data
    const completeRental = await Rental.findByPk(rental.id, {
      include: [
        { model: Product, as: 'product' },
        { model: ProductVariant, as: 'variant' },
        { 
          model: Order, 
          as: 'order',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'email', 'phone'],
            },
          ],
        },
      ],
    });

    // Send rental confirmation notifications (async, don't wait)
    if (completeRental) {
      const order = (completeRental as any).order;
      const user = order?.user;
      const productData = (completeRental as any).product;

      if (user) {
        // Send rental confirmation email
        emailService.sendRentalConfirmationEmail(
          user.email,
          user.id,
          {
            rentalId: completeRental.id,
            productName: productData.name,
            startDate: completeRental.rental_start_date,
            endDate: completeRental.rental_end_date,
            rentalPrice: completeRental.total_rental_amount,
            securityDeposit: completeRental.security_deposit,
          }
        ).catch(err => console.error('Failed to send rental confirmation email:', err));

        // Send rental confirmation SMS
        if (user.phone) {
          smsService.sendRentalConfirmationSms(
            user.phone,
            user.id,
            {
              rentalId: completeRental.id,
              productName: productData.name,
              startDate: completeRental.rental_start_date,
              endDate: completeRental.rental_end_date,
            }
          ).catch(err => console.error('Failed to send rental confirmation SMS:', err));
        }

        // Create in-app notification
        notificationService.createRentalNotification(
          user.id,
          completeRental.id,
          'confirmed'
        ).catch(err => console.error('Failed to create rental notification:', err));
      }
    }

    return completeRental;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * Get user's rentals
 */
export const getUserRentals = async (userId: number) => {
  return await Rental.findAll({
    where: { user_id: userId },
    include: [
      { model: Product, as: 'product' },
      { model: ProductVariant, as: 'variant' },
    ],
    order: [['created_at', 'DESC']],
  });
};

/**
 * Get rental by ID
 */
export const getRentalById = async (rentalId: number) => {
  return await Rental.findByPk(rentalId, {
    include: [
      { model: Product, as: 'product' },
      { model: ProductVariant, as: 'variant' },
    ],
  });
};

/**
 * Update rental status
 */
export const updateRentalStatus = async (rentalId: number, status: RentalStatus) => {
  const rental = await Rental.findByPk(rentalId);
  if (!rental) {
    throw new Error('Rental not found');
  }

  rental.rental_status = status;
  await rental.save();

  return rental;
};

/**
 * Process rental return
 * Calculates late fees if returned after end date
 */
export const returnRental = async (rentalId: number, userId: number) => {
  const rental = await Rental.findByPk(rentalId, {
    include: [
      { model: Product, as: 'product' },
      { model: ProductVariant, as: 'variant' },
    ],
  });

  if (!rental) {
    throw new Error('Rental not found');
  }

  // Verify ownership
  if (rental.user_id !== userId) {
    throw new Error('Access denied');
  }

  // Check if already returned
  if (rental.rental_status === RentalStatus.COMPLETED || rental.rental_status === RentalStatus.RETURNED) {
    throw new Error('Rental already returned');
  }

  // Set actual return date
  const returnDate = new Date();
  rental.actual_return_date = returnDate;

  // Calculate late fees
  const endDate = new Date(rental.rental_end_date);
  let lateFee = 0;

  if (returnDate > endDate) {
    // Calculate days late
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysLate = Math.ceil((returnDate.getTime() - endDate.getTime()) / msPerDay);

    // Late fee: 50% of daily rate per day late
    const lateFeeRate = rental.daily_rate * 0.5;
    lateFee = lateFeeRate * daysLate;

    rental.late_fee = lateFee;
  }

  // Update status
  rental.rental_status = RentalStatus.RETURNED;

  // Calculate refund amount (deposit - late fees - damage charges)
  const refundAmount = rental.security_deposit - rental.late_fee - rental.damage_charges;
  rental.refund_amount = refundAmount > 0 ? refundAmount : 0;

  // Update deposit status
  if (rental.late_fee > 0 || rental.damage_charges > 0) {
    rental.deposit_status = DepositStatus.PARTIALLY_REFUNDED;
  } else {
    rental.deposit_status = DepositStatus.REFUNDED;
  }

  await rental.save();

  return rental;
};

/**
 * Extend rental period
 * Recalculates pricing for the extended period
 */
export const extendRental = async (rentalId: number, userId: number, newEndDate: Date) => {
  const rental = await Rental.findByPk(rentalId, {
    include: [
      { model: Product, as: 'product' },
      { model: ProductVariant, as: 'variant' },
    ],
  });

  if (!rental) {
    throw new Error('Rental not found');
  }

  // Verify ownership
  if (rental.user_id !== userId) {
    throw new Error('Access denied');
  }

  // Check if rental can be extended
  if (rental.rental_status === RentalStatus.COMPLETED || rental.rental_status === RentalStatus.RETURNED) {
    throw new Error('Cannot extend completed or returned rental');
  }

  if (rental.rental_status === RentalStatus.CANCELLED) {
    throw new Error('Cannot extend cancelled rental');
  }

  // Validate new end date is after current end date
  const currentEndDate = new Date(rental.rental_end_date);
  if (newEndDate <= currentEndDate) {
    throw new Error('New end date must be after current end date');
  }

  // Check availability for the extension period (exclude current rental)
  const isAvailable = await checkAvailability(
    rental.product_id,
    rental.variant_id,
    currentEndDate,
    newEndDate,
    rentalId // Exclude the current rental from availability check
  );

  if (!isAvailable) {
    throw new Error('Product is not available for the requested extension period');
  }

  // Calculate additional days
  const msPerDay = 1000 * 60 * 60 * 24;
  const additionalDays = Math.ceil((newEndDate.getTime() - currentEndDate.getTime()) / msPerDay);

  // Calculate additional cost
  const additionalCost = rental.daily_rate * additionalDays;

  // Update rental
  rental.rental_end_date = newEndDate;
  rental.rental_days = rental.rental_days + additionalDays;
  rental.total_rental_amount = rental.total_rental_amount + additionalCost;
  rental.is_extended = true;
  rental.extension_count = rental.extension_count + 1;

  await rental.save();

  return rental;
};

/**
 * Admin: Get all rentals with filters and pagination
 */
export const getAllRentals = async (filters: {
  status?: string;
  userId?: number;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}) => {
  const { status, userId, startDate, endDate, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  const whereClause: any = {};

  if (status) {
    whereClause.rental_status = status;
  }

  if (userId) {
    whereClause.user_id = userId;
  }

  if (startDate || endDate) {
    whereClause.rental_start_date = {};
    if (startDate) {
      whereClause.rental_start_date[Op.gte] = startDate;
    }
    if (endDate) {
      whereClause.rental_start_date[Op.lte] = endDate;
    }
  }

  const { count, rows } = await Rental.findAndCountAll({
    where: whereClause,
    include: [
      { model: Product, as: 'product' },
      { model: ProductVariant, as: 'variant' },
    ],
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });

  return {
    rentals: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

/**
 * Admin: Update rental status
 */
export const updateRentalStatusAdmin = async (rentalId: number, newStatus: RentalStatus) => {
  const rental = await Rental.findByPk(rentalId, {
    include: [
      { model: Product, as: 'product' },
      { model: ProductVariant, as: 'variant' },
    ],
  });

  if (!rental) {
    throw new Error('Rental not found');
  }

  rental.rental_status = newStatus;
  await rental.save();

  return rental;
};

/**
 * Admin: Get rental statistics
 */
export const getRentalStats = async () => {
  // Total rentals
  const totalRentals = await Rental.count();

  // Active rentals
  const activeRentals = await Rental.count({
    where: {
      rental_status: {
        [Op.in]: ['booked', 'confirmed', 'out_for_delivery', 'active'],
      },
    },
  });

  // Overdue rentals (active but past end date)
  const overdueRentals = await Rental.count({
    where: {
      rental_status: {
        [Op.in]: ['active', 'overdue'],
      },
      rental_end_date: {
        [Op.lt]: new Date(),
      },
    },
  });

  // Completed rentals
  const completedRentals = await Rental.count({
    where: {
      rental_status: {
        [Op.in]: ['completed', 'returned'],
      },
    },
  });

  // Total revenue (sum of total_rental_amount for completed rentals)
  const revenueResult = await Rental.findAll({
    where: {
      rental_status: {
        [Op.in]: ['completed', 'returned'],
      },
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('total_rental_amount')), 'totalRevenue'],
      [sequelize.fn('SUM', sequelize.col('late_fee')), 'totalLateFees'],
      [sequelize.fn('SUM', sequelize.col('damage_charges')), 'totalDamageCharges'],
    ],
    raw: true,
  });

  const revenue = revenueResult[0] as any;

  // Pending revenue (active rentals)
  const pendingRevenueResult = await Rental.findAll({
    where: {
      rental_status: {
        [Op.in]: ['booked', 'confirmed', 'out_for_delivery', 'active'],
      },
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('total_rental_amount')), 'pendingRevenue'],
    ],
    raw: true,
  });

  const pendingRevenue = pendingRevenueResult[0] as any;

  return {
    totalRentals,
    activeRentals,
    overdueRentals,
    completedRentals,
    totalRevenue: parseFloat(revenue.totalRevenue || 0),
    totalLateFees: parseFloat(revenue.totalLateFees || 0),
    totalDamageCharges: parseFloat(revenue.totalDamageCharges || 0),
    pendingRevenue: parseFloat(pendingRevenue.pendingRevenue || 0),
  };
};
