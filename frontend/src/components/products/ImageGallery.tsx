'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FiZoomIn, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export interface ImageGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export function ImageGallery({ images, productName, className = '' }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightboxOpen, images.length]);

  // Prevent scroll when lightbox is open
  React.useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLightboxOpen]);

  if (!images || images.length === 0) {
    return (
      <div className={`aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Main Image */}
        <div className="relative aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden group">
          {/* Placeholder Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-500">{productName}</p>
              <p className="text-xs text-gray-400">Image {selectedImageIndex + 1} of {images.length}</p>
            </div>
          </div>

          {/* Zoom Button */}
          <button
            onClick={() => openLightbox(selectedImageIndex)}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-lg shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10"
            aria-label="Open image in full screen"
          >
            <FiZoomIn className="h-5 w-5 text-gray-700" />
          </button>

          {/* Navigation Arrows (for mobile) */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all md:hidden"
                aria-label="Previous image"
              >
                <FiChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all md:hidden"
                aria-label="Next image"
              >
                <FiChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`relative aspect-square bg-gray-200 rounded-lg overflow-hidden transition-all
                  ${selectedImageIndex === index 
                    ? 'ring-2 ring-primary-600 ring-offset-2 scale-95' 
                    : 'hover:ring-2 hover:ring-gray-300 opacity-70 hover:opacity-100'
                  }`}
                aria-label={`View image ${index + 1}`}
              >
                {/* Thumbnail Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="mx-auto h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-500 mt-1">{index + 1}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-all z-10"
            aria-label="Close lightbox"
          >
            <FiX className="h-6 w-6 text-white" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-all z-10"
            aria-label="Previous image"
          >
            <FiChevronLeft className="h-6 w-6 text-white" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-all z-10"
            aria-label="Next image"
          >
            <FiChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Main Image */}
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg className="mx-auto h-24 w-24 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-4 text-lg font-medium text-white">{productName}</p>
                <p className="text-sm text-gray-400">Full Size Image Preview</p>
              </div>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
              {lightboxIndex + 1} / {images.length}
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            <p>Press <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd> or <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd> to navigate, <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd> to close</p>
          </div>
        </div>
      )}
    </>
  );
}
