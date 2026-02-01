'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  setCurrentBooking,
  setRentalDates,
  selectCurrentBooking,
} from '@/lib/redux/slices/rentalSlice';
import { addRentalToCart } from '@/lib/redux/slices/cartSlice';
import DatePicker from './DatePicker';
import RentalPriceCalculator from './RentalPriceCalculator';
import RentalTerms from './RentalTerms';
import { toast, toastMessages } from '@/utils/toast';
import { FiShoppingCart, FiCalendar } from 'react-icons/fi';

interface RentalProductSectionProps {
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  dailyRate: number;
  securityDeposit: number;
  mrp: number; // Original product price for comparison
  selectedSize?: string;
  selectedColor?: string;
  inStock: boolean;
  sizes: string[];
  colors?: { name: string; hex: string }[];
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}

export default function RentalProductSection({
  productId,
  productName,
  productImage,
  category,
  dailyRate,
  securityDeposit,
  mrp,
  selectedSize,
  selectedColor,
  inStock,
  sizes,
  colors,
  onSizeChange,
  onColorChange,
}: RentalProductSectionProps) {
  const dispatch = useAppDispatch();
  const currentBooking = useAppSelector(selectCurrentBooking);

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ startDate?: string; endDate?: string }>({});
  const [isBooking, setIsBooking] = useState(false);

  // Initialize current booking when component mounts
  useEffect(() => {
    dispatch(setCurrentBooking({
      productId,
      dailyRate,
      securityDeposit,
    }));
  }, [dispatch, productId, dailyRate, securityDeposit]);

  // Update rental dates when both dates are selected
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end <= start) {
        setErrors({ ...errors, endDate: 'End date must be after start date' });
        return;
      }
      
      setErrors({});
      dispatch(setRentalDates({ startDate, endDate }));
    }
  }, [startDate, endDate, dispatch]);

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    setErrors({ ...errors, startDate: '' });
    
    // Clear end date if it's before new start date
    if (endDate && date) {
      const start = new Date(date);
      const end = new Date(endDate);
      if (end <= start) {
        setEndDate(null);
        setErrors({ ...errors, endDate: '' });
      }
    }
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    setErrors({ ...errors, endDate: '' });
  };

  const validateBooking = (): boolean => {
    const newErrors: { startDate?: string; endDate?: string } = {};

    if (!startDate) {
      newErrors.startDate = 'Please select start date';
    }

    if (!endDate) {
      newErrors.endDate = 'Please select end date';
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return false;
    }

    if (!inStock) {
      toast.error('This item is currently out of stock');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookForRental = async () => {
    if (isBooking) return; // Prevent multiple clicks
    
    if (!validateBooking()) return;

    if (!currentBooking || !currentBooking.startDate || !currentBooking.endDate) {
      toast.error('Please select rental dates');
      return;
    }

    setIsBooking(true);

    // Small delay for better UX
    setTimeout(() => {
      // Add to rental cart with correct CartItem structure
      dispatch(addRentalToCart({
        id: productId,
        name: productName,
        slug: productId, // Using productId as slug for now
        price: dailyRate,
        image: productImage,
        size: selectedSize,
        color: selectedColor,
        type: 'rental' as const,
        rentalPrice: dailyRate,
        securityDeposit: securityDeposit,
        rentalStartDate: currentBooking.startDate || undefined,
        rentalEndDate: currentBooking.endDate || undefined,
        rentalDays: currentBooking.duration,
        rentalTotalCost: currentBooking.totalAmount,
      }));

      toast.success(toastMessages.cart.addSuccess);

      // Reset dates and state
      setStartDate(null);
      setEndDate(null);
      setIsBooking(false);
    }, 300);
  };

  // Calculate savings
  const savingsPercentage = mrp > 0 ? Math.round(((mrp - (dailyRate * 3)) / mrp) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Rental Badge */}
      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full">
        <FiCalendar className="w-4 h-4" />
        <span className="font-semibold text-sm">Available for Rent</span>
      </div>

      {/* Pricing Header */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-6">
        <div className="flex items-baseline space-x-3 mb-2">
          <span className="text-3xl font-bold text-pink-600">
            ₹{dailyRate.toLocaleString()}
          </span>
          <span className="text-lg text-gray-600">/day</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          Original MRP: <span className="line-through">₹{mrp.toLocaleString()}</span>
          {savingsPercentage > 0 && (
            <span className="ml-2 text-green-600 font-semibold">
              (Save {savingsPercentage}% on 3-day rental)
            </span>
          )}
        </p>

        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <span>Security Deposit:</span>
          <span className="font-semibold text-green-600">
            ₹{securityDeposit.toLocaleString()}
          </span>
          <span className="text-gray-500">(Refundable)</span>
        </div>
      </div>

      {/* Date Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiCalendar className="w-5 h-5 mr-2 text-pink-500" />
          Select Rental Period
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            placeholder="Select start date"
            error={errors.startDate}
            disabled={!inStock}
          />

          <DatePicker
            label="End Date"
            value={endDate}
            onChange={handleEndDateChange}
            minDate={startDate || undefined}
            placeholder="Select end date"
            error={errors.endDate}
            disabled={!inStock || !startDate}
          />
        </div>

        {startDate && endDate && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Rental Duration:{' '}
              <span className="font-semibold text-pink-600">
                {currentBooking?.duration} {currentBooking?.duration === 1 ? 'Day' : 'Days'}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Price Calculator */}
      <RentalPriceCalculator
        dailyRate={dailyRate}
        securityDeposit={securityDeposit}
        startDate={startDate}
        endDate={endDate}
        duration={currentBooking?.duration || 0}
        rentalTotal={currentBooking?.rentalTotal || 0}
        totalAmount={currentBooking?.totalAmount || securityDeposit}
      />

      {/* Size Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-900">Select Size *</label>
          <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">Size Guide</button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`py-3 px-4 border rounded-lg text-sm font-medium transition-all
                ${selectedSize === size
                  ? 'border-pink-600 bg-pink-50 text-pink-700 ring-2 ring-pink-600'
                  : 'border-gray-300 hover:border-pink-400 text-gray-700'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selector (if applicable) */}
      {colors && colors.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-900">Select Color</label>
          <div className="flex items-center space-x-3">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => onColorChange(color.name)}
                className={`group relative h-10 w-10 rounded-full border-2 transition-all
                  ${selectedColor === color.name ? 'border-pink-600 ring-2 ring-pink-600 ring-offset-2' : 'border-gray-300 hover:border-gray-400'}`}
                title={color.name}
              >
                <div
                  className="h-full w-full rounded-full"
                  style={{ backgroundColor: color.hex }}
                ></div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Book Button */}
      <button
        onClick={handleBookForRental}
        disabled={!inStock || !startDate || !endDate || !selectedSize || isBooking}
        className={`w-full py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center space-x-2 ${
          !inStock || !startDate || !endDate || !selectedSize || isBooking
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
        }`}
      >
        {isBooking ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span>Adding to cart...</span>
          </>
        ) : (
          <>
            <FiShoppingCart className="w-6 h-6" />
            <span>
              {!inStock
                ? 'Out of Stock'
                : !startDate || !endDate
                ? 'Select Dates to Book'
                : !selectedSize
                ? 'Select Size to Book'
                : 'Book for Rental'}
            </span>
          </>
        )}
      </button>

      {/* Rental Terms */}
      <RentalTerms />
    </div>
  );
}
