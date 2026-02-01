import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { ShippingAddress } from '@/lib/redux/slices/checkoutSlice';
import { FiMapPin, FiCheck } from 'react-icons/fi';

interface ShippingFormProps {
  initialData?: ShippingAddress | null;
  savedAddresses?: ShippingAddress[];
  onSubmit: (data: ShippingAddress) => void;
  onBack?: () => void;
}

export function ShippingForm({ initialData, savedAddresses = [], onSubmit, onBack }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [showSavedAddresses, setShowSavedAddresses] = useState(savedAddresses.length > 0);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof ShippingAddress]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectSavedAddress = (address: ShippingAddress) => {
    setFormData(address);
    setShowSavedAddresses(false);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Saved Addresses */}
      {showSavedAddresses && savedAddresses.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>
            <button
              type="button"
              onClick={() => setShowSavedAddresses(false)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              + Add New Address
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedAddresses.map((address, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSavedAddress(address)}
                className="relative p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 transition-colors text-left group"
              >
                {address.isDefault && (
                  <span className="absolute top-2 right-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                    <FiCheck className="w-3 h-3 mr-1" />
                    Default
                  </span>
                )}
                <div className="flex items-start space-x-3">
                  <FiMapPin className="w-5 h-5 text-gray-400 group-hover:text-primary-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{address.fullName}</p>
                    <p className="text-sm text-gray-600 mt-1">{address.addressLine1}</p>
                    {address.addressLine2 && <p className="text-sm text-gray-600">{address.addressLine2}</p>}
                    <p className="text-sm text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
                    <p className="text-sm text-gray-500 mt-1">{address.phone}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowSavedAddresses(false)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              or enter a new shipping address
            </button>
          </div>
        </div>
      )}

      {/* Shipping Form */}
      {(!showSavedAddresses || savedAddresses.length === 0) && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`input ${errors.fullName ? 'border-red-500' : ''}`}
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="9876543210"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
            
            <div className="space-y-4">
              {/* Address Line 1 */}
              <div>
                <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className={`input ${errors.addressLine1 ? 'border-red-500' : ''}`}
                  placeholder="House/Flat No., Building Name"
                />
                {errors.addressLine1 && <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p>}
              </div>

              {/* Address Line 2 */}
              <div>
                <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="input"
                  placeholder="Street, Landmark"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`input ${errors.city ? 'border-red-500' : ''}`}
                    placeholder="Mumbai"
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>

                {/* State */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`input ${errors.state ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                </div>

                {/* Pincode */}
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={`input ${errors.pincode ? 'border-red-500' : ''}`}
                    placeholder="400001"
                    maxLength={6}
                  />
                  {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
                </div>
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  readOnly
                  className="input bg-gray-50"
                />
              </div>

              {/* Save as Default */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                  Save as default address
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            {onBack && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
              >
                Back to Cart
              </Button>
            )}
            <div className={onBack ? '' : 'ml-auto'}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default ShippingForm;
