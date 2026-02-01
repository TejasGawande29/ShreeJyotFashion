'use client';

import { ProductCard } from './ProductCard';
import type { Product } from '@/types';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addToCart } from '@/lib/redux/slices/cartSlice';
import { toggleWishlist } from '@/lib/redux/slices/wishlistSlice';
import { toast, toastMessages } from '@/utils/toast';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function ProductGrid({
  products,
  loading = false,
  emptyMessage = 'No products found',
  className = '',
}: ProductGridProps) {
  const dispatch = useAppDispatch();

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      id: product.id.toString(),
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.compareAtPrice,
      image: product.images?.[0] || '/placeholder.jpg',
      type: 'sale',
    }));
    toast.success(toastMessages.cart.addSuccess);
  };

  const handleAddToWishlist = (product: Product) => {
    dispatch(toggleWishlist({
      id: product.id.toString(),
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.compareAtPrice,
      image: product.images?.[0] || '/placeholder.jpg',
      rating: product.rating,
      reviewCount: product.reviewCount,
      inStock: (product.stock || 0) > 0,
      type: product.isRentalAvailable ? 'rental' : 'sale',
      rentalPrice: product.rentalPricePerDay,
      addedAt: new Date().toISOString(),
    }));
    toast.success(toastMessages.wishlist.addSuccess);
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-neutral-200 aspect-[3/4] rounded-lg mb-4" />
            <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-neutral-200 rounded w-1/2 mb-2" />
            <div className="h-6 bg-neutral-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-24 h-24 mb-6 text-neutral-300">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="w-full h-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-neutral-600 max-w-md">
          Try adjusting your filters or search criteria to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
        />
      ))}
    </div>
  );
}
