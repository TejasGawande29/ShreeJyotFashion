'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/lib/redux/hooks';
import { FiSearch, FiShoppingCart, FiHeart, FiMenu, FiX } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import SearchBar from '@/components/search/SearchBar';
import { UserProfileDropdown } from './UserProfileDropdown';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartItemCount = useAppSelector((state) => state.cart.totalItems);
  const wishlistItemCount = useAppSelector((state) => state.wishlist.totalItems);

  // Navigation items per wireframe
  const mainNavigation = [
    { label: 'Shop', href: '/products' },
    { label: 'Rentals', href: '/rentals', highlight: true }, // Unique feature
    { label: 'Men', href: '/products?category=men' },
    { label: 'Women', href: '/products?category=women' },
    { label: 'Kids', href: '/products?category=kids' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      {/* Top Banner (Optional Promo) */}
      <div className="bg-primary-600 text-white text-center py-2 text-sm">
        <p>🎉 Free Shipping on orders above ₹1000 | Rent Premium Fashion from ₹99/day</p>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-xl">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-xl text-neutral-900">
                Shreejyot
              </h1>
              <p className="text-xs text-neutral-600 -mt-1">Fashion</p>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'font-medium text-neutral-700 hover:text-primary-600 transition-colors relative py-2',
                  item.highlight && 'text-primary-600'
                )}
              >
                {item.label}
                {item.highlight && (
                  <span className="absolute -top-1 -right-3 px-1.5 py-0.5 text-[10px] font-bold bg-secondary-400 text-neutral-900 rounded">
                    NEW
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Search Icon (Desktop) */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5 text-neutral-700" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-100 transition-colors relative"
              aria-label="Wishlist"
            >
              <FiHeart className="w-5 h-5 text-neutral-700" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlistItemCount > 9 ? '9+' : wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Cart with Count */}
            <Link
              href="/cart"
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-100 transition-colors relative"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <FiShoppingCart className="w-5 h-5 text-neutral-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* User Account with Dropdown */}
            <div className="hidden sm:block">
              <UserProfileDropdown />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6 text-neutral-700" />
              ) : (
                <FiMenu className="w-6 h-6 text-neutral-700" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar (Desktop - Expandable) */}
        {isSearchOpen && (
          <div className="hidden md:block pb-4 animate-slide-down">
            <div className="relative max-w-2xl mx-auto">
              <SearchBar variant="header" autoFocus onClose={() => setIsSearchOpen(false)} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 animate-slide-down">
          <div className="container py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <SearchBar variant="mobile" onClose={() => setIsMobileMenuOpen(false)} />
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-2">
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-3 rounded-lg font-medium text-neutral-700 hover:bg-neutral-100 transition-colors flex items-center justify-between',
                    item.highlight && 'bg-primary-50 text-primary-600'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                  {item.highlight && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-secondary-400 text-neutral-900 rounded">
                      NEW
                    </span>
                  )}
                </Link>
              ))}

              {/* Mobile User Links */}
              <UserProfileDropdown isMobile onNavigate={() => setIsMobileMenuOpen(false)} />
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
