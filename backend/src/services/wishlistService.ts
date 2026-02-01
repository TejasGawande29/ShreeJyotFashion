/**
 * Wishlist Service
 * Business logic for wishlist operations
 */

import WishlistItem from '../models/WishlistItem';
import Product from '../models/Product';
import ProductVariant from '../models/ProductVariant';
import ProductImage from '../models/ProductImage';
import ProductPrice from '../models/ProductPrice';
import Category from '../models/Category';
import CartItem from '../models/CartItem';

interface WishlistItemResponse {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  product_description: string | null;
  base_price: number;
  category_id: number | null;
  category_name: string | null;
  image_url: string | null;
  is_active: boolean;
  in_stock: boolean;
  added_at: Date;
}

class WishlistService {
  /**
   * Get user's wishlist with full product details
   */
  async getUserWishlist(userId: number): Promise<{
    items: WishlistItemResponse[];
    total: number;
  }> {
    const wishlistItems = await WishlistItem.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'slug', 'description', 'category_id', 'is_active', 'is_deleted'],
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
            {
              model: ProductVariant,
              as: 'variants',
              attributes: ['stock_quantity'],
              where: { is_active: true },
              required: false,
            },
          ],
        },
      ],
      order: [['added_at', 'DESC']],
    });

    // Transform to response format
    const items: WishlistItemResponse[] = wishlistItems.map((item: any) => {
      const product = item.product;
      const primaryImage = product?.images?.[0];
      const currentPrice = product?.currentPrice;
      
      // Check if any variant has stock
      const inStock = product?.variants?.some((v: any) => v.stock_quantity > 0) || false;
      
      // Get effective price
      const price = currentPrice?.sale_price || currentPrice?.mrp || 0;

      return {
        id: item.id,
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        product_description: product.description,
        base_price: price,
        category_id: product.category_id,
        category_name: product.category?.name || null,
        image_url: primaryImage?.image_url || null,
        is_active: product.is_active && !product.is_deleted,
        in_stock: inStock,
        added_at: item.added_at,
      };
    });

    return {
      items,
      total: items.length,
    };
  }

  /**
   * Add product to wishlist
   */
  async addToWishlist(userId: number, productId: number): Promise<{
    message: string;
    wishlistItem: any;
  }> {
    // Validate product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (!product.is_active || product.is_deleted) {
      throw new Error('Product is not available');
    }

    // Check if already in wishlist
    const existingItem = await WishlistItem.findOne({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });

    if (existingItem) {
      throw new Error('Product already in wishlist');
    }

    // Add to wishlist
    const wishlistItem = await WishlistItem.create({
      user_id: userId,
      product_id: productId,
    });

    // Fetch full wishlist item details
    const fullWishlistItem = await WishlistItem.findByPk(wishlistItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'slug'],
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
      ],
    });

    return {
      message: 'Product added to wishlist successfully',
      wishlistItem: fullWishlistItem,
    };
  }

  /**
   * Remove product from wishlist
   */
  async removeFromWishlist(
    wishlistItemId: number,
    userId: number
  ): Promise<{ message: string }> {
    const wishlistItem = await WishlistItem.findOne({
      where: { id: wishlistItemId, user_id: userId },
    });

    if (!wishlistItem) {
      throw new Error('Wishlist item not found');
    }

    await wishlistItem.destroy();

    return {
      message: 'Product removed from wishlist successfully',
    };
  }

  /**
   * Remove product from wishlist by product ID
   */
  async removeByProductId(userId: number, productId: number): Promise<{ message: string }> {
    const wishlistItem = await WishlistItem.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (!wishlistItem) {
      throw new Error('Product not found in wishlist');
    }

    await wishlistItem.destroy();

    return {
      message: 'Product removed from wishlist successfully',
    };
  }

  /**
   * Clear entire wishlist
   */
  async clearWishlist(userId: number): Promise<{ message: string; deletedCount: number }> {
    const deletedCount = await WishlistItem.destroy({
      where: { user_id: userId },
    });

    return {
      message: 'Wishlist cleared successfully',
      deletedCount,
    };
  }

  /**
   * Move wishlist item to cart
   */
  async moveToCart(
    wishlistItemId: number,
    userId: number,
    variantId: number | null = null,
    quantity: number = 1
  ): Promise<{ message: string; cartItem: any }> {
    // Find wishlist item
    const wishlistItem = await WishlistItem.findOne({
      where: { id: wishlistItemId, user_id: userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'is_active', 'is_deleted'],
        },
      ],
    });

    if (!wishlistItem) {
      throw new Error('Wishlist item not found');
    }

    const product = (wishlistItem as any).product;

    // Validate product is active
    if (!product.is_active || product.is_deleted) {
      throw new Error('Product is not available');
    }

    // If variant specified, validate it
    if (variantId) {
      const variant = await ProductVariant.findOne({
        where: {
          id: variantId,
          product_id: wishlistItem.product_id,
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

    // Check if already in cart
    const existingCartItem = await CartItem.findOne({
      where: {
        user_id: userId,
        product_id: wishlistItem.product_id,
        variant_id: variantId || null,
      },
    });

    let cartItem;

    if (existingCartItem) {
      // Update quantity
      existingCartItem.quantity += quantity;
      existingCartItem.updated_at = new Date();
      await existingCartItem.save();
      cartItem = existingCartItem;
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        user_id: userId,
        product_id: wishlistItem.product_id,
        variant_id: variantId,
        quantity,
      });
    }

    // Remove from wishlist
    await wishlistItem.destroy();

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
      message: 'Product moved to cart successfully',
      cartItem: fullCartItem,
    };
  }

  /**
   * Check if product is in user's wishlist
   */
  async isInWishlist(userId: number, productId: number): Promise<{ inWishlist: boolean; wishlistItemId: number | null }> {
    const wishlistItem = await WishlistItem.findOne({
      where: { user_id: userId, product_id: productId },
      attributes: ['id'],
    });

    return {
      inWishlist: !!wishlistItem,
      wishlistItemId: wishlistItem?.id || null,
    };
  }

  /**
   * Get wishlist count
   */
  async getWishlistCount(userId: number): Promise<{ count: number }> {
    const count = await WishlistItem.count({
      where: { user_id: userId },
    });

    return { count };
  }
}

export default new WishlistService();
