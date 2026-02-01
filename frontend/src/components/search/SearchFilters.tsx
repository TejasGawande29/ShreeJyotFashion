'use client';

import { useState } from 'react';
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export interface SearchFilters {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  sizes: string[];
  colors: string[];
  availability: 'all' | 'in-stock' | 'rental-available';
  rating: number;
}

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearAll: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const categories = [
  'All Categories',
  'Dresses',
  'Sarees',
  'Tops',
  'Bottoms',
  'Outerwear',
  'Footwear',
  'Bags',
  'Jewelry',
  'Accessories',
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Yellow', hex: '#F59E0B' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Brown', hex: '#92400E' },
  { name: 'Gray', hex: '#6B7280' },
];

export default function SearchFiltersComponent({
  filters,
  onFiltersChange,
  onClearAll,
  isMobile = false,
  onClose,
}: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    size: true,
    color: true,
    availability: true,
    rating: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleCategoryToggle = (category: string) => {
    if (category === 'All Categories') {
      onFiltersChange({ ...filters, categories: [] });
    } else {
      const newCategories = filters.categories.includes(category)
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category];
      onFiltersChange({ ...filters, categories: newCategories });
    }
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFiltersChange({ ...filters, sizes: newSizes });
  };

  const handleColorToggle = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFiltersChange({ ...filters, colors: newColors });
  };

  const handlePriceChange = (min: number, max: number) => {
    onFiltersChange({ ...filters, priceRange: { min, max } });
  };

  const activeFiltersCount =
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.priceRange.min > 0 || filters.priceRange.max < 10000 ? 1 : 0) +
    (filters.availability !== 'all' ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0);

  return (
    <div className={`bg-white ${isMobile ? 'h-full' : 'rounded-lg border border-gray-200'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiFilter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-pink-100 text-pink-600 text-xs font-semibold px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-sm text-pink-600 hover:text-pink-700 font-medium"
            >
              Clear All
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className={`${isMobile ? 'h-[calc(100%-4rem)] overflow-y-auto' : ''}`}>
        {/* Category */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('category')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Category</span>
            {expandedSections.category ? (
              <FiChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections.category && (
            <div className="px-4 pb-4 space-y-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={
                      category === 'All Categories'
                        ? filters.categories.length === 0
                        : filters.categories.includes(category)
                    }
                    onChange={() => handleCategoryToggle(category)}
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('price')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Price Range</span>
            {expandedSections.price ? (
              <FiChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections.price && (
            <div className="px-4 pb-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Min</label>
                  <input
                    type="number"
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange.max)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="pt-6 text-gray-400">-</div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Max</label>
                  <input
                    type="number"
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceChange(filters.priceRange.min, Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                    placeholder="10000"
                  />
                </div>
              </div>
              <div className="space-y-1">
                {[
                  { label: 'Under ₹500', min: 0, max: 500 },
                  { label: '₹500 - ₹1,000', min: 500, max: 1000 },
                  { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
                  { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
                  { label: 'Over ₹5,000', min: 5000, max: 10000 },
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() => handlePriceChange(range.min, range.max)}
                    className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Size */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('size')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Size</span>
            {expandedSections.size ? (
              <FiChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections.size && (
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                      filters.sizes.includes(size)
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-pink-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Color */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('color')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Color</span>
            {expandedSections.color ? (
              <FiChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections.color && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-5 gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorToggle(color.name)}
                    className="flex flex-col items-center gap-1 group"
                    title={color.name}
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        filters.colors.includes(color.name)
                          ? 'border-pink-600 ring-2 ring-pink-200'
                          : 'border-gray-300 group-hover:border-pink-300'
                      } ${color.hex === '#FFFFFF' ? 'shadow-sm' : ''}`}
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <span className="text-xs text-gray-600 text-center">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('availability')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Availability</span>
            {expandedSections.availability ? (
              <FiChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections.availability && (
            <div className="px-4 pb-4 space-y-2">
              {[
                { label: 'All Products', value: 'all' as const },
                { label: 'In Stock', value: 'in-stock' as const },
                { label: 'Available for Rent', value: 'rental-available' as const },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                >
                  <input
                    type="radio"
                    name="availability"
                    checked={filters.availability === option.value}
                    onChange={() => onFiltersChange({ ...filters, availability: option.value })}
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Rating */}
        <div>
          <button
            onClick={() => toggleSection('rating')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Customer Rating</span>
            {expandedSections.rating ? (
              <FiChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections.rating && (
            <div className="px-4 pb-4 space-y-2">
              {[4, 3, 2, 1, 0].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => onFiltersChange({ ...filters, rating })}
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300 cursor-pointer"
                  />
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    {rating === 0 ? (
                      <span>All Ratings</span>
                    ) : (
                      <>
                        <span>{rating}★</span>
                        <span className="text-gray-500">& above</span>
                      </>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
