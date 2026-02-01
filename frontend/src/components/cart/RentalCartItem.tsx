'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch } from '@/lib/redux/hooks';
import { removeItem } from '@/lib/redux/slices/cartSlice';
import { FiTrash2, FiCalendar, FiClock, FiEdit2 } from 'react-icons/fi';
import { toast, toastMessages } from '@/utils/toast';

interface RentalCartItemProps {
  id: string;
  name: string;
  slug: string;
  image: string;
  size?: string;
  color?: string;
  rentalPrice?: number;
  securityDeposit?: number;
  rentalStartDate?: string;
  rentalEndDate?: string;
  rentalDays?: number;
  rentalTotalCost?: number;
}

export default function RentalCartItem({
  id,
  name,
  slug,
  image,
  size,
  color,
  rentalPrice,
  securityDeposit,
  rentalStartDate,
  rentalEndDate,
  rentalDays,
  rentalTotalCost,
}: RentalCartItemProps) {
  const dispatch = useAppDispatch();
  const [isRemoving, setIsRemoving] = useState(false);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Calculate rental subtotal and deposit
  const rentalSubtotal = (rentalPrice || 0) * (rentalDays || 0);
  const deposit = securityDeposit || 0;
  const total = rentalTotalCost || (rentalSubtotal + deposit);

  const handleRemove = async () => {
    if (isRemoving) return; // Prevent multiple clicks
    
    setIsRemoving(true);
    
    // Small delay for visual feedback
    setTimeout(() => {
      // Remove from cart (using rentalStartDate to identify rental items)
      dispatch(removeItem({ id, size, color, rentalStartDate }));
      
      toast.success(toastMessages.cart.removeSuccess);
    }, 300);
  };

  return (
    <div
      className={`bg-white border-2 border-pink-200 rounded-lg p-4 transition-all ${
        isRemoving ? 'opacity-50 scale-95' : ''
      }`}
    >
      {/* Rental Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500 to-purple-500 text-white">
          <FiCalendar className="w-3 h-3 mr-1" />
          RENTAL
        </span>
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
          aria-label="Remove from cart"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-4">
        {/* Product Image */}
        <Link href={`/products/${slug}`} className="flex-shrink-0">
          <div className="relative w-24 h-32 rounded-lg overflow-hidden border border-gray-200 hover:border-pink-300 transition-colors">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-grow space-y-3">
          {/* Product Name */}
          <Link
            href={`/products/${slug}`}
            className="block font-semibold text-gray-900 hover:text-pink-600 transition-colors line-clamp-2"
          >
            {name}
          </Link>

          {/* Size & Color */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {size && (
              <div className="flex items-center">
                <span className="font-medium">Size:</span>
                <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded">{size}</span>
              </div>
            )}
            {color && (
              <div className="flex items-center">
                <span className="font-medium">Color:</span>
                <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded">{color}</span>
              </div>
            )}
          </div>

          {/* Rental Dates */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-pink-700 uppercase">Rental Period</span>
              <button
                className="text-xs text-pink-600 hover:text-pink-700 font-medium flex items-center"
                onClick={() => toast.info('Edit dates feature coming soon!', '📅')}
              >
                <FiEdit2 className="w-3 h-3 mr-1" />
                Edit Dates
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Start Date */}
              <div>
                <div className="text-xs text-gray-600 mb-1">Start Date</div>
                <div className="flex items-center text-sm font-semibold text-gray-900">
                  <FiCalendar className="w-3.5 h-3.5 mr-1.5 text-pink-500" />
                  {formatDate(rentalStartDate)}
                </div>
              </div>

              {/* End Date */}
              <div>
                <div className="text-xs text-gray-600 mb-1">End Date</div>
                <div className="flex items-center text-sm font-semibold text-gray-900">
                  <FiCalendar className="w-3.5 h-3.5 mr-1.5 text-pink-500" />
                  {formatDate(rentalEndDate)}
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="mt-2 pt-2 border-t border-pink-200">
              <div className="flex items-center justify-center text-sm">
                <FiClock className="w-4 h-4 mr-1.5 text-purple-500" />
                <span className="font-semibold text-purple-700">
                  {rentalDays} {rentalDays === 1 ? 'Day' : 'Days'} Rental
                </span>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
            {/* Daily Rate */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Daily Rate:</span>
              <span className="font-medium text-gray-900">
                ₹{(rentalPrice || 0).toLocaleString()}/day
              </span>
            </div>

            {/* Rental Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Rental ({rentalDays} {rentalDays === 1 ? 'day' : 'days'}):
              </span>
              <span className="font-medium text-gray-900">
                ₹{rentalSubtotal.toLocaleString()}
              </span>
            </div>

            {/* Security Deposit */}
            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-300">
              <span className="text-green-700 font-medium">Security Deposit:</span>
              <span className="font-semibold text-green-700">
                ₹{deposit.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-green-600 text-right">
              (Refundable)
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-300">
              <span className="text-base font-semibold text-gray-900">Total Amount:</span>
              <span className="text-xl font-bold text-pink-600">
                ₹{total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
            <div className="flex items-start">
              <svg
                className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs text-blue-700">
                Item will be delivered 2 days before your rental start date. Please keep your ID proof ready for verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
