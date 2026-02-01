'use client';

import React from 'react';
import { FiStar } from 'react-icons/fi';

export interface ReviewFiltersProps {
  /** Currently selected filter */
  selectedFilter: 'all' | 5 | 4 | 3 | 2 | 1;
  /** Review counts for each rating */
  counts: {
    all: number;
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  /** Callback when filter changes */
  onFilterChange: (filter: 'all' | 5 | 4 | 3 | 2 | 1) => void;
  /** Custom className */
  className?: string;
}

export function ReviewFilters({
  selectedFilter,
  counts,
  onFilterChange,
  className = '',
}: ReviewFiltersProps) {
  const filters: Array<{ id: 'all' | 5 | 4 | 3 | 2 | 1; label: string }> = [
    { id: 'all', label: 'All Reviews' },
    { id: 5, label: '5 Stars' },
    { id: 4, label: '4 Stars' },
    { id: 3, label: '3 Stars' },
    { id: 2, label: '2 Stars' },
    { id: 1, label: '1 Star' },
  ];

  return (
    <div className={`review-filters ${className}`}>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = selectedFilter === filter.id;
          const count = counts[filter.id];

          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`
                inline-flex items-center px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all
                ${
                  isActive
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-primary-400 hover:bg-primary-50'
                }
              `}
            >
              {filter.id !== 'all' && (
                <FiStar
                  className={`mr-1.5 h-4 w-4 ${
                    isActive ? 'text-white fill-white' : 'text-yellow-400 fill-yellow-400'
                  }`}
                />
              )}
              <span>{filter.label}</span>
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  isActive ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
