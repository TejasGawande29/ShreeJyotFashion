import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';

export function EmptyWishlist() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-4">
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                <FiHeart className="w-16 h-16 text-primary-600" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                <span className="text-2xl">💝</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-3">
            Your Wishlist is Empty
          </h2>
          
          {/* Description */}
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            Save your favorite items here and never lose track of what you love. 
            Start adding products to your wishlist!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link href="/products">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<FiShoppingBag />}
                fullWidth
              >
                Start Shopping
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                fullWidth
              >
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Save Favorites</h4>
                  <p className="text-xs text-gray-600">Keep track of items you love</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Price Alerts</h4>
                  <p className="text-xs text-gray-600">Get notified on price drops</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Easy Shopping</h4>
                  <p className="text-xs text-gray-600">Move items to cart instantly</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Explore Popular Categories
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/products?category=Men">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">👔</div>
                <p className="text-sm font-medium text-gray-900">Men</p>
              </div>
            </Link>
            <Link href="/products?category=Women">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">👗</div>
                <p className="text-sm font-medium text-gray-900">Women</p>
              </div>
            </Link>
            <Link href="/products?category=Kids">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">👶</div>
                <p className="text-sm font-medium text-gray-900">Kids</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
