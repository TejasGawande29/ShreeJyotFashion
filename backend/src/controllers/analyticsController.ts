import { Request, Response } from 'express';
import * as analyticsService from '../services/analyticsService';
import logger from '../utils/logger';

/**
 * Get Dashboard Overview
 * GET /api/analytics/dashboard
 */
export const getDashboard = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date } = req.query;

    const data = await analyticsService.getDashboardOverview(
      start_date as string,
      end_date as string
    );

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    logger.error('Error in getDashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message,
    });
  }
};

/**
 * Get Revenue Trends
 * GET /api/analytics/revenue-trends
 */
export const getRevenueTrends = async (req: Request, res: Response) => {
  try {
    const { period = 'daily', start_date, end_date } = req.query;

    // Validate period
    if (!['daily', 'weekly', 'monthly'].includes(period as string)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid period. Must be daily, weekly, or monthly',
      });
    }

    const data = await analyticsService.getRevenueTrends(
      period as 'daily' | 'weekly' | 'monthly',
      start_date as string,
      end_date as string
    );

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    logger.error('Error in getRevenueTrends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue trends',
      error: error.message,
    });
  }
};

/**
 * Get Order Status Breakdown
 * GET /api/analytics/order-status
 */
export const getOrderStatusBreakdown = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date } = req.query;

    const data = await analyticsService.getOrderStatusBreakdown(
      start_date as string,
      end_date as string
    );

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    logger.error('Error in getOrderStatusBreakdown:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order status breakdown',
      error: error.message,
    });
  }
};

/**
 * Get Payment Method Distribution
 * GET /api/analytics/payment-methods
 */
export const getPaymentMethodDistribution = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date } = req.query;

    const data = await analyticsService.getPaymentMethodDistribution(
      start_date as string,
      end_date as string
    );

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    logger.error('Error in getPaymentMethodDistribution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment method distribution',
      error: error.message,
    });
  }
};

/**
 * Get Sales by Category
 * GET /api/analytics/sales-by-category
 */
export const getSalesByCategory = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date } = req.query;

    const data = await analyticsService.getSalesByCategory(
      start_date as string,
      end_date as string
    );

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    logger.error('Error in getSalesByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales by category',
      error: error.message,
    });
  }
};

/**
 * Get Top Selling Products
 * GET /api/analytics/top-products
 */
export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const { limit = 10, start_date, end_date } = req.query;

    const data = await analyticsService.getTopSellingProducts(
      parseInt(limit as string),
      start_date as string,
      end_date as string
    );

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    logger.error('Error in getTopProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top products',
      error: error.message,
    });
  }
};

/**
 * Get Low Stock Products
 * GET /api/analytics/low-stock
 */
export const getLowStockProducts = async (req: Request, res: Response) => {
  try {
    const { threshold = 10 } = req.query;

    const data = await analyticsService.getLowStockProducts(
      parseInt(threshold as string)
    );

    res.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error: any) {
    logger.error('Error in getLowStockProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch low stock products',
      error: error.message,
    });
  }
};

/**
 * Get Customer Analytics
 * GET /api/analytics/customers
 */
export const getCustomerAnalytics = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date } = req.query;

    const data = await analyticsService.getCustomerAnalytics(
      start_date as string,
      end_date as string
    );

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    logger.error('Error in getCustomerAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer analytics',
      error: error.message,
    });
  }
};

/**
 * Get Top Customers by Spending
 * GET /api/analytics/top-customers
 */
export const getTopCustomers = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const data = await analyticsService.getTopCustomersBySpending(
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    logger.error('Error in getTopCustomers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top customers',
      error: error.message,
    });
  }
};

/**
 * Get Customer Geographic Distribution
 * GET /api/analytics/customer-geography
 */
export const getCustomerGeography = async (req: Request, res: Response) => {
  try {
    const data = await analyticsService.getCustomerGeographicDistribution();

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    logger.error('Error in getCustomerGeography:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer geographic distribution',
      error: error.message,
    });
  }
};

/**
 * Get Rental Analytics
 * GET /api/analytics/rentals
 */
export const getRentalAnalytics = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date } = req.query;

    const data = await analyticsService.getRentalAnalytics(
      start_date as string,
      end_date as string
    );

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    logger.error('Error in getRentalAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rental analytics',
      error: error.message,
    });
  }
};

/**
 * Get Popular Rental Products
 * GET /api/analytics/popular-rentals
 */
export const getPopularRentals = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const data = await analyticsService.getPopularRentalProducts(
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    logger.error('Error in getPopularRentals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular rental products',
      error: error.message,
    });
  }
};

export default {
  getDashboard,
  getRevenueTrends,
  getOrderStatusBreakdown,
  getPaymentMethodDistribution,
  getSalesByCategory,
  getTopProducts,
  getLowStockProducts,
  getCustomerAnalytics,
  getTopCustomers,
  getCustomerGeography,
  getRentalAnalytics,
  getPopularRentals,
};
