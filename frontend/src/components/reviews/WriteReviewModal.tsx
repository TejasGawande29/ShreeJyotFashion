'use client';

import React, { useState } from 'react';
import { FiX, FiStar, FiUpload } from 'react-icons/fi';

export interface WriteReviewModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Callback to close modal */
  onClose: () => void;
  /** Callback when review is submitted */
  onSubmit: (review: {
    rating: number;
    title: string;
    text: string;
    images: File[];
  }) => void;
  /** Product name */
  productName: string;
  /** Custom className */
  className?: string;
}

export function WriteReviewModal({
  isOpen,
  onClose,
  onSubmit,
  productName,
  className = '',
}: WriteReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      setErrors({ ...errors, images: 'Maximum 5 images allowed' });
      return;
    }
    setImages([...images, ...files]);
    setErrors({ ...errors, images: '' });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    if (title.trim().length === 0) {
      newErrors.title = 'Please enter a title';
    }
    if (text.trim().length < 20) {
      newErrors.text = 'Review must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ rating, title, text, images });
      // Reset form
      setRating(0);
      setTitle('');
      setText('');
      setImages([]);
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setRating(0);
    setTitle('');
    setText('');
    setImages([]);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
            <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Product Name */}
            <div>
              <p className="text-sm text-gray-600">Reviewing:</p>
              <p className="font-semibold text-gray-900">{productName}</p>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <FiStar
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    {rating === 5
                      ? 'Excellent!'
                      : rating === 4
                      ? 'Very Good'
                      : rating === 3
                      ? 'Good'
                      : rating === 2
                      ? 'Fair'
                      : 'Poor'}
                  </span>
                )}
              </div>
              {errors.rating && (
                <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="review-title" className="block text-sm font-medium text-gray-900 mb-2">
                Review Title <span className="text-red-500">*</span>
              </label>
              <input
                id="review-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-opacity-20"
                maxLength={100}
              />
              <p className="mt-1 text-xs text-gray-500">{title.length}/100 characters</p>
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Review Text */}
            <div>
              <label htmlFor="review-text" className="block text-sm font-medium text-gray-900 mb-2">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                id="review-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your experience with this product. What did you like? What could be improved?"
                rows={6}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-opacity-20 resize-none"
                maxLength={1000}
              />
              <p className="mt-1 text-xs text-gray-500">{text.length}/1000 characters (minimum 20)</p>
              {errors.text && (
                <p className="mt-1 text-sm text-red-600">{errors.text}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Add Photos (Optional)
              </label>
              <div className="space-y-3">
                {/* Upload Button */}
                {images.length < 5 && (
                  <label className="inline-flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-primary-400 hover:bg-primary-50 transition-colors cursor-pointer">
                    <FiUpload className="mr-2 h-4 w-4" />
                    Upload Images
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-xs text-gray-500">
                  Upload up to 5 images (JPG, PNG, max 5MB each)
                </p>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-20 w-20 rounded-lg overflow-hidden border-2 border-gray-200"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <FiX className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {errors.images && (
                  <p className="text-sm text-red-600">{errors.images}</p>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Review Guidelines:</strong> Please be honest and constructive. Focus on
                the product quality, fit, comfort, and value. Avoid profanity and personal
                information.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
