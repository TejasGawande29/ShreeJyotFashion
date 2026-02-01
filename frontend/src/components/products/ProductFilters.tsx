'use client';

import React, { useState } from 'react';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { RangeSlider } from '../common/RangeSlider';

export interface FilterState {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  type: 'all' | 'sale' | 'rental';
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen?: boolean;
  onClose?: () => void;
  activeCount?: number;
  className?: string;
}

interface ColorOption {
  name: string;
  hex: string;
}

const categoryOptions = [
  { value: 'men', label: "Men's Clothing" },
  { value: 'women', label: "Women's Clothing" },
  { value: 'kids', label: "Kids' Clothing" },
];

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2-3Y', '4-5Y', '6-7Y', '8-9Y'];

const colorOptions: ColorOption[] = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Yellow', hex: '#F59E0B' },
];

const PRICE_MIN = 0;
const PRICE_MAX = 10000;

export function ProductFilters({
  filters,
  onFiltersChange,
  isOpen = true,
  onClose,
  activeCount = 0,
  className = '',
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    size: true,
    color: true,
    type: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    onFiltersChange({ ...filters, categories: newCategories });
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

  const handlePriceChange = (value: [number, number]) => {
    onFiltersChange({
      ...filters,
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  const handleTypeChange = (type: 'all' | 'sale' | 'rental') => {
    onFiltersChange({ ...filters, type });
  };

  const handleClearAll = () => {
    onFiltersChange({
      categories: [],
      minPrice: PRICE_MIN,
      maxPrice: PRICE_MAX,
      sizes: [],
      colors: [],
      type: 'all',
    });
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  const FilterSection = ({
    title,
    section,
    children,
  }: {
    title: string;
    section: keyof typeof expandedSections;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-neutral-200 pb-6">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full mb-4 text-left"
        aria-expanded={expandedSections[section]}
      >
        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
          {title}
        </h3>
        {expandedSections[section] ? (
          <FiChevronUp className="w-4 h-4 text-neutral-500" />
        ) : (
          <FiChevronDown className="w-4 h-4 text-neutral-500" />
        )}
      </button>
      {expandedSections[section] && <div className="space-y-3">{children}</div>}
    </div>
  );

  return (
    <div
      className={`${
        isOpen ? 'block' : 'hidden lg:block'
      } bg-white ${className}`}
    >
      {/* Mobile Header */}
      {onClose && (
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Filters</h2>
            {activeCount > 0 && (
              <p className="text-sm text-neutral-600">{activeCount} active</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors"
            aria-label="Close filters"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Filter Content */}
      <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] lg:max-h-none overflow-y-auto">
        {/* Category Filter */}
        <FilterSection title="Category" section="category">
          {categoryOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(option.value)}
                onChange={() => handleCategoryToggle(option.value)}
                className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-2 focus:ring-primary cursor-pointer"
              />
              <span className="text-sm text-neutral-700 group-hover:text-primary transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </FilterSection>

        {/* Price Range Filter */}
        <FilterSection title="Price Range" section="price">
          <RangeSlider
            min={PRICE_MIN}
            max={PRICE_MAX}
            value={[filters.minPrice, filters.maxPrice]}
            onChange={handlePriceChange}
            step={100}
            formatLabel={formatPrice}
          />
        </FilterSection>

        {/* Size Filter */}
        <FilterSection title="Size" section="size">
          <div className="grid grid-cols-4 gap-2">
            {sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
                  filters.sizes.includes(size)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:border-primary'
                }`}
                aria-pressed={filters.sizes.includes(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Color Filter */}
        <FilterSection title="Color" section="color">
          <div className="grid grid-cols-4 gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorToggle(color.name)}
                className={`relative group`}
                aria-label={color.name}
                aria-pressed={filters.colors.includes(color.name)}
                title={color.name}
              >
                <div
                  className={`w-10 h-10 rounded-full transition-all ${
                    filters.colors.includes(color.name)
                      ? 'ring-2 ring-primary ring-offset-2'
                      : 'ring-1 ring-neutral-300 hover:ring-2 hover:ring-neutral-400'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {/* Checkmark for selected colors */}
                  {filters.colors.includes(color.name) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className={`w-5 h-5 ${
                          color.hex === '#FFFFFF' || color.hex === '#F59E0B'
                            ? 'text-neutral-900'
                            : 'text-white'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Type Filter (Sale/Rental) */}
        <FilterSection title="Product Type" section="type">
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="type"
                value="all"
                checked={filters.type === 'all'}
                onChange={() => handleTypeChange('all')}
                className="w-4 h-4 text-primary border-neutral-300 focus:ring-2 focus:ring-primary cursor-pointer"
              />
              <span className="text-sm text-neutral-700 group-hover:text-primary transition-colors">
                All Products
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="type"
                value="sale"
                checked={filters.type === 'sale'}
                onChange={() => handleTypeChange('sale')}
                className="w-4 h-4 text-primary border-neutral-300 focus:ring-2 focus:ring-primary cursor-pointer"
              />
              <span className="text-sm text-neutral-700 group-hover:text-primary transition-colors">
                For Sale
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="type"
                value="rental"
                checked={filters.type === 'rental'}
                onChange={() => handleTypeChange('rental')}
                className="w-4 h-4 text-primary border-neutral-300 focus:ring-2 focus:ring-primary cursor-pointer"
              />
              <span className="text-sm text-neutral-700 group-hover:text-primary transition-colors flex items-center gap-2">
                For Rent
                <span className="px-2 py-0.5 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                  Unique
                </span>
              </span>
            </label>
          </div>
        </FilterSection>
      </div>

      {/* Clear All Button */}
      {activeCount > 0 && (
        <div className="p-4 border-t border-neutral-200">
          <button
            onClick={handleClearAll}
            className="w-full px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Clear All Filters ({activeCount})
          </button>
        </div>
      )}
    </div>
  );
}
