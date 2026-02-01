'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import {
  nextStep,
  previousStep,
  setShippingAddress,
  setPaymentDetails,
  setOrderNotes,
  resetCheckout,
  type ShippingAddress,
  type PaymentDetails,
} from '@/lib/redux/slices/checkoutSlice';
import { clearCart } from '@/lib/redux/slices/cartSlice';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import OrderReview from '@/components/checkout/OrderReview';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';

function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const cartItems = useAppSelector((state) => state.cart.items);
  const currentStep = useAppSelector((state) => state.checkout.currentStep);
  const shippingAddress = useAppSelector((state) => state.checkout.shippingAddress);
  const paymentDetails = useAppSelector((state) => state.checkout.paymentDetails);
  const orderNotes = useAppSelector((state) => state.checkout.orderNotes);
  const couponCode = useAppSelector((state) => state.checkout.couponCode);
  const savedAddresses = useAppSelector((state) => state.checkout.savedAddresses);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      router.push('/cart');
    }
  }, [cartItems.length, router]);

  const handleShippingSubmit = (data: ShippingAddress) => {
    dispatch(setShippingAddress(data));
    dispatch(nextStep());
    toast.success('Shipping address saved');
  };

  const handlePaymentSubmit = (data: PaymentDetails) => {
    dispatch(setPaymentDetails(data));
    dispatch(nextStep());
    toast.success('Payment method selected');
  };

  const handleNotesChange = (notes: string) => {
    dispatch(setOrderNotes(notes));
  };

  const handlePlaceOrder = async () => {
    try {
      // In a real app, you would:
      // 1. Call your backend API to create the order
      // 2. Process payment if not COD
      // 3. Get order confirmation
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Generate order ID
      const orderId = `ORD-${Date.now()}`;
      
      // Clear cart and reset checkout
      dispatch(clearCart());
      dispatch(resetCheckout());
      
      // Redirect to success page
      router.push(`/order-success?orderId=${orderId}`);
      
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Order placement failed:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const handleEditShipping = () => {
    if (shippingAddress) {
      dispatch(setShippingAddress(shippingAddress));
    }
    // Go back to step 1
    while (currentStep > 1) {
      dispatch(previousStep());
    }
  };

  const handleEditPayment = () => {
    if (paymentDetails) {
      dispatch(setPaymentDetails(paymentDetails));
    }
    // Go back to step 2
    while (currentStep > 2) {
      dispatch(previousStep());
    }
  };

  const handleBackToCart = () => {
    router.push('/cart');
  };

  const handleBackFromPayment = () => {
    dispatch(previousStep());
  };

  const handleBackFromReview = () => {
    dispatch(previousStep());
  };

  // Don't render if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to proceed to checkout</p>
          <Link
            href="/products"
            className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center space-x-2 text-sm">
          <Link href="/" className="text-gray-600 hover:text-pink-500">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/cart" className="text-gray-600 hover:text-pink-500">
            Cart
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase in {3 - currentStep + 1} more step{3 - currentStep + 1 !== 1 ? 's' : ''}</p>
        </div>

        {/* Checkout Steps Progress */}
        <div className="mb-8">
          <CheckoutSteps currentStep={currentStep} />
        </div>

        {/* Checkout Forms */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {currentStep === 1 && (
            <ShippingForm
              initialData={shippingAddress}
              savedAddresses={savedAddresses}
              onSubmit={handleShippingSubmit}
              onBack={handleBackToCart}
            />
          )}

          {currentStep === 2 && (
            <PaymentForm
              initialData={paymentDetails}
              onSubmit={handlePaymentSubmit}
              onBack={handleBackFromPayment}
            />
          )}

          {currentStep === 3 && (
            <OrderReview
              cartItems={cartItems}
              shippingAddress={shippingAddress}
              paymentDetails={paymentDetails}
              orderNotes={orderNotes}
              couponCode={couponCode}
              onEditShipping={handleEditShipping}
              onEditPayment={handleEditPayment}
              onNotesChange={handleNotesChange}
              onPlaceOrder={handlePlaceOrder}
              onBack={handleBackFromReview}
            />
          )}
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>🔒 Your payment information is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
}

// Export with Protected Route
export default function ProtectedCheckoutPage() {
  return (
    <ProtectedRoute requireAuth>
      <CheckoutPage />
    </ProtectedRoute>
  );
}
