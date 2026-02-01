'use client';

import React, { useState } from 'react';
import { FiCreditCard, FiDollarSign, FiSmartphone, FiCheckCircle } from 'react-icons/fi';
import { SiGooglepay, SiPaytm, SiPhonepe } from 'react-icons/si';
import type { PaymentDetails } from '@/lib/redux/slices/checkoutSlice';

interface PaymentFormProps {
  initialData?: PaymentDetails | null;
  onSubmit: (data: PaymentDetails) => void;
  onBack?: () => void;
}

type PaymentMethod = 'cod' | 'card' | 'upi' | 'netbanking';

export default function PaymentForm({ initialData, onSubmit, onBack }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    initialData?.method || 'cod'
  );
  const [formData, setFormData] = useState({
    cardNumber: initialData?.cardNumber || '',
    cardName: initialData?.cardName || '',
    cardExpiry: initialData?.cardExpiry || '',
    cardCVV: initialData?.cardCVV || '',
    upiId: initialData?.upiId || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentMethods = [
    {
      id: 'cod' as PaymentMethod,
      name: 'Cash on Delivery',
      icon: FiDollarSign,
      description: 'Pay when you receive the order',
      popular: true,
    },
    {
      id: 'card' as PaymentMethod,
      name: 'Credit/Debit Card',
      icon: FiCreditCard,
      description: 'Visa, Mastercard, Rupay, Amex',
      popular: false,
    },
    {
      id: 'upi' as PaymentMethod,
      name: 'UPI Payment',
      icon: FiSmartphone,
      description: 'Google Pay, PhonePe, Paytm',
      popular: true,
    },
    {
      id: 'netbanking' as PaymentMethod,
      name: 'Net Banking',
      icon: FiCheckCircle,
      description: 'All major banks supported',
      popular: false,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '');
      const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
      setFormData({ ...formData, [name]: formatted });
    }
    // Format expiry as MM/YY
    else if (name === 'cardExpiry') {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      if (cleaned.length >= 2) {
        formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      }
      setFormData({ ...formData, [name]: formatted });
    }
    // Limit CVV to 3-4 digits
    else if (name === 'cardCVV') {
      const cleaned = value.replace(/\D/g, '').slice(0, 4);
      setFormData({ ...formData, [name]: cleaned });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return false;
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  const validateExpiry = (expiry: string): boolean => {
    const [month, year] = expiry.split('/');
    if (!month || !year) return false;
    
    const monthNum = parseInt(month);
    const yearNum = parseInt('20' + year);
    
    if (monthNum < 1 || monthNum > 12) return false;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (yearNum < currentYear) return false;
    if (yearNum === currentYear && monthNum < currentMonth) return false;
    
    return true;
  };

  const validateUPI = (upiId: string): boolean => {
    // UPI ID format: username@provider
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (selectedMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!validateCardNumber(formData.cardNumber)) {
        newErrors.cardNumber = 'Invalid card number';
      }

      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Cardholder name is required';
      }

      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = 'Expiry date is required';
      } else if (!validateExpiry(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Invalid or expired date';
      }

      if (!formData.cardCVV.trim()) {
        newErrors.cardCVV = 'CVV is required';
      } else if (formData.cardCVV.length < 3) {
        newErrors.cardCVV = 'CVV must be 3-4 digits';
      }
    }

    if (selectedMethod === 'upi') {
      if (!formData.upiId.trim()) {
        newErrors.upiId = 'UPI ID is required';
      } else if (!validateUPI(formData.upiId)) {
        newErrors.upiId = 'Invalid UPI ID format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const paymentData: PaymentDetails = {
      method: selectedMethod,
      cardNumber: selectedMethod === 'card' ? formData.cardNumber : undefined,
      cardName: selectedMethod === 'card' ? formData.cardName : undefined,
      cardExpiry: selectedMethod === 'card' ? formData.cardExpiry : undefined,
      cardCVV: selectedMethod === 'card' ? formData.cardCVV : undefined,
      upiId: selectedMethod === 'upi' ? formData.upiId : undefined,
    };

    onSubmit(paymentData);
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Payment Method
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                className={`relative p-4 border-2 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {method.popular && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-pink-500 text-white text-xs font-semibold rounded">
                    Popular
                  </span>
                )}
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{method.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                  </div>
                  {isSelected && (
                    <FiCheckCircle className="w-6 h-6 text-pink-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Details Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Payment Details */}
        {selectedMethod === 'card' && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h4 className="font-semibold text-gray-900 mb-4">Card Details</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                placeholder="Name on card"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  errors.cardName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardName && (
                <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cardExpiry && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  name="cardCVV"
                  value={formData.cardCVV}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    errors.cardCVV ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cardCVV && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardCVV}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <FiCheckCircle className="w-5 h-5 text-blue-500" />
              <span>Your card details are encrypted and secure</span>
            </div>
          </div>
        )}

        {/* UPI Payment Details */}
        {selectedMethod === 'upi' && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h4 className="font-semibold text-gray-900 mb-4">UPI Details</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID *
              </label>
              <input
                type="text"
                name="upiId"
                value={formData.upiId}
                onChange={handleInputChange}
                placeholder="yourname@upi"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  errors.upiId ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.upiId && (
                <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>
              )}
            </div>

            <div className="flex items-center space-x-4 mt-4">
              <span className="text-sm text-gray-600">Supported UPI Apps:</span>
              <div className="flex items-center space-x-3">
                <SiGooglepay className="w-6 h-6 text-blue-600" />
                <SiPhonepe className="w-6 h-6 text-purple-600" />
                <SiPaytm className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
        )}

        {/* COD Info */}
        {selectedMethod === 'cod' && (
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-start space-x-3">
              <FiCheckCircle className="w-6 h-6 text-green-500 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Cash on Delivery Selected
                </h4>
                <p className="text-sm text-gray-600">
                  Pay when you receive your order. Please keep exact change handy for a smooth delivery experience.
                </p>
                <div className="mt-3 text-sm text-gray-700">
                  <p>✓ No prepayment required</p>
                  <p>✓ Pay directly to delivery partner</p>
                  <p>✓ Cash payment only (cards not accepted at delivery)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Net Banking Info */}
        {selectedMethod === 'netbanking' && (
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-start space-x-3">
              <FiCheckCircle className="w-6 h-6 text-blue-500 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Net Banking Payment
                </h4>
                <p className="text-sm text-gray-600">
                  You will be redirected to your bank's secure payment gateway to complete the transaction.
                </p>
                <div className="mt-3 text-sm text-gray-700">
                  <p>✓ All major banks supported</p>
                  <p>✓ Secure bank gateway</p>
                  <p>✓ Instant payment confirmation</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Back to Shipping
            </button>
          )}
          <button
            type="submit"
            className="flex-1 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors font-semibold"
          >
            Continue to Review
          </button>
        </div>
      </form>
    </div>
  );
}
