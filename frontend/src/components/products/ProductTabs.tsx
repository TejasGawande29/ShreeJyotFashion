'use client';

import React, { useState, useMemo } from 'react';
import { FiFileText, FiList, FiStar } from 'react-icons/fi';
import { ReviewFilters } from '@/components/reviews/ReviewFilters';
import { ReviewSort, type ReviewSortOption } from '@/components/reviews/ReviewSort';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { WriteReviewModal } from '@/components/reviews/WriteReviewModal';
import { ReviewPagination } from '@/components/reviews/ReviewPagination';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  size?: string;
}

interface Specification {
  label: string;
  value: string;
}

export interface ProductTabsProps {
  /** Product long description (HTML content) */
  description?: string;
  /** Array of product specifications */
  specifications?: Specification[];
  /** Product features list */
  features?: string[];
  /** Average rating */
  averageRating?: number;
  /** Total review count */
  reviewCount?: number;
  /** Array of reviews (top 3 will be shown) */
  reviews?: Review[];
  /** Product ID for linking to full reviews */
  productId?: string;
  /** Product name for write review modal */
  productName?: string;
  /** Custom className */
  className?: string;
}

type TabType = 'description' | 'specifications' | 'reviews';

const REVIEWS_PER_PAGE = 10;

export function ProductTabs({
  description = '',
  specifications = [],
  features = [],
  averageRating = 0,
  reviewCount = 0,
  reviews = [],
  productId = '',
  productName = '',
  className = '',
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('description');
  
  // Review state
  const [selectedFilter, setSelectedFilter] = useState<'all' | 5 | 4 | 3 | 2 | 1>('all');
  const [selectedSort, setSelectedSort] = useState<ReviewSortOption>('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());

  const tabs = [
    {
      id: 'description' as TabType,
      label: 'Description',
      icon: FiFileText,
      count: null,
    },
    {
      id: 'specifications' as TabType,
      label: 'Specifications',
      icon: FiList,
      count: specifications.length,
    },
    {
      id: 'reviews' as TabType,
      label: 'Reviews',
      icon: FiStar,
      count: reviewCount,
    },
  ];

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, tabId: TabType) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === tabId);

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[nextIndex].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prevIndex].id);
    }
  };

  // Calculate rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  // Filter reviews
  const filteredReviews = useMemo(() => {
    if (selectedFilter === 'all') return reviews;
    return reviews.filter((review) => review.rating === selectedFilter);
  }, [reviews, selectedFilter]);

  // Sort reviews
  const sortedReviews = useMemo(() => {
    const sorted = [...filteredReviews];
    
    switch (selectedSort) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'helpful':
        return sorted.sort((a, b) => b.helpful - a.helpful);
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  }, [filteredReviews, selectedSort]);

  // Paginate reviews
  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    return sortedReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);
  }, [sortedReviews, currentPage]);

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    return {
      all: reviews.length,
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };
  }, [reviews]);

  // Handlers
  const handleFilterChange = (filter: 'all' | 5 | 4 | 3 | 2 | 1) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: ReviewSortOption) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of reviews section
    document.getElementById('reviews-panel')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const handleReportClick = (reviewId: string) => {
    // TODO: Implement report functionality
    console.log('Report review:', reviewId);
    alert('Thank you for reporting. We will review this shortly.');
  };

  const handleWriteReview = (reviewData: {
    rating: number;
    title: string;
    text: string;
    images: File[];
  }) => {
    // TODO: Submit review to API
    console.log('Submit review:', reviewData);
    alert('Thank you for your review! It will be published after moderation.');
  };

  return (
    <div className={`product-tabs ${className}`}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs" role="tablist">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
                id={`${tab.id}-tab`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    isActive
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon
                  className={`mr-2 h-5 w-5 ${
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {tab.label}
                {tab.count !== null && (
                  <span
                    className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      isActive
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="py-6">
        {/* Description Panel */}
        <div
          role="tabpanel"
          id="description-panel"
          aria-labelledby="description-tab"
          hidden={activeTab !== 'description'}
          className={`space-y-6 ${activeTab === 'description' ? 'animate-fadeIn' : ''}`}
        >
          {/* Product Description */}
          {description && (
            <div
              className="prose prose-gray max-w-none
                prose-headings:font-playfair prose-headings:text-gray-900
                prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-6
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                prose-li:text-gray-600 prose-li:leading-relaxed
              "
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

          {/* Product Features */}
          {features && features.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 font-playfair mb-4">
                Key Features
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-6 w-6 text-primary-600 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Specifications Panel */}
        <div
          role="tabpanel"
          id="specifications-panel"
          aria-labelledby="specifications-tab"
          hidden={activeTab !== 'specifications'}
          className={activeTab === 'specifications' ? 'animate-fadeIn' : ''}
        >
          {specifications && specifications.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200">
                  {specifications.map((spec, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/3">
                        {spec.label}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FiList className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">No specifications available</p>
            </div>
          )}
        </div>

        {/* Reviews Panel */}
        <div
          role="tabpanel"
          id="reviews-panel"
          aria-labelledby="reviews-tab"
          hidden={activeTab !== 'reviews'}
          className={activeTab === 'reviews' ? 'animate-fadeIn' : ''}
        >
          {reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {/* Rating Summary & Write Review */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="text-4xl font-bold text-gray-900">
                          {averageRating.toFixed(1)}
                        </span>
                        <div className="ml-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(averageRating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Based on {reviewCount} reviews
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="hidden md:block space-y-1 w-64">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                        const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;

                        return (
                          <div key={rating} className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-600 w-8">{rating}★</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-gray-600 w-8 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Write Review Button */}
                <button
                  onClick={() => setIsWriteReviewOpen(true)}
                  className="lg:w-auto w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all whitespace-nowrap"
                >
                  ✍️ Write a Review
                </button>
              </div>

              {/* Filters and Sort */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <ReviewFilters
                  selectedFilter={selectedFilter}
                  counts={filterCounts}
                  onFilterChange={handleFilterChange}
                />
                <ReviewSort
                  selectedSort={selectedSort}
                  onSortChange={handleSortChange}
                />
              </div>

              {/* Reviews List */}
              {paginatedReviews.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {paginatedReviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        onHelpfulClick={handleHelpfulClick}
                        onReportClick={handleReportClick}
                        isMarkedHelpful={helpfulReviews.has(review.id)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <ReviewPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={sortedReviews.length}
                    itemsPerPage={REVIEWS_PER_PAGE}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <FiStar className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    No reviews match your filter criteria
                  </p>
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiStar className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600 mb-4">No reviews yet</p>
              <button
                onClick={() => setIsWriteReviewOpen(true)}
                className="inline-flex items-center px-4 py-2 border-2 border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
              >
                Write the First Review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
        onSubmit={handleWriteReview}
        productName={productName}
      />

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
