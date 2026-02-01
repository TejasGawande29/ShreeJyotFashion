'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector } from '@/lib/redux/hooks';
import AccountLayout from '@/components/account/AccountLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { FiStar, FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

// Mock reviews data
const initialReviews = [
  {
    id: '1',
    productId: 'prod1',
    productName: 'Floral Summer Dress',
    productImage: '/images/products/dress1.jpg',
    rating: 5,
    title: 'Absolutely love it!',
    comment: 'The dress is beautiful and fits perfectly. The fabric quality is amazing and the print is exactly as shown in the pictures. Highly recommended!',
    date: '2025-10-20',
    helpful: 12,
  },
  {
    id: '2',
    productId: 'prod2',
    productName: 'Casual White Sneakers',
    productImage: '/images/products/shoes1.jpg',
    rating: 4,
    title: 'Comfortable and stylish',
    comment: 'Great sneakers for daily wear. Very comfortable and looks good with most outfits. Only issue is they get dirty quickly.',
    date: '2025-10-18',
    helpful: 8,
  },
  {
    id: '3',
    productId: 'prod3',
    productName: 'Designer Saree',
    productImage: '/images/products/saree1.jpg',
    rating: 5,
    title: 'Perfect for weddings',
    comment: 'Bought this for my cousin\'s wedding and received so many compliments! The color is vibrant and the work is intricate. Worth every penny.',
    date: '2025-10-10',
    helpful: 15,
  },
];

interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
}

function ReviewsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/account/reviews');
    }
  }, [isAuthenticated, router]);

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setEditForm({
      rating: review.rating,
      title: review.title,
      comment: review.comment,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ rating: 5, title: '', comment: '' });
  };

  const handleSaveEdit = async (reviewId: string) => {
    if (!editForm.title.trim() || !editForm.comment.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReviews(reviews.map(review =>
        review.id === reviewId
          ? { ...review, ...editForm }
          : review
      ));
      
      toast.success('Review updated successfully! 🎉');
      setEditingId(null);
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setReviews(reviews.filter(review => review.id !== reviewId));
      toast.success('Review deleted successfully');
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange && onChange(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <FiStar
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <AccountLayout>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-gray-600 mt-1">Manage your product reviews</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {reviews.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <FiStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600 mb-6">
                Start reviewing products you've purchased
              </p>
              <Link
                href="/account/orders"
                className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                View Orders
              </Link>
            </div>
          ) : (
            /* Reviews List */
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  {editingId === review.id ? (
                    /* Edit Form */
                    <div className="space-y-4">
                      {/* Product Info */}
                      <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FiPackage className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{review.productName}</h3>
                          <p className="text-sm text-gray-600">Editing review</p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        {renderStars(editForm.rating, true, (rating) =>
                          setEditForm({ ...editForm, rating })
                        )}
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Review Title
                        </label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                          placeholder="Summarize your experience"
                        />
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Review
                        </label>
                        <textarea
                          value={editForm.comment}
                          onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                          rows={4}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
                          placeholder="Share your thoughts about the product"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(review.id)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Review Display */
                    <>
                      {/* Product Info */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FiPackage className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{review.productName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-600">
                                {new Date(review.date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(review)}
                            className="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                            title="Edit Review"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Review"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">{review.title}</h4>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>

                      {/* Helpful Count */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          {review.helpful} {review.helpful === 1 ? 'person' : 'people'} found this helpful
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* Review Count */}
              <div className="text-center text-sm text-gray-600 pt-4">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} total
              </div>
            </div>
          )}
        </div>
      </div>
    </AccountLayout>
  );
}

// Export with Protected Route
export default function ProtectedReviewsPage() {
  return (
    <ProtectedRoute requireAuth>
      <ReviewsPage />
    </ProtectedRoute>
  );
}
