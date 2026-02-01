import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WishlistItem as WishlistItemType } from '@/lib/redux/slices/wishlistSlice';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { formatPrice } from '@/lib/utils';
import { FiShoppingCart, FiX, FiCalendar } from 'react-icons/fi';

interface WishlistItemProps {
  item: WishlistItemType;
  onRemove: (itemId: string, itemName: string) => void;
  onMoveToCart: (item: WishlistItemType) => void;
}

export function WishlistItem({ item, onRemove, onMoveToCart }: WishlistItemProps) {
  return (
    <div className="card hoverable group relative">
      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id, item.name)}
        className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
        aria-label="Remove from wishlist"
      >
        <FiX className="w-5 h-5 text-red-600" />
      </button>

      {/* Image Container */}
      <Link href={`/products/${item.slug}`}>
        <div className="relative aspect-product overflow-hidden bg-neutral-100 rounded-t-lg">
          <Image
            src={item.image || '/placeholder.jpg'}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {item.type === 'rental' && (
              <Badge variant="rental" size="sm">
                <FiCalendar className="w-3 h-3" />
                For Rent
              </Badge>
            )}
            {!item.inStock && (
              <Badge variant="outofstock" size="sm">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <Link href={`/products/${item.slug}`}>
          <h3 className="font-semibold text-neutral-900 line-clamp-2 hover:text-primary-600 transition-colors mb-2">
            {item.name}
          </h3>
        </Link>

        {/* Rating */}
        {item.rating && (
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(item.rating!) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({item.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="price">{formatPrice(item.price)}</span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span className="price-original">{formatPrice(item.originalPrice)}</span>
          )}
        </div>

        {/* Rental Price */}
        {item.type === 'rental' && item.rentalPrice && (
          <p className="text-sm text-primary-600 font-medium mb-3">
            Rent from {formatPrice(item.rentalPrice)}/day
          </p>
        )}

        {/* Stock Status */}
        {!item.inStock && (
          <p className="text-sm text-red-600 font-medium mb-3">
            Currently out of stock
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => onMoveToCart(item)}
            disabled={!item.inStock}
            leftIcon={<FiShoppingCart className="w-4 h-4" />}
          >
            {item.inStock ? 'Move to Cart' : 'Out of Stock'}
          </Button>
          
          <Link href={`/products/${item.slug}`}>
            <Button
              variant="outline"
              size="sm"
              fullWidth
            >
              View Details
            </Button>
          </Link>
        </div>

        {/* Added Date */}
        <p className="text-xs text-gray-500 mt-3 text-center">
          Added {new Date(item.addedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </p>
      </div>
    </div>
  );
}
