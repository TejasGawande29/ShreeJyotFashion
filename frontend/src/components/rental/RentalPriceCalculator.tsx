'use client';

import { FiCalendar, FiDollarSign, FiShield, FiInfo } from 'react-icons/fi';

interface RentalPriceCalculatorProps {
  dailyRate: number;
  securityDeposit: number;
  startDate: string | null;
  endDate: string | null;
  duration: number;
  rentalTotal: number;
  totalAmount: number;
  showBreakdown?: boolean;
}

export default function RentalPriceCalculator({
  dailyRate,
  securityDeposit,
  startDate,
  endDate,
  duration,
  rentalTotal,
  totalAmount,
  showBreakdown = true,
}: RentalPriceCalculatorProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-4">
      {/* Rental Summary Card */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiCalendar className="w-5 h-5 mr-2 text-pink-500" />
          Rental Summary
        </h3>

        {startDate && endDate ? (
          <div className="space-y-3">
            {/* Selected Dates */}
            <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Start Date</p>
                <p className="font-semibold text-gray-900">{formatDate(startDate)}</p>
              </div>
              <div className="px-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="flex-1 text-right">
                <p className="text-xs text-gray-500 mb-1">End Date</p>
                <p className="font-semibold text-gray-900">{formatDate(endDate)}</p>
              </div>
            </div>

            {/* Duration */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rental Duration</span>
                <span className="font-semibold text-gray-900">
                  {duration} {duration === 1 ? 'Day' : 'Days'}
                </span>
              </div>
            </div>

            {showBreakdown && (
              <>
                {/* Price Breakdown */}
                <div className="space-y-2 pt-3 border-t border-pink-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <FiDollarSign className="w-4 h-4 mr-1" />
                      Daily Rate
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(dailyRate)}/day
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Rental ({duration} {duration === 1 ? 'day' : 'days'})
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(rentalTotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <FiShield className="w-4 h-4 mr-1" />
                      Security Deposit
                    </span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(securityDeposit)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-gray-900">
                        Total Amount
                      </span>
                      <span className="text-2xl font-bold text-pink-500">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Deposit Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-2">
                  <FiInfo className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-green-800">
                    <p className="font-semibold mb-1">Fully Refundable Deposit</p>
                    <p>
                      The security deposit of {formatCurrency(securityDeposit)} will be
                      refunded within 3-5 business days after you return the item in good condition.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              Select start and end dates to see rental pricing
            </p>
          </div>
        )}
      </div>

      {/* Quick Price Reference */}
      {!startDate || !endDate ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Quick Price Reference
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">3 Days</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(dailyRate * 3 + securityDeposit)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">7 Days</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(dailyRate * 7 + securityDeposit)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">15 Days</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(dailyRate * 15 + securityDeposit)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2 pt-2 border-t">
              + {formatCurrency(securityDeposit)} refundable deposit
            </p>
          </div>
        </div>
      ) : null}

      {/* Benefits */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Why Rent?
        </h4>
        <ul className="space-y-2 text-xs text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2 mt-0.5">✓</span>
            <span>Wear premium outfits at just 2% of retail price</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2 mt-0.5">✓</span>
            <span>Perfect for weddings, parties, and special occasions</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2 mt-0.5">✓</span>
            <span>No storage hassles or maintenance costs</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2 mt-0.5">✓</span>
            <span>Sustainable fashion choice - reduce textile waste</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
