'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { verifyEmail } from '@/lib/redux/slices/authSlice';
import AuthLayout from '@/components/auth/AuthLayout';
import { toast, toastMessages } from '@/utils/toast';
import { FiMail, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';

function VerifyEmailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');

  const handleVerification = useCallback(async (verificationToken: string) => {
    setIsVerifying(true);
    setVerificationStatus('pending');

    // Mock API call - In production, this would call your backend API
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful verification
      dispatch(verifyEmail());
      setVerificationStatus('success');
      toast.success(toastMessages.auth.emailVerified);

      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch {
      setVerificationStatus('error');
      toast.error(toastMessages.auth.emailVerifyError);
    } finally {
      setIsVerifying(false);
    }
  }, [dispatch, router]);

  // Extract email and token from URL
  useEffect(() => {
    const emailParam = searchParams?.get('email');
    const tokenParam = searchParams?.get('token');

    if (emailParam) {
      setEmail(emailParam);
    } else if (user?.email) {
      setEmail(user.email);
    }

    if (tokenParam) {
      // Auto-verify if token is present
      handleVerification(tokenParam);
    }
  }, [searchParams, user, handleVerification]);

  const handleResendEmail = async () => {
    setIsResending(true);

    // Mock API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(toastMessages.auth.emailSent);
    } catch {
      toast.error(toastMessages.auth.emailSendError);
    } finally {
      setIsResending(false);
    }
  };

  // Auto-verifying state
  if (isVerifying) {
    return (
      <AuthLayout 
        title="Verifying Email" 
        subtitle="Please wait while we verify your email address"
      >
        {/* Loading Icon */}
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FiLoader className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          <p className="text-gray-600">
            Verifying your email address...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>

        <p className="text-sm text-gray-500 text-center">
          This should only take a moment...
        </p>
      </AuthLayout>
    );
  }

  // Success state
  if (verificationStatus === 'success') {
    return (
      <AuthLayout 
        title="Email Verified!" 
        subtitle="Your email has been successfully verified"
      >
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FiCheck className="w-10 h-10 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-green-900 mb-2">
            ✓ Email verified successfully
          </h3>
          <p className="text-sm text-green-800">
            Your account is now fully activated. You can start shopping!
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => router.push('/')}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 font-medium"
        >
          Continue Shopping
        </button>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Redirecting to homepage in 3 seconds...
        </p>
      </AuthLayout>
    );
  }

  // Error state
  if (verificationStatus === 'error') {
    return (
      <AuthLayout 
        title="Verification Failed" 
        subtitle="We couldn't verify your email address"
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
            Verification link expired or invalid
          </h3>
          <ul className="space-y-1 text-sm text-red-800">
            <li>• Verification links expire after 24 hours</li>
            <li>• Each link can only be used once</li>
            <li>• Make sure you copied the full URL</li>
          </ul>
        </div>

        {/* Resend Email Button */}
        <button
          onClick={handleResendEmail}
          disabled={isResending}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isResending ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Sending...</span>
            </>
          ) : (
            <span>Resend Verification Email</span>
          )}
        </button>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Skip for now & continue to homepage
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // Pending state (no token in URL)
  return (
    <AuthLayout 
      title="Verify Your Email" 
      subtitle="Check your inbox for the verification link"
    >
      {/* Email Icon */}
      <div className="text-center mb-6">
        <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <FiMail className="w-10 h-10 text-blue-600" />
        </div>
        <p className="text-gray-600">
          We've sent a verification email to:
        </p>
        <p className="font-medium text-gray-900 mt-1">{email || 'your email'}</p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          What's next?
        </h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• Check your email inbox</li>
          <li>• Click the verification link</li>
          <li>• Link expires in 24 hours</li>
          <li>• Check spam folder if you don't see it</li>
        </ul>
      </div>

      {/* Resend Email */}
      <button
        onClick={handleResendEmail}
        disabled={isResending}
        className="w-full bg-white border-2 border-pink-600 text-pink-600 py-3 px-4 rounded-lg hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isResending ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-600"></div>
            <span>Sending...</span>
          </>
        ) : (
          <span>Resend Verification Email</span>
        )}
      </button>

      {/* Skip */}
      <div className="mt-6 text-center">
        <Link 
          href="/" 
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Skip for now & continue to homepage
        </Link>
      </div>

      {/* Demo Notice */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800 font-medium mb-1">📧 Demo Mode</p>
        <p className="text-xs text-yellow-700">
          Email verification is simulated. In production, you'd receive a real email.
        </p>
      </div>
    </AuthLayout>
  );
}

function VerifyEmailLoading() {
  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Loading..."
    >
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
