'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { updateUser } from '@/lib/redux/slices/authSlice';
import AccountLayout from '@/components/account/AccountLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { toast, toastMessages } from '@/utils/toast';
import { FiUser, FiMail, FiPhone, FiCalendar, FiSave, FiCamera } from 'react-icons/fi';

function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const validateForm = () => {
    const errors: { name?: string; email?: string; phone?: string } = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    // Mock API call - In production, this would update backend
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch(updateUser(formData));
      toast.success(toastMessages.profile.updateSuccess);
      setIsEditing(false);
    } catch (error) {
      toast.error(toastMessages.profile.updateError);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setValidationErrors({});
    setIsEditing(false);
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
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information</p>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border-2 border-gray-200 hover:border-pink-300 transition-colors">
                <FiCamera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Avatar Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    validationErrors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    validationErrors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
              {user?.emailVerified && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  ✓ Email verified
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                  placeholder="9876543210"
                />
              </div>
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
              )}
            </div>

            {/* Account Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Account Information</h3>
              
              <div className="flex items-center gap-2 text-sm">
                <FiCalendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Member since:</span>
                <span className="font-medium text-gray-900">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <FiUser className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Account Type:</span>
                <span className="font-medium text-gray-900 capitalize">{user?.role || 'Customer'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 font-medium"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FiSave className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </AccountLayout>
  );
}

// Export with Protected Route
export default function ProtectedProfilePage() {
  return (
    <ProtectedRoute requireAuth>
      <ProfilePage />
    </ProtectedRoute>
  );
}
