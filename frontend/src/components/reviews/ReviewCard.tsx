'use client';

import React, { useState } from 'react';
import { FiThumbsUp, FiFlag } from 'react-icons/fi';
import Image from 'next/image';

export interface ReviewCardProps {
  review: {
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
  };
  /** Callback when helpful button is clicked */
  onHelpfulClick?: (reviewId: string) => void;
  /** Callback when report button is clicked */
  onReportClick?: (reviewId: string) => void;
  /** Whether user has marked this review as helpful */
  isMarkedHelpful?: boolean;
  /** Custom className */
  className?: string;
}

export function ReviewCard({
  review,
  onHelpfulClick,
  onReportClick,
  isMarkedHelpful = false,
  className = '',
}: ReviewCardProps) {
  const [imageExpanded, setImageExpanded] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <div
        className={`review-card bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors ${className}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3">
            {/* User Avatar */}
            {review.userAvatar ? (
              <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={review.userAvatar}
                  alt={review.userName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-sm">
                  {review.userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* User Info */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">{review.userName}</span>
                {review.verified && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    ✓ Verified Purchase
                  </span>
                )}
              </div>

              {/* Star Rating */}
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                {review.size && (
                  <span className="ml-2 text-xs text-gray-500">Size: {review.size}</span>
                )}
              </div>
            </div>
          </div>

          {/* Date */}
          <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
        </div>

        {/* Review Title */}
        {review.title && (
          <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
        )}

        {/* Review Text */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.text}</p>

        {/* Review Images */}
        {review.images && review.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {review.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setImageExpanded(image)}
                className="relative h-20 w-20 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary-400 transition-colors cursor-pointer"
              >
                <Image
                  src={image}
                  alt={`Review image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            {/* Helpful Button */}
            <button
              onClick={() => onHelpfulClick?.(review.id)}
              className={`
                inline-flex items-center text-sm font-medium transition-colors
                ${
                  isMarkedHelpful
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }
              `}
            >
              <FiThumbsUp
                className={`mr-1.5 h-4 w-4 ${isMarkedHelpful ? 'fill-current' : ''}`}
              />
              Helpful ({review.helpful})
            </button>

            {/* Report Button */}
            <button
              onClick={() => onReportClick?.(review.id)}
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
            >
              <FiFlag className="mr-1.5 h-4 w-4" />
              Report
            </button>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {imageExpanded && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setImageExpanded(null)}
        >
          <button
            onClick={() => setImageExpanded(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            ×
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image
              src={imageExpanded}
              alt="Review image expanded"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
