'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import { toast, toastMessages } from '@/utils/toast';
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validateEmail = () => {
    if (!email) {
      setValidationError('Email is required');
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Please enter a valid email');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);

    // Mock API call - In production, this would call your backend API
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful email send
      setEmailSent(true);
      toast.success(toastMessages.auth.passwordResetSent);
    } catch (err) {
      toast.error(toastMessages.auth.passwordResetError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(toastMessages.auth.emailResent);
    } catch (err) {
      toast.error(toastMessages.auth.emailSendError);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <AuthLayout 
        title="Check Your Email" 
        subtitle="We've sent you a password reset link"
      >
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FiCheck className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-gray-600">
            We've sent a password reset link to:
          </p>
          <p className="font-medium text-gray-900 mt-1">{email}</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            What's next?
          </h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Check your email inbox</li>
            <li>• Click the reset password link</li>
            <li>• Link expires in 1 hour</li>
            <li>• Check spam folder if you don't see it</li>
          </ul>
        </div>

        {/* Resend Email */}
        <button
          onClick={handleResendEmail}
          disabled={isLoading}
          className="w-full bg-white border-2 border-pink-600 text-pink-600 py-3 px-4 rounded-lg hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-600"></div>
              <span>Sending...</span>
            </>
          ) : (
            <span>Resend Email</span>
          )}
        </button>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>

        {/* Demo Notice */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800 font-medium mb-1">📧 Demo Mode</p>
          <p className="text-xs text-yellow-700">
            In production, this would send a real email with a reset link.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Forgot Password?" 
      subtitle="No worries, we'll send you reset instructions"
    >
      {/* Instruction */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationError('');
              }}
              className={`block w-full pl-10 pr-3 py-3 border ${
                validationError ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors`}
              placeholder="you@example.com"
            />
          </div>
          {validationError && (
            <p className="mt-1 text-sm text-red-600">{validationError}</p>
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
              <span>Sending...</span>
            </>
          ) : (
            <span>Send Reset Link</span>
          )}
        </button>
      </form>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>
      </div>

      {/* Demo Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 font-medium mb-2">🔒 Demo Mode</p>
        <p className="text-xs text-blue-700">
          This form will simulate sending a reset email. Backend integration required for production.
        </p>
      </div>
    </AuthLayout>
  );
}
