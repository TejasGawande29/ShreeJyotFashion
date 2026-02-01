'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import type { CartItem as CartItemType } from '@/lib/redux/slices/cartSlice';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (itemId: string, newQuantity: number, size?: string, color?: string) => void;
  onRemove: (itemId: string, size?: string, color?: string) => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const itemTotal = item.type === 'rental' && item.rentalTotalCost 
    ? item.rentalTotalCost 
    : item.price * item.quantity;

  return (
    <div className="p-4 md:p-6 hover:bg-neutral-50 transition-colors">
      <div className="flex gap-4">
        {/* Product Image */}
        <Link
          href={`/products/${item.slug}`}
          className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden group"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Product Name */}
              <Link
                href={`/products/${item.slug}`}
                className="text-base md:text-lg font-semibold text-neutral-900 hover:text-primary-600 transition-colors line-clamp-2"
              >
                {item.name}
              </Link>

              {/* Product Type Badge */}
              {item.type === 'rental' && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-accent-100 text-accent-700 text-xs font-medium rounded">
                  Rental - {item.rentalDays} days
                </span>
              )}

              {/* Size & Color */}
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-neutral-600">
                {item.size && (
                  <div>
                    <span className="font-medium">Size:</span> {item.size}
                  </div>
                )}
                {item.color && (
                  <div>
                    <span className="font-medium">Color:</span> {item.color}
                  </div>
                )}
              </div>

              {/* Price - Mobile */}
              <div className="md:hidden mt-2">
                <p className="text-lg font-bold text-neutral-900">
                  ₹{itemTotal.toLocaleString()}
                </p>
                <p className="text-sm text-neutral-500">
                  ₹{item.price.toLocaleString()} each
                </p>
              </div>
            </div>

            {/* Price - Desktop */}
            <div className="hidden md:block text-right">
              <p className="text-xl font-bold text-neutral-900">
                ₹{itemTotal.toLocaleString()}
              </p>
              <p className="text-sm text-neutral-500">
                ₹{item.price.toLocaleString()} each
              </p>
            </div>
          </div>

          {/* Quantity Controls & Remove Button */}
          <div className="flex items-center justify-between mt-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600 mr-2">Qty:</span>
              <div className="flex items-center border border-neutral-300 rounded-lg">
                <button
                  onClick={() => onQuantityChange(item.id, item.quantity - 1, item.size, item.color)}
                  className="p-2 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="px-4 py-1 text-center min-w-[3rem] font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onQuantityChange(item.id, item.quantity + 1, item.size, item.color)}
                  className="p-2 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={item.quantity >= 10}
                  aria-label="Increase quantity"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(item.id, item.size, item.color)}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Remove item"
            >
              <FiTrash2 className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
