'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FiEdit2, FiMapPin, FiCreditCard, FiTag, FiFileText } from 'react-icons/fi';
import type { CartItem } from '@/lib/redux/slices/cartSlice';
import type { ShippingAddress, PaymentDetails } from '@/lib/redux/slices/checkoutSlice';

interface OrderReviewProps {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress | null;
  paymentDetails: PaymentDetails | null;
  orderNotes?: string;
  couponCode?: string;
  onEditShipping?: () => void;
  onEditPayment?: () => void;
  onNotesChange?: (notes: string) => void;
  onPlaceOrder: () => void;
  onBack?: () => void;
}

export default function OrderReview({
  cartItems,
  shippingAddress,
  paymentDetails,
  orderNotes = '',
  couponCode = '',
  onEditShipping,
  onEditPayment,
  onNotesChange,
  onPlaceOrder,
  onBack,
}: OrderReviewProps) {
  const [notes, setNotes] = useState(orderNotes);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 999 ? 0 : 99; // Free shipping above ₹999
  const discount = couponCode ? subtotal * 0.1 : 0; // 10% discount if coupon applied
  const total = subtotal + tax + shipping - discount;

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNotes(value);
    onNotesChange?.(value);
  };

  const handlePlaceOrder = async () => {
    if (!acceptedTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    setIsProcessing(true);
    try {
      await onPlaceOrder();
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentMethodDisplay = () => {
    if (!paymentDetails) return 'Not selected';
    
    switch (paymentDetails.method) {
      case 'cod':
        return 'Cash on Delivery';
      case 'card':
        return `Card ending in ${paymentDetails.cardNumber?.slice(-4)}`;
      case 'upi':
        return `UPI: ${paymentDetails.upiId}`;
      case 'netbanking':
        return 'Net Banking';
      default:
        return 'Not selected';
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Review Your Order</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">
              Order Items ({cartItems.length})
            </h4>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex space-x-4 pb-4 border-b last:border-b-0">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 truncate">{item.name}</h5>
                    {item.size && (
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                    )}
                    {item.color && (
                      <p className="text-sm text-gray-600">Color: {item.color}</p>
                    )}
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FiMapPin className="w-5 h-5 text-gray-600" />
                <h4 className="font-semibold text-gray-900">Shipping Address</h4>
              </div>
              {onEditShipping && (
                <button
                  type="button"
                  onClick={onEditShipping}
                  className="text-pink-500 hover:text-pink-600 flex items-center space-x-1 text-sm"
                >
                  <FiEdit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            {shippingAddress ? (
              <div className="text-gray-700">
                <p className="font-medium">{shippingAddress.fullName}</p>
                <p className="text-sm mt-1">{shippingAddress.addressLine1}</p>
                {shippingAddress.addressLine2 && (
                  <p className="text-sm">{shippingAddress.addressLine2}</p>
                )}
                <p className="text-sm">
                  {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                </p>
                <p className="text-sm">{shippingAddress.country}</p>
                <p className="text-sm mt-2">Phone: {shippingAddress.phone}</p>
                <p className="text-sm">Email: {shippingAddress.email}</p>
              </div>
            ) : (
              <p className="text-red-500 text-sm">No shipping address selected</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FiCreditCard className="w-5 h-5 text-gray-600" />
                <h4 className="font-semibold text-gray-900">Payment Method</h4>
              </div>
              {onEditPayment && (
                <button
                  type="button"
                  onClick={onEditPayment}
                  className="text-pink-500 hover:text-pink-600 flex items-center space-x-1 text-sm"
                >
                  <FiEdit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            <p className="text-gray-700">{getPaymentMethodDisplay()}</p>
          </div>

          {/* Order Notes */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FiFileText className="w-5 h-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Order Notes (Optional)</h4>
            </div>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Any special instructions for delivery?"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
            <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
            
            <div className="space-y-3 mb-4 pb-4 border-b">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (GST 18%)</span>
                <span className="text-gray-900">₹{tax.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>

              {couponCode && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center space-x-1">
                    <FiTag className="w-4 h-4" />
                    <span>Discount ({couponCode})</span>
                  </span>
                  <span className="text-green-600">-₹{discount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-pink-500">
                ₹{total.toLocaleString()}
              </span>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-6">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="/terms" className="text-pink-500 hover:underline">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-pink-500 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handlePlaceOrder}
                disabled={!acceptedTerms || isProcessing}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  acceptedTerms && !isProcessing
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
              
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  disabled={isProcessing}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Back to Payment
                </button>
              )}
            </div>

            {/* Security Badge */}
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-xs text-gray-500">
                🔒 Secure checkout - Your data is encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
