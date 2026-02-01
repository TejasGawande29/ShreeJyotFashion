'use client';

import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

export type ReviewSortOption = 'recent' | 'helpful' | 'highest' | 'lowest';

export interface ReviewSortProps {
  /** Currently selected sort option */
  selectedSort: ReviewSortOption;
  /** Callback when sort changes */
  onSortChange: (sort: ReviewSortOption) => void;
  /** Custom className */
  className?: string;
}

export function ReviewSort({
  selectedSort,
  onSortChange,
  className = '',
}: ReviewSortProps) {
  const sortOptions: Array<{ id: ReviewSortOption; label: string }> = [
    { id: 'recent', label: 'Most Recent' },
    { id: 'helpful', label: 'Most Helpful' },
    { id: 'highest', label: 'Highest Rating' },
    { id: 'lowest', label: 'Lowest Rating' },
  ];

  const selectedOption = sortOptions.find((opt) => opt.id === selectedSort);

  return (
    <div className={`review-sort ${className}`}>
      <div className="relative inline-block">
        <label htmlFor="review-sort" className="sr-only">
          Sort reviews
        </label>
        <select
          id="review-sort"
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value as ReviewSortOption)}
          className="
            appearance-none bg-white border-2 border-gray-300 rounded-lg
            pl-4 pr-10 py-2 text-sm font-medium text-gray-700
            hover:border-primary-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-opacity-20
            cursor-pointer transition-colors
          "
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <FiChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
}
