import express from 'express';
import * as analyticsController from '../controllers/analyticsController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = express.Router();

// All analytics routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

/**
 * Dashboard Overview
 * GET /api/analytics/dashboard?start_date=2024-01-01&end_date=2024-12-31
 */
router.get('/dashboard', analyticsController.getDashboard);

/**
 * Revenue Trends
 * GET /api/analytics/revenue-trends?period=daily&start_date=2024-01-01&end_date=2024-12-31
 * period: daily | weekly | monthly
 */
router.get('/revenue-trends', analyticsController.getRevenueTrends);

/**
 * Order Status Breakdown
 * GET /api/analytics/order-status?start_date=2024-01-01&end_date=2024-12-31
 */
router.get('/order-status', analyticsController.getOrderStatusBreakdown);

/**
 * Payment Method Distribution
 * GET /api/analytics/payment-methods?start_date=2024-01-01&end_date=2024-12-31
 */
router.get('/payment-methods', analyticsController.getPaymentMethodDistribution);

/**
 * Sales by Category
 * GET /api/analytics/sales-by-category?start_date=2024-01-01&end_date=2024-12-31
 */
router.get('/sales-by-category', analyticsController.getSalesByCategory);

/**
 * Top Selling Products
 * GET /api/analytics/top-products?limit=10&start_date=2024-01-01&end_date=2024-12-31
 */
router.get('/top-products', analyticsController.getTopProducts);

/**
 * Low Stock Products
 * GET /api/analytics/low-stock?threshold=10
 */
router.get('/low-stock', analyticsController.getLowStockProducts);

/**
 * Customer Analytics (New vs Returning)
 * GET /api/analytics/customers?start_date=2024-01-01&end_date=2024-12-31
 */
router.get('/customers', analyticsController.getCustomerAnalytics);

/**
 * Top Customers by Spending
 * GET /api/analytics/top-customers?limit=10
 */
router.get('/top-customers', analyticsController.getTopCustomers);

/**
 * Customer Geographic Distribution
 * GET /api/analytics/customer-geography
 */
router.get('/customer-geography', analyticsController.getCustomerGeography);

/**
 * Rental Analytics
 * GET /api/analytics/rentals?start_date=2024-01-01&end_date=2024-12-31
 */
router.get('/rentals', analyticsController.getRentalAnalytics);

/**
 * Popular Rental Products
 * GET /api/analytics/popular-rentals?limit=10
 */
router.get('/popular-rentals', analyticsController.getPopularRentals);

export default router;
