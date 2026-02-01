'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { logoutUser } from '@/lib/redux/slices/authSlice';
import { FiUser, FiShoppingBag, FiCalendar, FiSettings, FiLogOut, FiHeart, FiMapPin, FiCreditCard, FiChevronDown } from 'react-icons/fi';
import { toast, toastMessages } from '@/utils/toast';

interface UserProfileDropdownProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

export function UserProfileDropdown({ isMobile = false, onNavigate }: UserProfileDropdownProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success(toastMessages.auth.logoutSuccess);
      setIsOpen(false);
      onNavigate?.();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    onNavigate?.();
    router.push(href);
  };

  // Mobile version - renders as list items
  if (isMobile) {
    if (!isAuthenticated) {
      return (
        <div className="border-t border-neutral-200 mt-2 pt-2 space-y-1">
          <Link
            href="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
            onClick={onNavigate}
          >
            <FiUser className="w-5 h-5" />
            <span>Login</span>
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
            onClick={onNavigate}
          >
            <FiUser className="w-5 h-5" />
            <span>Sign Up</span>
          </Link>
        </div>
      );
    }

    // Logged in - mobile menu
    return (
      <div className="border-t border-neutral-200 mt-2 pt-2">
        {/* User Info */}
        <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg mb-2">
          <p className="text-sm font-medium text-neutral-900">{user?.name || 'User'}</p>
          <p className="text-xs text-neutral-600">{user?.email}</p>
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          <button
            onClick={() => handleNavigation('/account')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <FiUser className="w-4 h-4" />
            <span>My Profile</span>
          </button>
          <button
            onClick={() => handleNavigation('/account/orders')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <FiShoppingBag className="w-4 h-4" />
            <span>My Orders</span>
          </button>
          <button
            onClick={() => handleNavigation('/my-rentals')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <FiCalendar className="w-4 h-4" />
            <span>My Rentals</span>
          </button>
          <button
            onClick={() => handleNavigation('/wishlist')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <FiHeart className="w-4 h-4" />
            <span>Wishlist</span>
          </button>
          <button
            onClick={() => handleNavigation('/account/addresses')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <FiMapPin className="w-4 h-4" />
            <span>Addresses</span>
          </button>
          <button
            onClick={() => handleNavigation('/account/settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <FiSettings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-neutral-200 mt-2"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }

  // Desktop version - renders as dropdown
  if (!isAuthenticated) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <FiUser className="w-5 h-5 text-neutral-700" />
          <span className="hidden xl:block text-sm font-medium text-neutral-700">Account</span>
          <FiChevronDown className={`hidden xl:block w-4 h-4 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Not Logged In Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 z-50 animate-fade-in">
            <div className="p-4 border-b border-neutral-200">
              <p className="text-sm font-medium text-neutral-900 mb-1">Welcome to Shreejyot Fashion</p>
              <p className="text-xs text-neutral-600">Login to access your account</p>
            </div>
            
            <div className="p-3 space-y-2">
              <Link
                href="/login"
                className="block w-full px-4 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all font-medium text-sm"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block w-full px-4 py-2.5 border-2 border-primary-600 text-primary-600 text-center rounded-lg hover:bg-primary-50 transition-all font-medium text-sm"
                onClick={() => setIsOpen(false)}
              >
                Create Account
              </Link>
            </div>

            <div className="px-3 pb-3 space-y-1 border-t border-neutral-200 pt-2">
              <Link
                href="/orders/track"
                className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                📦 Track Order
              </Link>
              <Link
                href="/help"
                className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                ❓ Help Center
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Logged In - Desktop Dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="hidden xl:block text-left">
          <p className="text-xs text-neutral-600">Hello,</p>
          <p className="text-sm font-medium text-neutral-900 -mt-0.5">
            {user?.name?.split(' ')[0] || 'User'}
          </p>
        </div>
        <FiChevronDown className={`hidden xl:block w-4 h-4 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Logged In Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-neutral-200 z-50 animate-fade-in">
          {/* User Info Section */}
          <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-t-lg border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-neutral-900 truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-neutral-600 truncate">{user?.email}</p>
                {user?.phone && (
                  <p className="text-xs text-neutral-500">{user.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={() => handleNavigation('/account')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <FiUser className="w-4 h-4 text-neutral-500" />
              <span>My Profile</span>
            </button>
            <button
              onClick={() => handleNavigation('/account/orders')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <FiShoppingBag className="w-4 h-4 text-neutral-500" />
              <span>My Orders</span>
            </button>
            <button
              onClick={() => handleNavigation('/my-rentals')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <FiCalendar className="w-4 h-4 text-neutral-500" />
              <span>My Rentals</span>
            </button>
            <button
              onClick={() => handleNavigation('/wishlist')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <FiHeart className="w-4 h-4 text-neutral-500" />
              <span>Wishlist</span>
            </button>
            <button
              onClick={() => handleNavigation('/account/addresses')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <FiMapPin className="w-4 h-4 text-neutral-500" />
              <span>My Addresses</span>
            </button>
            <button
              onClick={() => handleNavigation('/account/settings')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <FiSettings className="w-4 h-4 text-neutral-500" />
              <span>Account Settings</span>
            </button>
          </div>

          {/* Logout Button */}
          <div className="border-t border-neutral-200 p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
