'use client';

import Link from 'next/link';
import { FiShoppingBag } from 'react-icons/fi';

export function EmptyCart() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 md:p-12 text-center">
      {/* Empty Cart Icon */}
      <div className="inline-flex items-center justify-center w-24 h-24 bg-neutral-100 rounded-full mb-6">
        <FiShoppingBag className="w-12 h-12 text-neutral-400" />
      </div>

      {/* Empty State Message */}
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
        Your Cart is Empty
      </h2>
      <p className="text-neutral-600 mb-8 max-w-md mx-auto">
        Looks like you haven&apos;t added anything to your cart yet. Start shopping and add your favorite items!
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
        >
          Start Shopping
        </Link>
        <Link
          href="/wishlist"
          className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-colors"
        >
          View Wishlist
        </Link>
      </div>

      {/* Suggestions */}
      <div className="mt-12 pt-8 border-t border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Explore Our Collections
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Link
            href="/products?category=men"
            className="p-4 border border-neutral-200 rounded-lg hover:border-primary-600 hover:shadow-sm transition-all"
          >
            <p className="font-semibold text-neutral-900">Men&apos;s Collection</p>
            <p className="text-sm text-neutral-600 mt-1">Explore stylish menswear</p>
          </Link>
          <Link
            href="/products?category=women"
            className="p-4 border border-neutral-200 rounded-lg hover:border-primary-600 hover:shadow-sm transition-all"
          >
            <p className="font-semibold text-neutral-900">Women&apos;s Collection</p>
            <p className="text-sm text-neutral-600 mt-1">Discover latest trends</p>
          </Link>
          <Link
            href="/products?category=kids"
            className="p-4 border border-neutral-200 rounded-lg hover:border-primary-600 hover:shadow-sm transition-all"
          >
            <p className="font-semibold text-neutral-900">Kids&apos; Collection</p>
            <p className="text-sm text-neutral-600 mt-1">Shop for little ones</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
