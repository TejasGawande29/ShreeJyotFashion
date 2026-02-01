'use client';

import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export interface ReviewPaginationProps {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems: number;
  /** Items per page */
  itemsPerPage: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Custom className */
  className?: string;
}

export function ReviewPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = '',
}: ReviewPaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={`review-pagination ${className}`}>
      <div className="flex items-center justify-between">
        {/* Info Text */}
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> reviews
        </p>

        {/* Pagination Controls */}
        <nav className="flex items-center space-x-1" aria-label="Pagination">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            aria-label="Previous page"
          >
            <FiChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>

          {/* Page Numbers */}
          <div className="hidden sm:flex items-center space-x-1">
            {pages.map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-gray-500"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`
                    inline-flex items-center justify-center min-w-[40px] px-3 py-2 border-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                  aria-label={`Page ${pageNum}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Mobile: Current Page Display */}
          <div className="sm:hidden flex items-center px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            aria-label="Next page"
          >
            Next
            <FiChevronRight className="h-4 w-4 ml-1" />
          </button>
        </nav>
      </div>
    </div>
  );
}
