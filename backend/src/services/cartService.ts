/**
 * Cart Service
 * Business logic for shopping cart operations
 */

import CartItem from '../models/CartItem';
import Product from '../models/Product';
import ProductVariant from '../models/ProductVariant';
import ProductImage from '../models/ProductImage';
import ProductPrice from '../models/ProductPrice';
import Category from '../models/Category';
import { Op } from 'sequelize';

interface CartItemResponse {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  product_description: string | null;
  base_price: number;
  category_id: number | null;
  category_name: string | null;
  variant_id: number | null;
  variant_sku: string | null;
  size: string | null;
  color: string | null;
  variant_price: number | null;
  quantity: number;
  available_stock: number;
  image_url: string | null;
  subtotal: number;
  added_at: Date;
}

interface CartSummary {
  items: CartItemResponse[];
  summary: {
    total_items: number;
    total_quantity: number;
    subtotal: number;
    tax: number;
    tax_percentage: number;
    total: number;
  };
}

class CartService {
  /**
   * Get user's cart with full product details
   */
  async getUserCart(userId: number): Promise<CartSummary> {
    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'slug', 'description', 'category_id'],
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['name'],
            },
            {
              model: ProductImage,
              as: 'images',
              attributes: ['image_url'],
              where: { is_primary: true },
              required: false,
            },
            {
              model: ProductPrice,
              as: 'currentPrice',
              attributes: ['mrp', 'sale_price', 'discount_percentage'],
              required: false,
            },
          ],
        },
        {
          model: ProductVariant,
          as: 'variant',
          attributes: ['id', 'sku_variant', 'size', 'color', 'stock_quantity'],
          required: false,
        },
      ],
      order: [['added_at', 'DESC']],
    });

    // Transform to response format
    const items: CartItemResponse[] = cartItems.map((item: any) => {
      const product = item.product;
      const variant = item.variant;
      const primaryImage = product?.images?.[0];
      const currentPrice = product?.currentPrice;
      
      // Get effective price (sale_price if available, otherwise mrp)
      const price = currentPrice?.sale_price || currentPrice?.mrp || 0;
      const stock = variant?.stock_quantity || 0;
      const subtotal = price * item.quantity;

      return {
        id: item.id,
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        product_description: product.description,
        base_price: price,
        category_id: product.category_id,
        category_name: product.category?.name || null,
        variant_id: variant?.id || null,
        variant_sku: variant?.sku_variant || null,
        size: variant?.size || null,
        color: variant?.color || null,
        variant_price: null,  // TODO: Add variant pricing if needed
        quantity: item.quantity,
        available_stock: stock,
        image_url: primaryImage?.image_url || null,
        subtotal: parseFloat(subtotal.toFixed(2)),
        added_at: item.added_at,
      };
    });

    // Calculate summary
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const taxPercentage = 18; // 18% GST (can be made configurable)
    const tax = parseFloat(((subtotal * taxPercentage) / 100).toFixed(2));
    const total = parseFloat((subtotal + tax).toFixed(2));

    return {
      items,
      summary: {
        total_items: items.length,
        total_quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax,
        tax_percentage: taxPercentage,
        total,
      },
    };
  }

  /**
   * Add item to cart or update quantity if already exists
   */
  async addToCart(
    userId: number,
    productId: number,
    variantId: number | null,
    quantity: number
  ): Promise<{ message: string; cartItem: any; action: 'added' | 'updated' }> {
    // Validate product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // If variant specified, validate it exists and has stock
    if (variantId) {
      const variant = await ProductVariant.findOne({
        where: {
          id: variantId,
          product_id: productId,
          is_active: true,
        },
      });

      if (!variant) {
        throw new Error('Product variant not found');
      }

      if (variant.stock_quantity < quantity) {
        throw new Error(`Only ${variant.stock_quantity} items available in stock`);
      }
    }

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      where: {
        user_id: userId,
        product_id: productId,
        variant_id: variantId || null,
      },
    });

    let cartItem;
    let action: 'added' | 'updated';

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      // Check stock availability for new quantity
      if (variantId) {
        const variant = await ProductVariant.findByPk(variantId);
        if (variant && variant.stock_quantity < newQuantity) {
          throw new Error(`Only ${variant.stock_quantity} items available in stock`);
        }
      }

      existingItem.quantity = newQuantity;
      existingItem.updated_at = new Date();
      await existingItem.save();
      cartItem = existingItem;
      action = 'updated';
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        user_id: userId,
        product_id: productId,
        variant_id: variantId,
        quantity,
      });
      action = 'added';
    }

    // Fetch full cart item details
    const fullCartItem = await CartItem.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'slug'],
          include: [
            {
              model: ProductImage,
              as: 'images',
              attributes: ['image_url'],
              where: { is_primary: true },
              required: false,
            },
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
          attributes: ['sku_variant', 'size', 'color'],  // Changed 'sku' to 'sku_variant'
          required: false,
        },
      ],
    });

    return {
      message: action === 'added' ? 'Item added to cart' : 'Cart item quantity updated',
      cartItem: fullCartItem,
      action,
    };
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(
    cartItemId: number,
    userId: number,
    quantity: number
  ): Promise<{ message: string; cartItem: any }> {
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, user_id: userId },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    // Check stock availability
    if (cartItem.variant_id) {
      const variant = await ProductVariant.findByPk(cartItem.variant_id);
      if (variant && variant.stock_quantity < quantity) {
        throw new Error(`Only ${variant.stock_quantity} items available in stock`);
      }
    }

    cartItem.quantity = quantity;
    cartItem.updated_at = new Date();
    await cartItem.save();

    // Fetch full cart item details
    const fullCartItem = await CartItem.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'slug'],
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
          attributes: ['sku_variant', 'size', 'color'],  // Changed 'sku' to 'sku_variant'
          required: false,
        },
      ],
    });

    return {
      message: 'Cart item updated successfully',
      cartItem: fullCartItem,
    };
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(cartItemId: number, userId: number): Promise<{ message: string }> {
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, user_id: userId },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    await cartItem.destroy();

    return {
      message: 'Item removed from cart successfully',
    };
  }

  /**
   * Clear entire cart
   */
  async clearCart(userId: number): Promise<{ message: string; deletedCount: number }> {
    const deletedCount = await CartItem.destroy({
      where: { user_id: userId },
    });

    return {
      message: 'Cart cleared successfully',
      deletedCount,
    };
  }

  /**
   * Get cart item count for user
   */
  async getCartCount(userId: number): Promise<{ count: number; total_quantity: number }> {
    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      attributes: ['quantity'],
    });

    return {
      count: cartItems.length,
      total_quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  /**
   * Merge guest cart with user cart (after login)
   */
  async mergeCart(
    userId: number,
    guestCartItems: Array<{ product_id: number; variant_id: number | null; quantity: number }>
  ): Promise<{ message: string; merged_items: number }> {
    let mergedCount = 0;

    for (const guestItem of guestCartItems) {
      try {
        await this.addToCart(userId, guestItem.product_id, guestItem.variant_id, guestItem.quantity);
        mergedCount++;
      } catch (error) {
        // Skip items that can't be added (out of stock, etc.)
        console.error(`Failed to merge cart item:`, error);
      }
    }

    return {
      message: `Cart merged successfully. ${mergedCount} items added.`,
      merged_items: mergedCount,
    };
  }

  /**
   * Validate cart items (check stock, pricing, etc.)
   * Used before checkout
   */
  async validateCart(userId: number): Promise<{
    valid: boolean;
    issues: Array<{
      cart_item_id: number;
      product_name: string;
      issue: string;
      severity: 'error' | 'warning';
    }>;
  }> {
    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'is_active', 'is_deleted'],
        },
        {
          model: ProductVariant,
          as: 'variant',
          attributes: ['id', 'stock_quantity', 'is_active'],
          required: false,
        },
      ],
    });

    const issues: Array<{
      cart_item_id: number;
      product_name: string;
      issue: string;
      severity: 'error' | 'warning';
    }> = [];

    for (const item of cartItems) {
      const product = (item as any).product;
      const variant = (item as any).variant;

      // Check if product is deleted or inactive
      if (product.is_deleted || !product.is_active) {
        issues.push({
          cart_item_id: item.id,
          product_name: product.name,
          issue: 'Product is no longer available',
          severity: 'error',
        });
        continue;
      }

      // Check if variant is inactive
      if (item.variant_id && variant && !variant.is_active) {
        issues.push({
          cart_item_id: item.id,
          product_name: product.name,
          issue: 'Product variant is no longer available',
          severity: 'error',
        });
        continue;
      }

      // Check stock availability
      if (item.variant_id && variant) {
        if (variant.stock_quantity < item.quantity) {
          issues.push({
            cart_item_id: item.id,
            product_name: product.name,
            issue: `Only ${variant.stock_quantity} items available in stock`,
            severity: variant.stock_quantity === 0 ? 'error' : 'warning',
          });
        }
      }
    }

    return {
      valid: issues.filter((i) => i.severity === 'error').length === 0,
      issues,
    };
  }
}

export default new CartService();
