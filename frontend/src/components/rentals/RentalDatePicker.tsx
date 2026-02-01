'use client';

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar, FiInfo } from 'react-icons/fi';
import {
  calculateRentalDays,
  calculateRentalCost,
  validateRentalDates,
  formatDateForDisplay,
  getMinSelectableDate,
  getMaxSelectableDate,
  isDateUnavailable,
  MIN_RENTAL_DAYS,
  MAX_RENTAL_DAYS,
} from '@/lib/utils/rentalCalculations';

export interface RentalDatePickerProps {
  /** Daily rental rate */
  dailyRate: number;
  /** Security deposit amount */
  securityDeposit: number;
  /** Array of unavailable dates (YYYY-MM-DD format) */
  unavailableDates?: string[];
  /** Callback when dates are selected */
  onDatesSelected?: (startDate: Date | null, endDate: Date | null, totalCost: number) => void;
  /** Callback when validation changes */
  onValidationChange?: (isValid: boolean, error?: string) => void;
  /** Custom className */
  className?: string;
}

export function RentalDatePicker({
  dailyRate,
  securityDeposit,
  unavailableDates = [],
  onDatesSelected,
  onValidationChange,
  className = '',
}: RentalDatePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [validationError, setValidationError] = useState<string>('');

  const minDate = getMinSelectableDate();
  const maxDate = getMaxSelectableDate();

  // Calculate rental details
  const rentalDays = calculateRentalDays(startDate, endDate);
  const rentalCost = calculateRentalCost(dailyRate, rentalDays);
  const grandTotal = rentalCost + securityDeposit;

  // Validate dates whenever they change
  useEffect(() => {
    const validation = validateRentalDates(startDate, endDate, unavailableDates);
    setValidationError(validation.error || '');
    
    // Notify parent component
    if (onValidationChange) {
      onValidationChange(validation.isValid, validation.error);
    }
    
    if (onDatesSelected && validation.isValid) {
      onDatesSelected(startDate, endDate, grandTotal);
    }
  }, [startDate, endDate, unavailableDates, grandTotal, onDatesSelected, onValidationChange]);

  // Check if a date should be disabled
  const isDateDisabled = (date: Date): boolean => {
    // Disable past dates
    if (date < minDate) return true;
    
    // Disable dates beyond max booking window
    if (date > maxDate) return true;
    
    // Disable unavailable dates
    if (isDateUnavailable(date, unavailableDates)) return true;
    
    return false;
  };

  // Handle start date change
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    
    // Reset end date if it's before the new start date
    if (date && endDate && endDate < date) {
      setEndDate(null);
    }
  };

  // Handle end date change
  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  // Handle date range selection (when selecting from calendar)
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className={`rental-date-picker ${className}`}>
      {/* Date Picker Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiCalendar className="mr-2 text-primary-600" />
          Select Rental Dates
        </h3>
        <div className="text-sm text-gray-500">
          {MIN_RENTAL_DAYS}-{MAX_RENTAL_DAYS} days
        </div>
      </div>

      {/* Date Picker Component */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4">
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          minDate={minDate}
          maxDate={maxDate}
          filterDate={(date) => !isDateDisabled(date)}
          monthsShown={2}
          disabledKeyboardNavigation
          calendarClassName="rental-calendar"
        />
      </div>

      {/* Selected Dates Display */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-xs text-gray-600 mb-1">Start Date</div>
          <div className="text-sm font-semibold text-gray-900">
            {startDate ? formatDateForDisplay(startDate) : 'Select date'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-xs text-gray-600 mb-1">End Date</div>
          <div className="text-sm font-semibold text-gray-900">
            {endDate ? formatDateForDisplay(endDate) : 'Select date'}
          </div>
        </div>
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <FiInfo className="text-red-600 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{validationError}</p>
        </div>
      )}

      {/* Rental Summary */}
      {rentalDays > 0 && !validationError && (
        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Rental Summary</h4>
          
          <div className="space-y-2 text-sm">
            {/* Rental Duration */}
            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium text-gray-900">
                {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
              </span>
            </div>

            {/* Rental Cost */}
            <div className="flex justify-between">
              <span className="text-gray-600">
                Rental (₹{dailyRate.toLocaleString()}/day × {rentalDays})
              </span>
              <span className="font-medium text-gray-900">
                ₹{rentalCost.toLocaleString()}
              </span>
            </div>

            {/* Security Deposit */}
            <div className="flex justify-between">
              <span className="text-gray-600">
                Security Deposit
                <span className="text-xs text-green-600 ml-1">(Refundable)</span>
              </span>
              <span className="font-medium text-gray-900">
                ₹{securityDeposit.toLocaleString()}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-primary-300 my-2"></div>

            {/* Grand Total */}
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Amount</span>
              <span className="text-xl font-bold text-primary-600">
                ₹{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Info Message */}
          <div className="mt-3 pt-3 border-t border-primary-200">
            <div className="flex items-start text-xs text-gray-600">
              <FiInfo className="mr-1.5 mt-0.5 flex-shrink-0 text-primary-600" />
              <p>
                Security deposit will be refunded within 3-5 business days after product return and inspection.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!startDate && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start text-sm text-blue-700">
            <FiInfo className="mr-2 mt-0.5 flex-shrink-0" />
            <p>
              Select your rental start and end dates from the calendar. Greyed out dates are unavailable.
            </p>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .rental-calendar {
          font-family: inherit;
        }

        .rental-calendar .react-datepicker {
          border: none;
          box-shadow: none;
        }

        .rental-calendar .react-datepicker__month-container {
          float: left;
          padding: 0 10px;
        }

        .rental-calendar .react-datepicker__header {
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          padding-top: 10px;
        }

        .rental-calendar .react-datepicker__current-month {
          font-weight: 600;
          color: #111827;
          font-size: 0.95rem;
          margin-bottom: 8px;
        }

        .rental-calendar .react-datepicker__day-name {
          color: #6b7280;
          font-size: 0.8rem;
          font-weight: 600;
          width: 2.2rem;
          line-height: 2.2rem;
        }

        .rental-calendar .react-datepicker__day {
          width: 2.2rem;
          line-height: 2.2rem;
          font-size: 0.875rem;
          border-radius: 0.375rem;
          color: #374151;
          transition: all 0.2s;
        }

        .rental-calendar .react-datepicker__day:hover {
          background-color: #f3f4f6;
        }

        .rental-calendar .react-datepicker__day--selected {
          background-color: #6b46c1;
          color: white;
          font-weight: 600;
        }

        .rental-calendar .react-datepicker__day--in-range {
          background-color: #e9d5ff;
          color: #6b46c1;
        }

        .rental-calendar .react-datepicker__day--in-selecting-range {
          background-color: #e9d5ff;
          color: #6b46c1;
        }

        .rental-calendar .react-datepicker__day--range-start,
        .rental-calendar .react-datepicker__day--range-end {
          background-color: #6b46c1 !important;
          color: white !important;
          font-weight: 600;
        }

        .rental-calendar .react-datepicker__day--disabled {
          color: #d1d5db;
          cursor: not-allowed;
          background-color: #f9fafb;
          text-decoration: line-through;
        }

        .rental-calendar .react-datepicker__day--disabled:hover {
          background-color: #f9fafb;
        }

        .rental-calendar .react-datepicker__day--today {
          font-weight: 600;
          color: #6b46c1;
        }

        .rental-calendar .react-datepicker__navigation {
          top: 12px;
        }

        .rental-calendar .react-datepicker__navigation-icon::before {
          border-color: #6b46c1;
        }

        @media (max-width: 768px) {
          .rental-calendar .react-datepicker__month-container {
            padding: 0 5px;
          }

          .rental-calendar .react-datepicker__day,
          .rental-calendar .react-datepicker__day-name {
            width: 2rem;
            line-height: 2rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
