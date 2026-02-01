'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';
import { toast, toastMessages } from '@/utils/toast';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiAlertCircle } from 'react-icons/fi';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  // Extract token and email from URL
  useEffect(() => {
    const tokenParam = searchParams?.get('token');
    const emailParam = searchParams?.get('email');

    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
      // In production, validate token with backend here
    } else {
      setTokenValid(false);
    }
  }, [searchParams]);

  const validateForm = () => {
    const errors: { password?: string; confirmPassword?: string } = {};

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Mock API call - In production, this would call your backend API
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful password reset
      setResetSuccess(true);
      toast.success(toastMessages.auth.passwordResetSuccess);
    } catch (err) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

  // Invalid Token UI
  if (!tokenValid) {
    return (
      <AuthLayout 
        title="Invalid Reset Link" 
        subtitle="This password reset link is invalid or has expired"
      >
        {/* Error Icon */}
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FiAlertCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-red-900 mb-2">
            Link expired or invalid
          </h3>
          <ul className="space-y-1 text-sm text-red-800">
            <li>• Password reset links expire after 1 hour</li>
            <li>• Each link can only be used once</li>
            <li>• Make sure you copied the full URL</li>
          </ul>
        </div>

        {/* Request New Link */}
        <Link
          href="/forgot-password"
          className="w-full block text-center bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 font-medium"
        >
          Request New Reset Link
        </Link>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link 
            href="/login" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // Success UI
  if (resetSuccess) {
    return (
      <AuthLayout 
        title="Password Reset!" 
        subtitle="Your password has been successfully changed"
      >
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FiCheck className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-gray-600">
            You can now sign in with your new password
          </p>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-green-900 mb-2">
            ✓ Password updated successfully
          </h3>
          <p className="text-sm text-green-800">
            Your password has been changed. Use your new password to sign in.
          </p>
        </div>

        {/* Sign In Button */}
        <button
          onClick={() => router.push('/login')}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 font-medium"
        >
          Sign In Now
        </button>
      </AuthLayout>
    );
  }

  // Reset Password Form
  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your new password"
    >
      {/* Email Display */}
      {email && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Resetting password for:{' '}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.password}
              onChange={handleInputChange}
              className={`block w-full pl-10 pr-12 py-3 border ${
                validationErrors.password ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
          )}
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-3">
              <PasswordStrengthIndicator password={formData.password} />
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`block w-full pl-10 pr-12 py-3 border ${
                validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Resetting password...</span>
            </>
          ) : (
            <span>Reset Password</span>
          )}
        </button>
      </form>

      {/* Demo Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 font-medium mb-2">🔒 Demo Mode</p>
        <p className="text-xs text-blue-700">
          Password reset will work locally. Backend integration required for production.
        </p>
      </div>
    </AuthLayout>
  );
}
