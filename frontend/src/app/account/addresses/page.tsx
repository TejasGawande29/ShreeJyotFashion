'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import AccountLayout from '@/components/account/AccountLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

// Mock addresses data
const initialAddresses = [
  {
    id: '1',
    name: 'John Doe',
    phone: '9876543210',
    address: '123, MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    type: 'home' as const,
    isDefault: true,
  },
  {
    id: '2',
    name: 'John Doe',
    phone: '9876543210',
    address: '456, Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    type: 'work' as const,
    isDefault: false,
  },
  {
    id: '3',
    name: 'Jane Doe',
    phone: '9123456789',
    address: '789, Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    type: 'other' as const,
    isDefault: false,
  },
];

type AddressType = 'home' | 'work' | 'other';

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  type: AddressType;
  isDefault: boolean;
}

function AddressesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home',
    isDefault: false,
  });
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof Omit<Address, 'id'>, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/account/addresses');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const errors: Partial<Record<keyof Omit<Address, 'id'>, string>> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Enter a valid 10-digit phone number';
    }

    if (!formData.address || formData.address.trim().length < 5) {
      errors.address = 'Address must be at least 5 characters';
    }

    if (!formData.city || formData.city.trim().length < 2) {
      errors.city = 'City is required';
    }

    if (!formData.state || formData.state.trim().length < 2) {
      errors.state = 'State is required';
    }

    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = 'Enter a valid 6-digit pincode';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation error for this field
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors({
        ...validationErrors,
        [name]: undefined,
      });
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      type: 'home',
      isDefault: false,
    });
    setValidationErrors({});
    setShowForm(true);
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      type: address.type,
      isDefault: address.isDefault,
    });
    setValidationErrors({});
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingId) {
        // Update existing address
        setAddresses(addresses.map(addr => 
          addr.id === editingId ? { ...formData, id: editingId } : addr
        ));
        toast.success('Address updated successfully! 🎉');
      } else {
        // Add new address
        const newAddress: Address = {
          ...formData,
          id: Date.now().toString(),
        };
        setAddresses([...addresses, newAddress]);
        toast.success('Address added successfully! 🎉');
      }

      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      toast.error('Failed to save address');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const address = addresses.find(a => a.id === id);
    
    if (address?.isDefault) {
      toast.error('Cannot delete default address. Set another address as default first.');
      return;
    }

    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAddresses(addresses.filter(addr => addr.id !== id));
      toast.success('Address deleted successfully');
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      })));
      toast.success('Default address updated');
    } catch (error) {
      toast.error('Failed to update default address');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setValidationErrors({});
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <AccountLayout>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
            <p className="text-gray-600 mt-1">Manage your delivery addresses</p>
          </div>
          {!showForm && (
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Address</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {showForm ? (
            /* Address Form */
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h2>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-3 border ${
                    validationErrors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none`}
                  placeholder="John Doe"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-3 border ${
                    validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none`}
                  placeholder="9876543210"
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-3 border ${
                    validationErrors.address ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none`}
                  placeholder="House No, Street, Area"
                />
                {validationErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
                )}
              </div>

              {/* City and State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-3 border ${
                      validationErrors.city ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none`}
                    placeholder="Bangalore"
                  />
                  {validationErrors.city && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-3 border ${
                      validationErrors.state ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none`}
                    placeholder="Karnataka"
                  />
                  {validationErrors.state && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.state}</p>
                  )}
                </div>
              </div>

              {/* Pincode and Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-3 border ${
                      validationErrors.pincode ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none`}
                    placeholder="560001"
                  />
                  {validationErrors.pincode && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.pincode}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Address Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-5 h-5" />
                      <span>{editingId ? 'Update' : 'Save'} Address</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Addresses List */
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="text-center py-12">
                  <FiMapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h3>
                  <p className="text-gray-600 mb-6">Add your first delivery address</p>
                  <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    <FiPlus className="w-5 h-5" />
                    Add Address
                  </button>
                </div>
              ) : (
                addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border-2 rounded-lg p-6 transition-all duration-200 ${
                      address.isDefault 
                        ? 'border-pink-300 bg-pink-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Address Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{address.name}</h3>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize">
                            {address.type}
                          </span>
                          {address.isDefault && (
                            <span className="px-3 py-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-medium rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-1">{address.address}</p>
                        <p className="text-gray-700 mb-1">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-gray-600 text-sm">Phone: {address.phone}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(address)}
                          className="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                          title="Edit Address"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Address"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Set Default Button */}
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="mt-4 text-sm text-pink-600 hover:text-pink-700 font-medium"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </AccountLayout>
  );
}

// Export with Protected Route
export default function ProtectedAddressesPage() {
  return (
    <ProtectedRoute requireAuth>
      <AddressesPage />
    </ProtectedRoute>
  );
}
