import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { formatPrice, calculateDiscount, getStockStatus } from '@/lib/utils';
import { getValidImageUrl } from '@/lib/utils/placeholderImages';
import { FiHeart, FiShoppingCart, FiCalendar } from 'react-icons/fi';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onAddToWishlist }: ProductCardProps) {
  const discount = calculateDiscount(product.price, product.salePrice || product.price);
  const stockStatus = getStockStatus(product.stock);
  const hasRental = product.isRentalAvailable;
  
  // Handle category being either string or Category object
  const categoryName = typeof product.category === 'string' 
    ? product.category 
    : product.category?.name;
  
  return (
    <div className="card hoverable group">
      {/* Image Container */}
      <div className="relative aspect-product overflow-hidden bg-neutral-100">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={getValidImageUrl(product.thumbnail || product.images[0], categoryName, product.subcategory)}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {hasRental && (
            <Badge variant="rental" size="sm">
              <FiCalendar className="w-3 h-3" />
              For Rent
            </Badge>
          )}
          {product.isFeatured && (
            <Badge variant="featured" size="sm">
              Featured
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="sale" size="sm">
              {discount}% OFF
            </Badge>
          )}
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onAddToWishlist?.(product);
          }}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-100"
          aria-label="Add to wishlist"
        >
          <FiHeart className="w-5 h-5 text-neutral-700" />
        </button>
        
        {/* Stock Status */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="outofstock" size="lg">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
            {typeof product.category === 'string' ? product.category : product.category.name}
          </p>
        )}
        
        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-neutral-900 line-clamp-2 hover:text-primary-600 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>
        
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="price">{formatPrice(product.salePrice || product.price)}</span>
          {product.salePrice && (
            <>
              <span className="price-original">{formatPrice(product.price)}</span>
              <span className="price-discount">({discount}% off)</span>
            </>
          )}
        </div>
        
        {/* Rental Price */}
        {hasRental && product.rentalPricePerDay && (
          <p className="text-sm text-primary-600 font-medium mb-3">
            Rent from {formatPrice(product.rentalPricePerDay)}/day
          </p>
        )}
        
        {/* Stock Warning */}
        {product.stock > 0 && product.stock <= 5 && (
          <p className={`text-xs font-medium mb-3 ${
            stockStatus.color === 'warning' ? 'text-warning' : 'text-error'
          }`}>
            {stockStatus.label}
          </p>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {product.stock > 0 ? (
            <>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => onAddToCart?.(product)}
                leftIcon={<FiShoppingCart className="w-4 h-4" />}
              >
                Add to Cart
              </Button>
              
              {hasRental && (
                <Link href={`/products/${product.slug}?tab=rental`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    leftIcon={<FiCalendar className="w-4 h-4" />}
                  >
                    Rent
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <Button variant="outline" size="sm" fullWidth disabled>
              Out of Stock
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
