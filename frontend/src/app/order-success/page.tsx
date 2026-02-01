'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiPackage, FiTruck, FiHome, FiShoppingBag } from 'react-icons/fi';
import { useAppDispatch } from '@/lib/redux/hooks';
import { clearCart } from '@/lib/redux/slices/cartSlice';
import { resetCheckout } from '@/lib/redux/slices/checkoutSlice';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    if (!searchParams) {
      router.push('/');
      return;
    }
    
    const id = searchParams.get('orderId');
    if (!id) {
      router.push('/');
      return;
    }
    setOrderId(id);

    // Clear cart and checkout state
    dispatch(clearCart());
    dispatch(resetCheckout());
  }, [searchParams, router, dispatch]);

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Calculate estimated delivery date (7 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FiCheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="text-lg font-semibold text-gray-900">{orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
              <p className="text-lg font-semibold text-pink-500">
                {formattedDeliveryDate}
              </p>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What happens next?
            </h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Order Confirmed</h4>
                  <p className="text-sm text-gray-600">
                    Your order has been received and is being processed
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Just now</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiPackage className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Preparing for Dispatch</h4>
                  <p className="text-sm text-gray-600">
                    We're getting your items ready for shipment
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Within 1-2 days</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiTruck className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Out for Delivery</h4>
                  <p className="text-sm text-gray-600">
                    Your order is on its way to you
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Within 5-7 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Email */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              📧 A confirmation email has been sent to your registered email address with order details.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/products"
              className="flex items-center justify-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors font-semibold"
            >
              <FiShoppingBag className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              <FiHome className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Need Help?
          </h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about your order, please contact our customer support team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
            <a
              href="mailto:support@shreejyotfashion.com"
              className="text-pink-500 hover:underline"
            >
              📧 support@shreejyotfashion.com
            </a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a
              href="tel:+911234567890"
              className="text-pink-500 hover:underline"
            >
              📞 +91 123-456-7890
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ProtectedRoute requireAuth>
        <OrderSuccessContent />
      </ProtectedRoute>
    </Suspense>
  );
}
