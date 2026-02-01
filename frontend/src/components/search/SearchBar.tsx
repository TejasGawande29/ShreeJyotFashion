'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiSearch, FiX, FiClock, FiTrendingUp } from 'react-icons/fi';

// Mock search suggestions data
const mockProducts = [
  { id: '1', name: 'Floral Summer Dress', category: 'Dresses', image: '/images/products/dress1.jpg' },
  { id: '2', name: 'Casual White Sneakers', category: 'Footwear', image: '/images/products/shoes1.jpg' },
  { id: '3', name: 'Designer Saree', category: 'Sarees', image: '/images/products/saree1.jpg' },
  { id: '4', name: 'Leather Handbag', category: 'Bags', image: '/images/products/bag1.jpg' },
  { id: '5', name: 'Winter Coat', category: 'Outerwear', image: '/images/products/coat1.jpg' },
  { id: '6', name: 'Party Dress', category: 'Dresses', image: '/images/products/dress2.jpg' },
  { id: '7', name: 'Denim Jeans', category: 'Bottoms', image: '/images/products/jeans1.jpg' },
  { id: '8', name: 'Cotton T-Shirt', category: 'Tops', image: '/images/products/tshirt1.jpg' },
  { id: '9', name: 'Gold Plated Necklace', category: 'Jewelry', image: '/images/products/jewelry1.jpg' },
  { id: '10', name: 'Casual Shirt', category: 'Tops', image: '/images/products/shirt1.jpg' },
];

const popularSearches = [
  'Dresses',
  'Sarees',
  'Sneakers',
  'Handbags',
  'Jewelry',
  'Winter Collection',
];

interface SearchBarProps {
  variant?: 'header' | 'mobile' | 'page';
  onClose?: () => void;
  autoFocus?: boolean;
}

export default function SearchBar({ variant = 'header', onClose, autoFocus = false }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof mockProducts>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Auto-focus input
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  const saveRecentSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...recentSearches.filter((s) => s !== trimmed),
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  const handleSearch = (searchQuery: string = query) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    saveRecentSearch(trimmed);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setQuery('');
    setIsOpen(false);
    onClose?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };

  const showDropdown = isOpen && (suggestions.length > 0 || recentSearches.length > 0 || query.length === 0);

  return (
    <div ref={searchRef} className={`relative ${variant === 'mobile' ? 'w-full' : ''}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for products, brands, and more..."
          className={`block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all ${
            variant === 'mobile' ? 'text-base' : 'text-sm'
          }`}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 text-gray-400"
          >
            <FiX className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {/* Product Suggestions */}
          {suggestions.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Products
              </div>
              {suggestions.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={() => {
                    setQuery('');
                    setIsOpen(false);
                    onClose?.();
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiSearch className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Divider */}
          {suggestions.length > 0 && (recentSearches.length > 0 || query.length === 0) && (
            <div className="border-t border-gray-200"></div>
          )}

          {/* Recent Searches */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 flex items-center justify-between">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Recent Searches
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-pink-600 hover:text-pink-700 font-medium"
                >
                  Clear All
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <FiClock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-900 flex-1 truncate">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {query.length === 0 && (
            <>
              {recentSearches.length > 0 && <div className="border-t border-gray-200"></div>}
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Popular Searches
                </div>
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <FiTrendingUp className="w-5 h-5 text-pink-600 flex-shrink-0" />
                    <span className="text-sm text-gray-900 flex-1 truncate">{search}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* View All Results */}
          {suggestions.length > 0 && (
            <>
              <div className="border-t border-gray-200"></div>
              <button
                onClick={() => handleSearch()}
                className="w-full px-4 py-3 text-sm font-medium text-pink-600 hover:bg-pink-50 transition-colors text-center"
              >
                View all results for "{query}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
