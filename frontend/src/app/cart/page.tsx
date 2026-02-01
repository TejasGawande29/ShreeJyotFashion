'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { removeItem, updateQuantity, clearCart } from '@/lib/redux/slices/cartSlice';
import { Breadcrumb, type BreadcrumbItem } from '@/components/common/Breadcrumb';
import { CartItem } from '@/components/cart/CartItem';
import RentalCartItem from '@/components/cart/RentalCartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { FiShoppingBag, FiTrash2, FiCalendar, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const { items, totalItems, totalPrice } = cart;
  
  // Separate sale and rental items
  const saleItems = items.filter(item => item.type === 'sale');
  const rentalItems = items.filter(item => item.type === 'rental');
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  } | null>(null);

  // Mock coupon codes (in real app, this would come from API)
  const validCoupons = {
    'WELCOME10': { discount: 10, type: 'percentage' as const },
    'SAVE500': { discount: 500, type: 'fixed' as const },
    'SUMMER20': { discount: 20, type: 'percentage' as const },
  };

  // Calculate prices
  const subtotal = totalPrice;
  const shipping = subtotal > 2000 ? 0 : 100; // Free shipping over ₹2000
  const tax = Math.round(subtotal * 0.18); // 18% GST
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = Math.round(subtotal * (appliedCoupon.discount / 100));
    } else {
      discount = appliedCoupon.discount;
    }
  }
  
  const total = subtotal - discount + tax + shipping;

  // Handlers
  const handleQuantityChange = (itemId: string, newQuantity: number, size?: string, color?: string) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId, size, color);
      return;
    }
    dispatch(updateQuantity({ id: itemId, size, color, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId: string, size?: string, color?: string) => {
    dispatch(removeItem({ id: itemId, size, color }));
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      setAppliedCoupon(null);
      toast.success('Cart cleared');
    }
  };

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    
    if (!code) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (appliedCoupon) {
      toast.error('A coupon is already applied');
      return;
    }

    const coupon = validCoupons[code as keyof typeof validCoupons];
    
    if (coupon) {
      setAppliedCoupon({
        code,
        discount: coupon.discount,
        type: coupon.type,
      });
      toast.success('Coupon applied successfully!');
      setCouponCode('');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  // Breadcrumb
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Shopping Cart', href: '/cart' },
  ];

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <FiShoppingBag className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
                Shopping Cart
              </h1>
              <p className="text-neutral-600 mt-1">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>

          {/* Clear Cart Button - Desktop */}
          <button
            onClick={handleClearCart}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rental Items Section */}
            {rentalItems.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 mb-4">
                  <FiCalendar className="w-5 h-5 text-pink-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Rental Items ({rentalItems.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {rentalItems.map((item) => (
                    <RentalCartItem
                      key={`${item.id}-${item.rentalStartDate}`}
                      id={item.id}
                      name={item.name}
                      slug={item.slug}
                      image={item.image}
                      size={item.size}
                      color={item.color}
                      rentalPrice={item.rentalPrice}
                      securityDeposit={item.securityDeposit}
                      rentalStartDate={item.rentalStartDate}
                      rentalEndDate={item.rentalEndDate}
                      rentalDays={item.rentalDays}
                      rentalTotalCost={item.rentalTotalCost}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sale Items Section */}
            {saleItems.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 mb-4">
                  <FiShoppingCart className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Sale Items ({saleItems.length})
                  </h2>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 divide-y divide-neutral-200">
                  {saleItems.map((item) => (
                    <CartItem
                      key={`${item.id}-${item.size}-${item.color}`}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Coupon Code Section - Mobile/Tablet */}
            <div className="lg:hidden bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Apply Coupon
              </h3>
              
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Coupon Applied: {appliedCoupon.code}
                    </p>
                    <p className="text-sm text-green-700">
                      {appliedCoupon.type === 'percentage'
                        ? `${appliedCoupon.discount}% off`
                        : `₹${appliedCoupon.discount} off`}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-sm text-green-700 hover:text-green-900 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Apply
                  </button>
                </div>
              )}

              <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm font-medium text-neutral-900 mb-2">
                  Available Coupons:
                </p>
                <ul className="space-y-1 text-sm text-neutral-600">
                  <li>• WELCOME10 - 10% off</li>
                  <li>• SAVE500 - ₹500 off</li>
                  <li>• SUMMER20 - 20% off</li>
                </ul>
              </div>
            </div>

            {/* Continue Shopping Link */}
            <Link
              href="/products"
              className="block text-center py-3 text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Continue Shopping
            </Link>

            {/* Clear Cart Button - Mobile */}
            <button
              onClick={handleClearCart}
              className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium"
            >
              <FiTrash2 className="w-4 h-4" />
              Clear Cart
            </button>
          </div>

          {/* Cart Summary - Right Column */}
          <div className="lg:col-span-1">
            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              discount={discount}
              total={total}
              couponCode={couponCode}
              appliedCoupon={appliedCoupon}
              onCouponChange={setCouponCode}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
