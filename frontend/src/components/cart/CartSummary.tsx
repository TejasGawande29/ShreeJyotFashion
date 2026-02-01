'use client';

import Link from 'next/link';
import { FiTag } from 'react-icons/fi';

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  couponCode: string;
  appliedCoupon: {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  } | null;
  onCouponChange: (code: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
}

export function CartSummary({
  subtotal,
  shipping,
  tax,
  discount,
  total,
  couponCode,
  appliedCoupon,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
}: CartSummaryProps) {
  return (
    <div className="sticky top-24 space-y-6">
      {/* Order Summary Card */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">
          Order Summary
        </h2>

        {/* Price Breakdown */}
        <div className="space-y-4">
          <div className="flex justify-between text-neutral-700">
            <span>Subtotal</span>
            <span className="font-medium">₹{subtotal.toLocaleString()}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span className="font-medium">-₹{discount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-neutral-700">
            <span>Tax (GST 18%)</span>
            <span className="font-medium">₹{tax.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-neutral-700">
            <span>Shipping</span>
            {shipping === 0 ? (
              <span className="font-medium text-green-600">FREE</span>
            ) : (
              <span className="font-medium">₹{shipping}</span>
            )}
          </div>

          {shipping > 0 && subtotal < 2000 && (
            <p className="text-sm text-neutral-500 bg-neutral-50 p-3 rounded-lg">
              Add ₹{(2000 - subtotal).toLocaleString()} more for free shipping
            </p>
          )}

          <div className="border-t border-neutral-200 pt-4">
            <div className="flex justify-between text-lg">
              <span className="font-bold text-neutral-900">Total</span>
              <span className="font-bold text-neutral-900">
                ₹{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <Link
          href="/checkout"
          className="block w-full mt-6 px-6 py-3.5 bg-primary-600 text-white text-center font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
        >
          Proceed to Checkout
        </Link>

        <p className="text-xs text-neutral-500 text-center mt-3">
          Secure checkout with 256-bit SSL encryption
        </p>
      </div>

      {/* Coupon Code Card - Desktop Only */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiTag className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-neutral-900">
            Apply Coupon
          </h3>
        </div>

        {appliedCoupon ? (
          <div className="space-y-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-900">
                Coupon Applied: {appliedCoupon.code}
              </p>
              <p className="text-sm text-green-700 mt-1">
                {appliedCoupon.type === 'percentage'
                  ? `${appliedCoupon.discount}% off`
                  : `₹${appliedCoupon.discount} off`}
              </p>
            </div>
            <button
              onClick={onRemoveCoupon}
              className="w-full px-4 py-2 text-sm text-green-700 hover:text-green-900 font-medium border border-green-300 hover:border-green-400 rounded-lg transition-colors"
            >
              Remove Coupon
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => onCouponChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onApplyCoupon()}
                placeholder="Enter code"
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
              <button
                onClick={onApplyCoupon}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
              >
                Apply
              </button>
            </div>

            <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm font-medium text-neutral-900 mb-2">
                Available Coupons:
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  <span><strong>WELCOME10</strong> - Get 10% off on your order</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  <span><strong>SAVE500</strong> - Save ₹500 instantly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  <span><strong>SUMMER20</strong> - Enjoy 20% discount</span>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Benefits Card */}
      <div className="bg-primary-50 rounded-lg p-6 border border-primary-100">
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">
          Why Shop With Us?
        </h3>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">✓</span>
            <span>Free shipping on orders above ₹2000</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">✓</span>
            <span>Easy 7-day return & exchange</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">✓</span>
            <span>100% secure payment</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">✓</span>
            <span>Cash on delivery available</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
