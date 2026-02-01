'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { removeFromWishlist, clearWishlist } from '@/lib/redux/slices/wishlistSlice';
import { addToCart } from '@/lib/redux/slices/cartSlice';
import { EmptyWishlist } from '@/components/wishlist/EmptyWishlist';
import { WishlistItem } from '@/components/wishlist/WishlistItem';
import { Button } from '@/components/common/Button';
import { Breadcrumb, type BreadcrumbItem } from '@/components/common/Breadcrumb';
import { toast, toastMessages } from '@/utils/toast';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Breadcrumb
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Wishlist', href: '/wishlist' },
  ];

  // Handler: Remove from wishlist
  const handleRemove = (itemId: string, itemName: string) => {
    dispatch(removeFromWishlist(itemId));
    toast.success(toastMessages.wishlist.removeSuccess);
  };

  // Handler: Move to cart
  const handleMoveToCart = (item: any) => {
    // Add to cart
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      type: item.type,
      rentalPrice: item.rentalPrice,
    }));

    // Remove from wishlist
    dispatch(removeFromWishlist(item.id));
    
    toast.success(toastMessages.wishlist.movedToCart);
  };

  // Handler: Clear wishlist
  const handleClearWishlist = () => {
    dispatch(clearWishlist());
    setShowClearConfirm(false);
    toast.success(toastMessages.wishlist.clearSuccess);
  };

  // Empty state
  if (wishlistItems.length === 0) {
    return (
      <>
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <EmptyWishlist />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-playfair">
              My Wishlist
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          {/* Clear Wishlist Button */}
          <div className="mt-4 sm:mt-0">
            {!showClearConfirm ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearConfirm(true)}
                leftIcon={<FiTrash2 />}
              >
                Clear Wishlist
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 mr-2">Are you sure?</span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleClearWishlist}
                >
                  Yes, Clear
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <WishlistItem
              key={item.id}
              item={item}
              onRemove={handleRemove}
              onMoveToCart={handleMoveToCart}
            />
          ))}
        </div>

        {/* Action Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Ready to shop?
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Move items to your cart or continue browsing
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
              <Link href="/products">
                <Button variant="outline" size="md" fullWidth>
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/cart">
                <Button 
                  variant="primary" 
                  size="md"
                  fullWidth
                  leftIcon={<FiShoppingCart />}
                >
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Save for Later</h4>
                <p className="text-xs text-gray-600 mt-1">Items stay saved until you're ready</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Price Alerts</h4>
                <p className="text-xs text-gray-600 mt-1">Get notified when prices drop</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Share Wishlist</h4>
                <p className="text-xs text-gray-600 mt-1">Share with friends and family</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
