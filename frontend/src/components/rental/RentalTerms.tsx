'use client';

import { FiTruck, FiRotateCcw, FiFileText, FiShield, FiClock, FiAlertCircle } from 'react-icons/fi';

export default function RentalTerms() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Rental Terms & Conditions
      </h3>

      <div className="space-y-4">
        {/* Delivery */}
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiTruck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm mb-1">
              Delivery & Pickup
            </h4>
            <p className="text-sm text-gray-600">
              We deliver 2 days before your event date. Free pickup within 1 day after rental period ends.
            </p>
          </div>
        </div>

        {/* Return Policy */}
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <FiRotateCcw className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm mb-1">
              Easy Returns
            </h4>
            <p className="text-sm text-gray-600">
              Return within 1 day after rental period. Late returns may incur additional charges of ₹100/day.
            </p>
          </div>
        </div>

        {/* ID Proof */}
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiFileText className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm mb-1">
              ID Verification
            </h4>
            <p className="text-sm text-gray-600">
              Valid government ID proof required at delivery (Aadhaar, PAN, Driving License, or Passport).
            </p>
          </div>
        </div>

        {/* Security Deposit */}
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <FiShield className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm mb-1">
              Security Deposit Refund
            </h4>
            <p className="text-sm text-gray-600">
              Full security deposit refunded within 3-5 business days after item return in good condition.
            </p>
          </div>
        </div>

        {/* Extension */}
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FiClock className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm mb-1">
              Rental Extension
            </h4>
            <p className="text-sm text-gray-600">
              Need more time? Extend your rental at the same daily rate (subject to availability).
            </p>
          </div>
        </div>

        {/* Damage Policy */}
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <FiAlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm mb-1">
              Damage & Loss
            </h4>
            <p className="text-sm text-gray-600">
              Any damage or loss will be deducted from security deposit. For items exceeding deposit value, additional charges apply.
            </p>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 text-sm mb-3">
          Important Notes
        </h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="text-pink-500 mr-2 mt-1">•</span>
            <span>Items are professionally dry-cleaned before and after each rental</span>
          </li>
          <li className="flex items-start">
            <span className="text-pink-500 mr-2 mt-1">•</span>
            <span>Alterations and modifications are not permitted</span>
          </li>
          <li className="flex items-start">
            <span className="text-pink-500 mr-2 mt-1">•</span>
            <span>Rental period starts from delivery date, not booking date</span>
          </li>
          <li className="flex items-start">
            <span className="text-pink-500 mr-2 mt-1">•</span>
            <span>Cancellation allowed up to 3 days before delivery with full refund</span>
          </li>
        </ul>
      </div>

      {/* Contact Support */}
      <div className="mt-6 bg-pink-50 border border-pink-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Questions?</span> Contact our rental support team at{' '}
          <a href="tel:+911234567890" className="text-pink-500 hover:underline">
            +91 123-456-7890
          </a>{' '}
          or{' '}
          <a href="mailto:rentals@shreejyotfashion.com" className="text-pink-500 hover:underline">
            rentals@shreejyotfashion.com
          </a>
        </p>
      </div>
    </div>
  );
}
