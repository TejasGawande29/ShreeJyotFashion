'use client';

import { FiGrid, FiList, FiSliders } from 'react-icons/fi';

export type SortOption = 'popular' | 'price_asc' | 'price_desc' | 'newest' | 'rating';

interface ProductHeaderProps {
  title: string;
  count: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onFilterToggle?: () => void;
  view?: 'grid' | 'list';
  onViewChange?: (view: 'grid' | 'list') => void;
  className?: string;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Top Rated' },
];

export function ProductHeader({
  title,
  count,
  sort,
  onSortChange,
  onFilterToggle,
  view = 'grid',
  onViewChange,
  className = '',
}: ProductHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}>
      {/* Title & Count */}
      <div className="flex items-center gap-3">
        {/* Mobile Filter Toggle */}
        {onFilterToggle && (
          <button
            onClick={onFilterToggle}
            className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            aria-label="Toggle filters"
          >
            <FiSliders className="w-4 h-4" />
            Filters
          </button>
        )}

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
            {title}
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            {count} {count === 1 ? 'product' : 'products'} found
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* View Toggle (Optional) */}
        {onViewChange && (
          <div className="hidden md:flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
            <button
              onClick={() => onViewChange('grid')}
              className={`p-2 rounded-md transition-colors ${
                view === 'grid'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`p-2 rounded-md transition-colors ${
                view === 'list'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              aria-label="List view"
              aria-pressed={view === 'list'}
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Sort Dropdown */}
        <div className="relative">
          <label htmlFor="sort-select" className="sr-only">
            Sort products by
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none pl-4 pr-10 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg cursor-pointer hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
