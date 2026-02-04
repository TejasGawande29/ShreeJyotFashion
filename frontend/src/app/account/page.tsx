'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector } from '@/lib/redux/hooks';
import AccountLayout from '@/components/account/AccountLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import api from '@/lib/api';
import { 
  FiShoppingBag, 
  FiPackage, 
  FiCalendar, 
  FiHeart,
  FiMapPin,
  FiStar,
  FiTruck,
  FiClock,
  FiCheckCircle,
  FiArrowRight
} from 'react-icons/fi';

function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const myRentals = useAppSelector((state) => state.rental.myRentals);
  
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalAddresses, setTotalAddresses] = useState(0);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/account');
    }
  }, [isAuthenticated, router]);

  // Fetch user data
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersRes = await api.get('/orders/my-orders?limit=2');
      setRecentOrders(ordersRes.data.orders || []);
      setTotalOrders(ordersRes.data.total || 0);

      // Fetch addresses
      try {
        const addressRes = await api.get('/user-profile/addresses');
        setTotalAddresses(addressRes.data.length || 0);
      } catch (err) {
        // Addresses endpoint might not exist, set to 0
        setTotalAddresses(0);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setRecentOrders([]);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Orders',
      value: totalOrders.toString(),
      icon: FiShoppingBag,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Active Rentals',
      value: myRentals.active.length.toString(),
      icon: FiCalendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      label: 'Wishlist Items',
      value: wishlistItems.length.toString(),
      icon: FiHeart,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
    },
    {
      label: 'Saved Addresses',
      value: totalAddresses.toString(),
      icon: FiMapPin,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
  ];

  const quickActions = [
    {
      title: 'Track Order',
      description: 'Check your order status',
      icon: FiTruck,
      href: '/account/orders',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'My Rentals',
      description: 'Manage your rentals',
      icon: FiCalendar,
      href: '/my-rentals',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Edit Profile',
      description: 'Update your information',
      icon: FiStar,
      href: '/account/profile',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Addresses',
      description: 'Manage addresses',
      icon: FiMapPin,
      href: '/account/addresses',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <FiCheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing':
        return <FiClock className="w-5 h-5 text-yellow-600" />;
      case 'shipped':
        return <FiTruck className="w-5 h-5 text-blue-600" />;
      default:
        return <FiPackage className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AccountLayout>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-8 text-white mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
        </h1>
        <p className="text-white/90">
          Manage your orders, rentals, and account settings all in one place
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-pink-300 transition-all group"
              >
                <div className={`p-3 rounded-lg ${action.bgColor} inline-block mb-3`}>
                  <Icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="text-sm font-medium text-pink-600 hover:text-pink-700 flex items-center gap-1 group"
          >
            View All
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading orders...</p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <FiShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No orders yet</p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Order Icon */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <FiPackage className="w-8 h-8 text-gray-600" />
                </div>

                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    ₹{order.total_amount?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-gray-500">
                    Ordered on {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {/* Action */}
                <Link
                  href={`/account/orders`}
                  className="flex-shrink-0 px-4 py-2 text-sm font-medium text-pink-600 hover:text-pink-700 border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}

// Export with Protected Route
export default function ProtectedAccountPage() {
  return (
    <ProtectedRoute requireAuth>
      <AccountPage />
    </ProtectedRoute>
  );
}
