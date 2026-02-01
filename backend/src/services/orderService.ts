/**
 * Order Service
 * Business logic for order management
 */

import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import CartItem from '../models/CartItem';
import Product from '../models/Product';
import ProductVariant from '../models/ProductVariant';
import ProductPrice from '../models/ProductPrice';
import * as emailService from './emailService';
import * as smsService from './smsService';
import * as notificationService from './notificationService';
import User from '../models/User';
import Address from '../models/Address';
import sequelize from '../config/database';
import { Op } from 'sequelize';

interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
}

interface CreateOrderData {
  user_id: number;
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  payment_method?: string;
  notes?: string;
}

interface OrderFilters {
  status?: string;
  payment_status?: string;
  user_id?: number;
  from_date?: string;
  to_date?: string;
}

/**
 * Create order from user's cart
 */
export const createOrder = async (data: CreateOrderData) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { user_id, shipping_address, billing_address, payment_method, notes } = data;

    // 1. Get user's cart
    const cartItems = await CartItem.findAll({
      where: { user_id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku', 'is_active', 'is_deleted'],
          include: [
            {
              model: ProductPrice,
              as: 'currentPrice',
              attributes: ['mrp', 'sale_price'],
              required: false,
            },
          ],
        },
        {
          model: ProductVariant,
          as: 'variant',
          attributes: ['id', 'sku_variant', 'size', 'color', 'stock_quantity', 'is_active'],
          required: false,
        },
      ],
      transaction,
    });

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    // 2. Validate products and calculate totals
    let subtotal = 0;
    const orderItemsData = [];

    for (const cartItem of cartItems) {
      const product = (cartItem as any).product;
      const variant = (cartItem as any).variant;
      const currentPrice = product?.currentPrice;

      // Validate product
      if (!product || !product.is_active || product.is_deleted) {
        throw new Error(`Product ${product?.name || 'unknown'} is not available`);
      }

      // Get price
      const unitPrice = currentPrice?.sale_price || currentPrice?.mrp || 0;
      if (unitPrice === 0) {
        throw new Error(`Price not set for product ${product.name}`);
      }

      // Validate stock
      if (variant) {
        if (!variant.is_active) {
          throw new Error(`Variant ${variant.sku_variant} is not available`);
        }
        if (variant.stock_quantity < cartItem.quantity) {
          throw new Error(`Insufficient stock for ${product.name} (${variant.size}, ${variant.color}). Available: ${variant.stock_quantity}`);
        }
      }

      const itemSubtotal = unitPrice * cartItem.quantity;
      subtotal += itemSubtotal;

      orderItemsData.push({
        product_id: product.id,
        variant_id: variant?.id || null,
        product_name: product.name,
        product_sku: product.sku,
        variant_sku: variant?.sku_variant || null,
        size: variant?.size || null,
        color: variant?.color || null,
        quantity: cartItem.quantity,
        unit_price: unitPrice,
        subtotal: itemSubtotal,
      });
    }

    // 3. Calculate amounts
    const taxPercentage = 18; // 18% GST
    const taxAmount = (subtotal * taxPercentage) / 100;
    const shippingAmount = 0; // Free shipping for now
    const discountAmount = 0; // No discount for now
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // 4. Create order
    const order = await Order.create(
      {
        order_number: orderNumber,
        user_id,
        status: 'pending',
        payment_status: 'pending',
        payment_method,
        subtotal,
        tax_amount: taxAmount,
        shipping_amount: shippingAmount,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        
        shipping_name: shipping_address.name,
        shipping_email: shipping_address.email,
        shipping_phone: shipping_address.phone,
        shipping_address_line1: shipping_address.address_line1,
        shipping_address_line2: shipping_address.address_line2,
        shipping_city: shipping_address.city,
        shipping_state: shipping_address.state,
        shipping_postal_code: shipping_address.postal_code,
        shipping_country: shipping_address.country || 'India',
        
        billing_name: billing_address?.name,
        billing_email: billing_address?.email,
        billing_phone: billing_address?.phone,
        billing_address_line1: billing_address?.address_line1,
        billing_address_line2: billing_address?.address_line2,
        billing_city: billing_address?.city,
        billing_state: billing_address?.state,
        billing_postal_code: billing_address?.postal_code,
        billing_country: billing_address?.country,
        
        notes,
        ordered_at: new Date(),
      },
      { transaction }
    );

    // 5. Create order items
    const orderItems = await OrderItem.bulkCreate(
      orderItemsData.map(item => ({
        ...item,
        order_id: order.id,
      })),
      { transaction }
    );

    // 6. Update stock (deduct quantities)
    for (const cartItem of cartItems) {
      const variant = (cartItem as any).variant;
      if (variant) {
        await variant.decrement('stock_quantity', {
          by: cartItem.quantity,
          transaction,
        });
      }
    }

    // 7. Clear cart
    await CartItem.destroy({
      where: { user_id },
      transaction,
    });

    await transaction.commit();

    // 8. Fetch complete order with items (outside transaction)
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'phone'],
        },
      ],
    });

    // 9. Send notifications (async, don't wait)
    if (completeOrder) {
      const user = (completeOrder as any).user;
      const items = (completeOrder as any).items;
      
      // Send order confirmation email
      emailService.sendOrderConfirmationEmail(
        user.email,
        user.id,
        {
          orderId: completeOrder.id,
          orderNumber: completeOrder.order_number,
          items: items.map((item: any) => ({
            name: item.product_name,
            quantity: item.quantity,
            price: item.unit_price,
          })),
          total: completeOrder.total_amount,
          shippingAddress: `${shipping_address.address_line1}, ${shipping_address.city}, ${shipping_address.state} - ${shipping_address.postal_code}`,
        }
      ).catch(err => console.error('Failed to send order confirmation email:', err));

      // Send order confirmation SMS
      if (user.phone) {
        smsService.sendOrderConfirmationSms(
          user.phone,
          user.id,
          {
            orderNumber: completeOrder.order_number,
            total: completeOrder.total_amount,
          }
        ).catch(err => console.error('Failed to send order confirmation SMS:', err));
      }

      // Create in-app notification
      notificationService.createOrderNotification(
        user.id,
        completeOrder.order_number,
        'placed'
      ).catch(err => console.error('Failed to create order notification:', err));
    }

    return {
      message: 'Order placed successfully',
      order: completeOrder,
    };
  } catch (error) {
    // Only rollback if transaction hasn't been committed yet
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      // Transaction was already committed or rolled back, ignore
    }
    throw error;
  }
};

/**
 * Get orders with filters and pagination
 */
export const getOrders = async (
  filters: OrderFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  const where: any = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.payment_status) {
    where.payment_status = filters.payment_status;
  }

  if (filters.user_id) {
    where.user_id = filters.user_id;
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
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'phone'],
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
      totalPages: Math.ceil(count / limit),
    },
  };
};

/**
 * Get single order by ID with all details
 */
export const getOrderById = async (orderId: number, userId?: number) => {
  const where: any = { id: orderId };
  
  // If userId provided, ensure order belongs to user
  if (userId) {
    where.user_id = userId;
  }

  const order = await Order.findOne({
    where,
    include: [
      {
        model: OrderItem,
        as: 'items',
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'phone'],
      },
    ],
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  orderId: number,
  status: string,
  trackingNumber?: string
) => {
  const order = await Order.findByPk(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  // Validate status transition
  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }

  // Update status
  order.status = status as any;

  // Update timestamps based on status
  const now = new Date();
  if (status === 'confirmed' && !order.confirmed_at) {
    order.confirmed_at = now;
  } else if (status === 'shipped' && !order.shipped_at) {
    order.shipped_at = now;
    if (trackingNumber) {
      order.tracking_number = trackingNumber;
    }
  } else if (status === 'delivered' && !order.delivered_at) {
    order.delivered_at = now;
  } else if (status === 'cancelled' && !order.cancelled_at) {
    order.cancelled_at = now;
  }

  await order.save();

  return {
    message: `Order status updated to ${status}`,
    order,
  };
};

/**
 * Cancel order
 */
export const cancelOrder = async (orderId: number, userId?: number) => {
  const transaction = await sequelize.transaction();

  try {
    const where: any = { id: orderId };
    if (userId) {
      where.user_id = userId;
    }

    const order = await Order.findOne({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items',
        },
      ],
      transaction,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (!order.canBeCancelled()) {
      throw new Error(`Order cannot be cancelled. Current status: ${order.status}`);
    }

    // Restore stock
    const orderItems = (order as any).items;
    for (const item of orderItems) {
      if (item.variant_id) {
        await ProductVariant.increment(
          'stock_quantity',
          {
            by: item.quantity,
            where: { id: item.variant_id },
            transaction,
          }
        );
      }
    }

    // Update order status
    order.status = 'cancelled';
    order.cancelled_at = new Date();
    await order.save({ transaction });

    await transaction.commit();

    return {
      message: 'Order cancelled successfully',
      order,
    };
  } catch (error) {
    // Only rollback if transaction hasn't been committed yet
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      // Transaction was already committed or rolled back, ignore
    }
    throw error;
  }
};

/**
 * Get order statistics
 */
export const getOrderStats = async (userId?: number) => {
  const where: any = {};
  if (userId) {
    where.user_id = userId;
  }

  const [
    totalOrders,
    pendingOrders,
    confirmedOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue,
  ] = await Promise.all([
    Order.count({ where }),
    Order.count({ where: { ...where, status: 'pending' } }),
    Order.count({ where: { ...where, status: 'confirmed' } }),
    Order.count({ where: { ...where, status: 'shipped' } }),
    Order.count({ where: { ...where, status: 'delivered' } }),
    Order.count({ where: { ...where, status: 'cancelled' } }),
    Order.sum('total_amount', { where: { ...where, status: 'delivered' } }),
  ]);

  return {
    total_orders: totalOrders,
    pending: pendingOrders,
    confirmed: confirmedOrders,
    shipped: shippedOrders,
    delivered: deliveredOrders,
    cancelled: cancelledOrders,
    total_revenue: totalRevenue || 0,
  };
};
