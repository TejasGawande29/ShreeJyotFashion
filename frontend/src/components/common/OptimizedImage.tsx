'use client';

import { useState, memo } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

const PLACEHOLDER_URL = 'https://via.placeholder.com';

// Generate placeholder based on dimensions
const getPlaceholder = (width: number, height: number, text?: string) => {
  const label = text || `${width}x${height}`;
  return `${PLACEHOLDER_URL}/${width}x${height}/E5E7EB/6B7280?text=${encodeURIComponent(label)}`;
};

function OptimizedImageComponent({
  src,
  alt,
  width,
  height,
  fallbackSrc,
  className,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const w = typeof width === 'number' ? width : 400;
      const h = typeof height === 'number' ? height : 300;
      setImgSrc(fallbackSrc || getPlaceholder(w, h, alt?.slice(0, 20)));
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      unoptimized={hasError} // Skip optimization for placeholder URLs
    />
  );
}

export const OptimizedImage = memo(OptimizedImageComponent);

// Export placeholder generator for direct use
export { getPlaceholder };
