import { Op, fn, col, literal } from 'sequelize';
import sequelize from '../config/database';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import User from '../models/User';
import Product from '../models/Product';
import ProductVariant from '../models/ProductVariant';
import Rental from '../models/Rental';
import Payment from '../models/Payment';
import Category from '../models/Category';
import logger from '../utils/logger';

/**
 * Get date range filter
 */
const getDateRange = (startDate?: string, endDate?: string) => {
  const filter: any = {};
  
  if (startDate && endDate) {
    filter[Op.between] = [new Date(startDate), new Date(endDate)];
  } else if (startDate) {
    filter[Op.gte] = new Date(startDate);
  } else if (endDate) {
    filter[Op.lte] = new Date(endDate);
  }
  
  return filter;
};

/**
 * Dashboard Overview - Key metrics
 */
export const getDashboardOverview = async (startDate?: string, endDate?: string) => {
  try {
    const dateFilter = getDateRange(startDate, endDate);
    const orderDateFilter = dateFilter ? { ordered_at: dateFilter } : {};
    const userDateFilter = dateFilter ? { created_at: dateFilter } : {};

    // Run all queries in parallel
    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      activeRentals,
      pendingOrders,
      completedOrders,
      todayRevenue,
      todayOrders,
      topProducts,
    ] = await Promise.all([
      // Total Revenue
      Order.sum('total_amount', {
        where: {
          payment_status: 'paid',
          ...orderDateFilter,
        },
      }),

      // Total Orders
      Order.count({
        where: orderDateFilter,
      }),

      // Total Customers (new customers in date range)
      User.count({
        where: {
          role: 'customer',
          ...userDateFilter,
        },
      }),

      // Active Rentals
      Rental.count({
        where: {
          rental_status: { [Op.in]: ['booked', 'active', 'collected'] },
        },
      }),

      // Pending Orders
      Order.count({
        where: {
          status: 'pending',
          ...orderDateFilter,
        },
      }),

      // Completed Orders
      Order.count({
        where: {
          status: 'delivered',
          ...orderDateFilter,
        },
      }),

      // Today's Revenue
      Order.sum('total_amount', {
        where: {
          payment_status: 'paid',
          ordered_at: {
            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      // Today's Orders
      Order.count({
        where: {
          ordered_at: {
            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      // Top 5 Products by sales
      OrderItem.findAll({
        attributes: [
          'product_name',
          [fn('SUM', col('quantity')), 'total_sold'],
          [fn('SUM', col('subtotal')), 'total_revenue'],
        ],
        group: ['product_name'],
        order: [[literal('total_sold'), 'DESC']],
        limit: 5,
        raw: true,
      }),
    ]);

    return {
      overview: {
        totalRevenue: totalRevenue || 0,
        totalOrders: totalOrders || 0,
        totalCustomers: totalCustomers || 0,
        activeRentals: activeRentals || 0,
        pendingOrders: pendingOrders || 0,
        completedOrders: completedOrders || 0,
        averageOrderValue: totalOrders > 0 ? (totalRevenue || 0) / totalOrders : 0,
      },
      today: {
        revenue: todayRevenue || 0,
        orders: todayOrders || 0,
      },
      topProducts: topProducts.map((p: any) => ({
        name: p.product_name,
        soldQuantity: parseInt(p.total_sold),
        revenue: parseFloat(p.total_revenue),
      })),
    };
  } catch (error: any) {
    logger.error('Error getting dashboard overview:', error);
    throw error;
  }
};

/**
 * Revenue Trends - Daily, Weekly, Monthly
 */
export const getRevenueTrends = async (
  period: 'daily' | 'weekly' | 'monthly',
  startDate?: string,
  endDate?: string
) => {
  try {
    const dateFilter = getDateRange(startDate, endDate);
    
    let groupBy: string;
    let dateFormat: string;

    switch (period) {
      case 'daily':
        groupBy = 'DATE(ordered_at)';
        dateFormat = '%Y-%m-%d';
        break;
      case 'weekly':
        groupBy = 'YEARWEEK(ordered_at)';
        dateFormat = '%Y-W%v';
        break;
      case 'monthly':
        groupBy = 'DATE_FORMAT(ordered_at, "%Y-%m")';
        dateFormat = '%Y-%m';
        break;
      default:
        groupBy = 'DATE(ordered_at)';
        dateFormat = '%Y-%m-%d';
    }

    const trends = await Order.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('ordered_at'), dateFormat), 'period'],
        [fn('COUNT', col('id')), 'order_count'],
        [fn('SUM', col('total_amount')), 'revenue'],
        [fn('AVG', col('total_amount')), 'avg_order_value'],
      ],
      where: {
        payment_status: 'paid',
        ...(dateFilter ? { ordered_at: dateFilter } : {}),
      },
      group: [literal(groupBy) as any],
      order: [[literal('period'), 'ASC']],
      raw: true,
    });

    return trends.map((t: any) => ({
      period: t.period,
      orderCount: parseInt(t.order_count),
      revenue: parseFloat(t.revenue || 0),
      avgOrderValue: parseFloat(t.avg_order_value || 0),
    }));
  } catch (error: any) {
    logger.error('Error getting revenue trends:', error);
    throw error;
  }
};

/**
 * Order Status Breakdown
 */
export const getOrderStatusBreakdown = async (startDate?: string, endDate?: string) => {
  try {
    const dateFilter = getDateRange(startDate, endDate);

    const breakdown = await Order.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count'],
        [fn('SUM', col('total_amount')), 'total_amount'],
      ],
      where: dateFilter ? { ordered_at: dateFilter } : {},
      group: ['status'],
      raw: true,
    });

    return breakdown.map((b: any) => ({
      status: b.status,
      count: parseInt(b.count),
      totalAmount: parseFloat(b.total_amount || 0),
    }));
  } catch (error: any) {
    logger.error('Error getting order status breakdown:', error);
    throw error;
  }
};

/**
 * Payment Method Distribution
 */
export const getPaymentMethodDistribution = async (startDate?: string, endDate?: string) => {
  try {
    const dateFilter = getDateRange(startDate, endDate);

    const distribution = await Payment.findAll({
      attributes: [
        'payment_method',
        [fn('COUNT', col('id')), 'count'],
        [fn('SUM', col('amount')), 'total_amount'],
      ],
      where: {
        status: 'captured',
        ...(dateFilter ? { payment_date: dateFilter } : {}),
      },
      group: ['payment_method'],
      raw: true,
    });

    return distribution.map((d: any) => ({
      method: d.payment_method,
      count: parseInt(d.count),
      totalAmount: parseFloat(d.total_amount || 0),
    }));
  } catch (error: any) {
    logger.error('Error getting payment method distribution:', error);
    throw error;
  }
};

/**
 * Sales by Category
 */
export const getSalesByCategory = async (startDate?: string, endDate?: string) => {
  try {
    const dateFilter = getDateRange(startDate, endDate);

    const query = `
      SELECT 
        c.name as category_name,
        COUNT(DISTINCT o.id) as order_count,
        SUM(oi.quantity) as items_sold,
        SUM(oi.subtotal) as revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE o.payment_status = 'paid'
      ${startDate && endDate ? 'AND o.ordered_at BETWEEN :startDate AND :endDate' : ''}
      ${startDate && !endDate ? 'AND o.ordered_at >= :startDate' : ''}
      ${!startDate && endDate ? 'AND o.ordered_at <= :endDate' : ''}
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
    `;

    const replacements: any = {};
    if (startDate) replacements.startDate = startDate;
    if (endDate) replacements.endDate = endDate;

    const [results] = await sequelize.query(query, {
      replacements,
    });

    return (results as any[]).map((r: any) => ({
      categoryName: r.category_name,
      orderCount: parseInt(r.order_count),
      itemsSold: parseInt(r.items_sold),
      revenue: parseFloat(r.revenue),
    }));
  } catch (error: any) {
    logger.error('Error getting sales by category:', error);
    throw error;
  }
};

/**
 * Top Selling Products
 */
export const getTopSellingProducts = async (limit: number = 10, startDate?: string, endDate?: string) => {
  try {
    const dateFilter = getDateRange(startDate, endDate);

    const query = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        COUNT(DISTINCT o.id) as order_count,
        SUM(oi.quantity) as total_sold,
        SUM(oi.subtotal) as revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      WHERE o.payment_status = 'paid'
      ${startDate && endDate ? 'AND o.ordered_at BETWEEN :startDate AND :endDate' : ''}
      ${startDate && !endDate ? 'AND o.ordered_at >= :startDate' : ''}
      ${!startDate && endDate ? 'AND o.ordered_at <= :endDate' : ''}
      GROUP BY p.id, p.name, p.sku
      ORDER BY total_sold DESC
      LIMIT :limit
    `;

    const replacements: any = { limit };
    if (startDate) replacements.startDate = startDate;
    if (endDate) replacements.endDate = endDate;

    const [results] = await sequelize.query(query, {
      replacements,
    });

    return (results as any[]).map((r: any) => ({
      id: r.id,
      name: r.name,
      sku: r.sku,
      orderCount: parseInt(r.order_count),
      totalSold: parseInt(r.total_sold),
      revenue: parseFloat(r.revenue),
    }));
  } catch (error: any) {
    logger.error('Error getting top selling products:', error);
    throw error;
  }
};

/**
 * Low Stock Alert
 */
export const getLowStockProducts = async (threshold: number = 10) => {
  try {
    const products = await ProductVariant.findAll({
      attributes: [
        'id',
        'sku_variant',
        'size',
        'color',
        'stock_quantity',
        'product_id',
      ],
      where: {
        stock_quantity: {
          [Op.lte]: threshold,
          [Op.gt]: 0,
        },
        is_active: true,
      },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku'],
          where: {
            is_active: true,
            is_deleted: false,
          },
        },
      ],
      order: [['stock_quantity', 'ASC']],
    });

    return products.map((v: any) => ({
      variantId: v.id,
      productId: v.product.id,
      productName: v.product.name,
      sku: v.product.sku,
      variantSku: v.sku_variant,
      size: v.size,
      color: v.color,
      stockQuantity: v.stock_quantity,
    }));
  } catch (error: any) {
    logger.error('Error getting low stock products:', error);
    throw error;
  }
};

/**
 * Customer Analytics - New vs Returning
 */
export const getCustomerAnalytics = async (startDate?: string, endDate?: string) => {
  try {
    const dateFilter = getDateRange(startDate, endDate);

    const [newCustomers, returningCustomers, totalCustomers] = await Promise.all([
      // New customers (only 1 order)
      sequelize.query(
        `
        SELECT COUNT(*) as count
        FROM users u
        WHERE u.role = 'customer'
        AND (SELECT COUNT(*) FROM orders WHERE user_id = u.id) = 1
        ${startDate && endDate ? 'AND u.created_at BETWEEN :startDate AND :endDate' : ''}
        ${startDate && !endDate ? 'AND u.created_at >= :startDate' : ''}
        ${!startDate && endDate ? 'AND u.created_at <= :endDate' : ''}
      `,
        {
          replacements: { startDate, endDate },
          type: 'SELECT',
        }
      ),

      // Returning customers (more than 1 order)
      sequelize.query(
        `
        SELECT COUNT(*) as count
        FROM users u
        WHERE u.role = 'customer'
        AND (SELECT COUNT(*) FROM orders WHERE user_id = u.id) > 1
      `,
        {
          type: 'SELECT',
        }
      ),

      // Total customers
      User.count({
        where: {
          role: 'customer',
          ...(dateFilter ? { created_at: dateFilter } : {}),
        },
      }),
    ]);

    return {
      totalCustomers,
      newCustomers: (newCustomers as any)[0]?.count || 0,
      returningCustomers: (returningCustomers as any)[0]?.count || 0,
    };
  } catch (error: any) {
    logger.error('Error getting customer analytics:', error);
    throw error;
  }
};

/**
 * Customer Lifetime Value - Top customers
 */
export const getTopCustomersBySpending = async (limit: number = 10) => {
  try {
    const query = `
      SELECT 
        u.id,
        u.email,
        u.phone,
        COUNT(DISTINCT o.id) as order_count,
        SUM(o.total_amount) as lifetime_value,
        AVG(o.total_amount) as avg_order_value,
        MAX(o.ordered_at) as last_order_date
      FROM users u
      JOIN orders o ON u.id = o.user_id
      WHERE o.payment_status = 'paid'
      AND u.role = 'customer'
      GROUP BY u.id, u.email, u.phone
      ORDER BY lifetime_value DESC
      LIMIT :limit
    `;

    const [results] = await sequelize.query(query, {
      replacements: { limit },
    });

    return (results as any[]).map((r: any) => ({
      userId: r.id,
      email: r.email,
      phone: r.phone,
      orderCount: parseInt(r.order_count),
      lifetimeValue: parseFloat(r.lifetime_value),
      avgOrderValue: parseFloat(r.avg_order_value),
      lastOrderDate: r.last_order_date,
    }));
  } catch (error: any) {
    logger.error('Error getting top customers:', error);
    throw error;
  }
};

/**
 * Geographic Distribution
 */
export const getCustomerGeographicDistribution = async () => {
  try {
    const distribution = await Order.findAll({
      attributes: [
        'shipping_state',
        'shipping_city',
        [fn('COUNT', fn('DISTINCT', col('user_id'))), 'customer_count'],
        [fn('COUNT', col('id')), 'order_count'],
        [fn('SUM', col('total_amount')), 'total_revenue'],
      ],
      where: {
        payment_status: 'paid',
      },
      group: ['shipping_state', 'shipping_city'],
      order: [[literal('total_revenue'), 'DESC']],
      limit: 50,
      raw: true,
    });

    return distribution.map((d: any) => ({
      state: d.shipping_state,
      city: d.shipping_city,
      customerCount: parseInt(d.customer_count),
      orderCount: parseInt(d.order_count),
      revenue: parseFloat(d.total_revenue || 0),
    }));
  } catch (error: any) {
    logger.error('Error getting geographic distribution:', error);
    throw error;
  }
};

/**
 * Rental Analytics - Utilization Rate
 */
export const getRentalAnalytics = async (startDate?: string, endDate?: string) => {
  try {
    const dateFilter = getDateRange(startDate, endDate);

    const [
      totalRentals,
      activeRentals,
      completedRentals,
      overdueRentals,
      totalRentalRevenue,
      avgRentalDuration,
    ] = await Promise.all([
      Rental.count({
        where: dateFilter ? { rental_start_date: dateFilter } : {},
      }),

      Rental.count({
        where: {
          rental_status: { [Op.in]: ['booked', 'active', 'collected'] },
        },
      }),

      Rental.count({
        where: {
          rental_status: 'returned',
          ...(dateFilter ? { rental_start_date: dateFilter } : {}),
        },
      }),

      Rental.count({
        where: {
          rental_status: 'overdue',
        },
      }),

      Rental.sum('total_rental_amount', {
        where: {
          rental_status: { [Op.in]: ['active', 'completed', 'returned'] },
          ...(dateFilter ? { rental_start_date: dateFilter } : {}),
        },
      }),

      Rental.findOne({
        attributes: [[fn('AVG', col('rental_days')), 'avg_days']],
        where: dateFilter ? { rental_start_date: dateFilter } : {},
        raw: true,
      }),
    ]);

    return {
      totalRentals: totalRentals || 0,
      activeRentals: activeRentals || 0,
      completedRentals: completedRentals || 0,
      overdueRentals: overdueRentals || 0,
      totalRevenue: totalRentalRevenue || 0,
      avgRentalDuration: parseFloat((avgRentalDuration as any)?.avg_days || 0),
      utilizationRate: totalRentals > 0 ? ((activeRentals + completedRentals) / totalRentals) * 100 : 0,
    };
  } catch (error: any) {
    logger.error('Error getting rental analytics:', error);
    throw error;
  }
};

/**
 * Popular Rental Products
 */
export const getPopularRentalProducts = async (limit: number = 10) => {
  try {
    const query = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        COUNT(r.id) as rental_count,
        SUM(r.total_rental_amount) as total_revenue,
        AVG(r.rental_days) as avg_rental_days
      FROM rentals r
      JOIN products p ON r.product_id = p.id
      WHERE r.rental_status IN ('active', 'completed', 'returned')
      GROUP BY p.id, p.name, p.sku
      ORDER BY rental_count DESC
      LIMIT :limit
    `;

    const [results] = await sequelize.query(query, {
      replacements: { limit },
    });

    return (results as any[]).map((r: any) => ({
      id: r.id,
      name: r.name,
      sku: r.sku,
      rentalCount: parseInt(r.rental_count),
      totalRevenue: parseFloat(r.total_revenue),
      avgRentalDays: parseFloat(r.avg_rental_days),
    }));
  } catch (error: any) {
    logger.error('Error getting popular rental products:', error);
    throw error;
  }
};

export default {
  getDashboardOverview,
  getRevenueTrends,
  getOrderStatusBreakdown,
  getPaymentMethodDistribution,
  getSalesByCategory,
  getTopSellingProducts,
  getLowStockProducts,
  getCustomerAnalytics,
  getTopCustomersBySpending,
  getCustomerGeographicDistribution,
  getRentalAnalytics,
  getPopularRentalProducts,
};
