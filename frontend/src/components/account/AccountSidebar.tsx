'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import { 
  FiUser, 
  FiShoppingBag, 
  FiMapPin, 
  FiStar, 
  FiSettings,
  FiCalendar,
  FiHeart
} from 'react-icons/fi';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export default function AccountSidebar() {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const myRentals = useAppSelector((state) => state.rental.myRentals);

  const navigation: NavItem[] = [
    { 
      name: 'Dashboard', 
      href: '/account', 
      icon: FiUser 
    },
    { 
      name: 'My Orders', 
      href: '/account/orders', 
      icon: FiShoppingBag 
    },
    { 
      name: 'My Rentals', 
      href: '/my-rentals', 
      icon: FiCalendar,
      badge: myRentals.active.length
    },
    { 
      name: 'Addresses', 
      href: '/account/addresses', 
      icon: FiMapPin 
    },
    { 
      name: 'Wishlist', 
      href: '/wishlist', 
      icon: FiHeart,
      badge: wishlistItems.length
    },
    { 
      name: 'My Reviews', 
      href: '/account/reviews', 
      icon: FiStar 
    },
    { 
      name: 'Settings', 
      href: '/account/settings', 
      icon: FiSettings 
    },
  ];

  const isActive = (href: string) => {
    if (href === '/account') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside className="w-full lg:w-64 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* User Profile Header */}
      <div className="p-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur-sm border-2 border-white/30">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          
          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">
              {user?.name || 'User'}
            </h2>
            <p className="text-sm text-white/80 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                active
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${
                active ? 'text-white' : 'text-gray-500 group-hover:text-pink-600'
              }`} />
              
              <span className="flex-1 font-medium">{item.name}</span>
              
              {/* Badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  active
                    ? 'bg-white text-pink-600'
                    : 'bg-pink-100 text-pink-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Help Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-1">
            Need Help?
          </h3>
          <p className="text-xs text-blue-700 mb-3">
            Contact our support team for assistance
          </p>
          <Link
            href="/contact"
            className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </aside>
  );
}
