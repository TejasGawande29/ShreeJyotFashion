'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector } from '@/lib/redux/hooks';
import AccountLayout from '@/components/account/AccountLayout';
import { FiPackage, FiTruck, FiCheck, FiX, FiClock, FiMapPin, FiCreditCard, FiDownload, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

// Mock order data (would come from API in production)
const getOrderById = (id: string) => {
  const orders = [
    {
      id: 'ORD-2025-001',
      date: '2025-10-15',
      status: 'delivered',
      items: 3,
      total: 2499,
      subtotal: 2499,
      shipping: 0,
      tax: 0,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      trackingNumber: 'TRK123456789',
      shippingAddress: {
        name: 'John Doe',
        phone: '9876543210',
        address: '123, MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
      },
      products: [
        {
          id: '1',
          name: 'Floral Summer Dress',
          price: 899,
          quantity: 1,
          image: '/images/products/dress1.jpg',
          size: 'M',
          color: 'Blue',
        },
        {
          id: '2',
          name: 'Casual White Sneakers',
          price: 1200,
          quantity: 1,
          image: '/images/products/shoes1.jpg',
          size: '8',
          color: 'White',
        },
        {
          id: '3',
          name: 'Leather Handbag',
          price: 400,
          quantity: 1,
          image: '/images/products/bag1.jpg',
          size: 'One Size',
          color: 'Brown',
        },
      ],
      timeline: [
        { status: 'placed', date: '2025-10-15T10:00:00', completed: true },
        { status: 'confirmed', date: '2025-10-15T11:30:00', completed: true },
        { status: 'shipped', date: '2025-10-16T09:00:00', completed: true },
        { status: 'delivered', date: '2025-10-18T14:20:00', completed: true },
      ],
    },
    {
      id: 'ORD-2025-002',
      date: '2025-10-18',
      status: 'processing',
      items: 2,
      total: 1799,
      subtotal: 1799,
      shipping: 0,
      tax: 0,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      trackingNumber: null,
      shippingAddress: {
        name: 'John Doe',
        phone: '9876543210',
        address: '123, MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
      },
      products: [
        {
          id: '4',
          name: 'Designer Saree',
          price: 1499,
          quantity: 1,
          image: '/images/products/saree1.jpg',
          size: 'One Size',
          color: 'Red',
        },
        {
          id: '5',
          name: 'Gold Plated Necklace',
          price: 300,
          quantity: 1,
          image: '/images/products/jewelry1.jpg',
          size: 'One Size',
          color: 'Gold',
        },
      ],
      timeline: [
        { status: 'placed', date: '2025-10-18T15:00:00', completed: true },
        { status: 'confirmed', date: '2025-10-18T16:00:00', completed: true },
        { status: 'shipped', date: null, completed: false },
        { status: 'delivered', date: null, completed: false },
      ],
    },
  ];

  return orders.find(order => order.id === id) || null;
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [order, setOrder] = useState<any>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/account/orders/${params.id}`);
    }
  }, [isAuthenticated, router, params.id]);

  // Load order data
  useEffect(() => {
    const orderData = getOrderById(params.id);
    if (orderData) {
      setOrder(orderData);
    } else {
      toast.error('Order not found');
      router.push('/account/orders');
    }
  }, [params.id, router]);

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setIsCancelling(true);

    // Mock API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Order cancelled successfully');
      router.push('/account/orders');
    } catch (error) {
      toast.error('Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDownloadInvoice = () => {
    toast.success('Invoice downloaded!');
    // In production, this would download a PDF
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <FiClock className="w-6 h-6" />;
      case 'confirmed':
        return <FiCheck className="w-6 h-6" />;
      case 'shipped':
        return <FiTruck className="w-6 h-6" />;
      case 'delivered':
        return <FiCheck className="w-6 h-6" />;
      default:
        return <FiPackage className="w-6 h-6" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'placed':
        return 'Order Placed';
      case 'confirmed':
        return 'Order Confirmed';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  if (!isAuthenticated || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{order.id}</h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex gap-3">
              {order.trackingNumber && (
                <button
                  onClick={() => toast(`Tracking: ${order.trackingNumber}`, { icon: '📦' })}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Track Order
                </button>
              )}
              <button
                onClick={handleDownloadInvoice}
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center gap-2"
              >
                <FiDownload className="w-4 h-4" />
                Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>
            
            {/* Timeline Items */}
            <div className="space-y-6">
              {order.timeline.map((item: any, index: number) => (
                <div key={index} className="relative flex items-start gap-4">
                  {/* Icon */}
                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                    item.completed 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {getStatusIcon(item.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <h3 className={`font-semibold ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {getStatusLabel(item.status)}
                    </h3>
                    {item.date && (
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(item.date).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.products.map((product: any) => (
              <div key={product.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <FiPackage className="w-8 h-8" />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <span>Size: {product.size}</span>
                    <span>Color: {product.color}</span>
                    <span>Qty: {product.quantity}</span>
                  </div>
                  <p className="mt-2 font-semibold text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiMapPin className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
            </div>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiCreditCard className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className="font-semibold text-green-600">{order.paymentStatus}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">₹{order.tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900 text-lg">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Order Button */}
        {(order.status === 'processing' || order.status === 'placed') && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <button
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="w-full sm:w-auto px-6 py-3 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCancelling ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                  <span>Cancelling...</span>
                </>
              ) : (
                <>
                  <FiX className="w-5 h-5" />
                  <span>Cancel Order</span>
                </>
              )}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              You can cancel this order within 24 hours of placing it
            </p>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
