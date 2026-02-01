'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector } from '@/lib/redux/hooks';
import AccountLayout from '@/components/account/AccountLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { FiPackage, FiTruck, FiCheck, FiX, FiClock, FiChevronRight, FiFilter } from 'react-icons/fi';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-2025-001',
    date: '2025-10-15',
    status: 'delivered',
    items: 3,
    total: 2499,
    products: [
      { name: 'Floral Summer Dress', price: 899, quantity: 1, image: '/images/products/dress1.jpg' },
      { name: 'Casual White Sneakers', price: 1200, quantity: 1, image: '/images/products/shoes1.jpg' },
      { name: 'Leather Handbag', price: 400, quantity: 1, image: '/images/products/bag1.jpg' },
    ],
  },
  {
    id: 'ORD-2025-002',
    date: '2025-10-18',
    status: 'processing',
    items: 2,
    total: 1799,
    products: [
      { name: 'Designer Saree', price: 1499, quantity: 1, image: '/images/products/saree1.jpg' },
      { name: 'Gold Plated Necklace', price: 300, quantity: 1, image: '/images/products/jewelry1.jpg' },
    ],
  },
  {
    id: 'ORD-2025-003',
    date: '2025-10-10',
    status: 'shipped',
    items: 1,
    total: 1299,
    products: [
      { name: 'Winter Coat', price: 1299, quantity: 1, image: '/images/products/coat1.jpg' },
    ],
  },
  {
    id: 'ORD-2025-004',
    date: '2025-10-05',
    status: 'cancelled',
    items: 2,
    total: 999,
    products: [
      { name: 'Cotton T-Shirt', price: 499, quantity: 1, image: '/images/products/tshirt1.jpg' },
      { name: 'Denim Jeans', price: 500, quantity: 1, image: '/images/products/jeans1.jpg' },
    ],
  },
  {
    id: 'ORD-2025-005',
    date: '2025-09-28',
    status: 'delivered',
    items: 4,
    total: 3199,
    products: [
      { name: 'Party Dress', price: 1299, quantity: 1, image: '/images/products/dress2.jpg' },
      { name: 'Heels', price: 900, quantity: 1, image: '/images/products/heels1.jpg' },
      { name: 'Clutch', price: 600, quantity: 1, image: '/images/products/clutch1.jpg' },
      { name: 'Earrings', price: 400, quantity: 1, image: '/images/products/earrings1.jpg' },
    ],
  },
  {
    id: 'ORD-2025-006',
    date: '2025-09-20',
    status: 'delivered',
    items: 1,
    total: 699,
    products: [
      { name: 'Casual Shirt', price: 699, quantity: 1, image: '/images/products/shirt1.jpg' },
    ],
  },
];

type OrderStatus = 'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/account/orders');
    }
  }, [isAuthenticated, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <FiClock className="w-5 h-5" />;
      case 'shipped':
        return <FiTruck className="w-5 h-5" />;
      case 'delivered':
        return <FiCheck className="w-5 h-5" />;
      case 'cancelled':
        return <FiX className="w-5 h-5" />;
      default:
        return <FiPackage className="w-5 h-5" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter orders by status
  const filteredOrders = selectedStatus === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === selectedStatus);

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'amount-desc':
        return b.total - a.total;
      case 'amount-asc':
        return a.total - b.total;
      default:
        return 0;
    }
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <AccountLayout>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">Track and manage your orders</p>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          {/* Status Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FiFilter className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Filter by Status</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['all', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedStatus === status
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== 'all' && (
                    <span className="ml-2 text-xs opacity-75">
                      ({mockOrders.filter(o => o.status === status).length})
                    </span>
                  )}
                  {status === 'all' && (
                    <span className="ml-2 text-xs opacity-75">({mockOrders.length})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="p-6">
          {sortedOrders.length === 0 ? (
            <div className="text-center py-12">
              <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">
                {selectedStatus === 'all' 
                  ? "You haven't placed any orders yet" 
                  : `No ${selectedStatus} orders found`}
              </p>
              <Link
                href="/products"
                className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusStyles(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <FiPackage className="w-4 h-4" />
                    <span>{order.items} {order.items === 1 ? 'item' : 'items'}</span>
                    <span className="mx-2">•</span>
                    <span className="font-semibold text-gray-900">₹{order.total.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium text-sm transition-colors"
                  >
                    View Details
                    <FiChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Order Count */}
          {sortedOrders.length > 0 && (
            <div className="mt-6 text-center text-sm text-gray-600">
              Showing {sortedOrders.length} {sortedOrders.length === 1 ? 'order' : 'orders'}
            </div>
          )}
        </div>
      </div>
    </AccountLayout>
  );
}

// Export with Protected Route
export default function ProtectedOrdersPage() {
  return (
    <ProtectedRoute requireAuth>
      <OrdersPage />
    </ProtectedRoute>
  );
}
