'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import AccountLayout from '@/components/account/AccountLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { FiLock, FiBell, FiGlobe, FiDollarSign, FiTrash2, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast, toastMessages } from '@/utils/toast';

function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    email: {
      orderUpdates: true,
      promotions: true,
      newsletter: false,
    },
    sms: {
      orderUpdates: true,
      promotions: false,
    },
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'INR',
  });
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/account/settings');
    }
  }, [isAuthenticated, router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(toastMessages.auth.passwordChanged);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(toastMessages.auth.passwordChangeError);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleNotificationToggle = (category: 'email' | 'sms', type: string) => {
    const categoryNotifications = notifications[category];
    const currentValue = (categoryNotifications as any)[type];
    
    setNotifications({
      ...notifications,
      [category]: {
        ...categoryNotifications,
        [type]: !currentValue,
      },
    });
    toast.success(toastMessages.settings.notificationUpdated);
  };

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(toastMessages.settings.saveSuccess);
    } catch (error) {
      toast.error(toastMessages.settings.saveError);
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
    );

    if (!confirmed) return;

    const doubleConfirmed = confirm(
      'This is your last warning. Your account and all associated data will be permanently deleted. Are you absolutely sure?'
    );

    if (!doubleConfirmed) return;

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(toastMessages.account.deleteRequested);
      // In production, would redirect to logout or confirmation page
    } catch (error) {
      toast.error(toastMessages.account.deleteError);
    }
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
      <div className="space-y-6">
        {/* Password Change */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiLock className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="block w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="block w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">Must be at least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="block w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isChangingPassword ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Changing Password...</span>
                </>
              ) : (
                <>
                  <FiLock className="w-5 h-5" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiBell className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
          </div>

          <div className="space-y-6">
            {/* Email Notifications */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Email Notifications</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Order updates</span>
                  <input
                    type="checkbox"
                    checked={notifications.email.orderUpdates}
                    onChange={() => handleNotificationToggle('email', 'orderUpdates')}
                    className="w-5 h-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Promotions and offers</span>
                  <input
                    type="checkbox"
                    checked={notifications.email.promotions}
                    onChange={() => handleNotificationToggle('email', 'promotions')}
                    className="w-5 h-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Newsletter</span>
                  <input
                    type="checkbox"
                    checked={notifications.email.newsletter}
                    onChange={() => handleNotificationToggle('email', 'newsletter')}
                    className="w-5 h-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* SMS Notifications */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">SMS Notifications</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Order updates</span>
                  <input
                    type="checkbox"
                    checked={notifications.sms.orderUpdates}
                    onChange={() => handleNotificationToggle('sms', 'orderUpdates')}
                    className="w-5 h-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Promotions and offers</span>
                  <input
                    type="checkbox"
                    checked={notifications.sms.promotions}
                    onChange={() => handleNotificationToggle('sms', 'promotions')}
                    className="w-5 h-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h2>

          <div className="space-y-6 max-w-lg">
            {/* Language */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiGlobe className="w-4 h-4" />
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>

            {/* Currency */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiDollarSign className="w-4 h-4" />
                Currency
              </label>
              <select
                value={preferences.currency}
                onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              >
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
                <option value="GBP">£ GBP (British Pound)</option>
              </select>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSavePreferences}
              disabled={isSavingPreferences}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSavingPreferences ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiTrash2 className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-red-600">Delete Account</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Once you delete your account, there is no going back. All your data will be permanently removed.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </AccountLayout>
  );
}

// Export with Protected Route
export default function ProtectedSettingsPage() {
  return (
    <ProtectedRoute requireAuth>
      <SettingsPage />
    </ProtectedRoute>
  );
}
