/**
 * Standardized Toast Notification Utility
 * 
 * This utility provides consistent toast notifications across the application.
 * All toast messages should use this utility instead of react-hot-toast directly.
 * 
 * @example
 * ```typescript
 * import { toast, toastMessages } from '@/utils/toast';
 * 
 * // Using predefined messages
 * toast.success(toastMessages.auth.loginSuccess);
 * 
 * // Using custom messages
 * toast.success('Custom success message', '🎉');
 * toast.error('Something went wrong');
 * ```
 */

import { toast as hotToast, ToastOptions } from 'react-hot-toast';

// Default durations (in milliseconds)
const DURATIONS = {
  success: 3000,
  error: 4000,
  loading: Infinity,
  info: 3000,
};

// Toast utility with standardized options
export const toast = {
  /**
   * Success toast - Use for successful operations
   * @param message - The message to display
   * @param emoji - Optional emoji (defaults based on message type)
   * @param options - Optional toast options
   */
  success: (message: string, emoji?: string, options?: ToastOptions) => {
    const formattedMessage = emoji ? `${message} ${emoji}` : message;
    return hotToast.success(formattedMessage, {
      duration: DURATIONS.success,
      ...options,
    });
  },

  /**
   * Error toast - Use for error messages
   * @param message - The error message to display
   * @param emoji - Optional emoji (defaults based on message type)
   * @param options - Optional toast options
   */
  error: (message: string, emoji?: string, options?: ToastOptions) => {
    return hotToast.error(message, {
      duration: DURATIONS.error,
      icon: emoji,
      ...options,
    });
  },

  /**
   * Loading toast - Use for async operations
   * @param message - The loading message to display
   * @param options - Optional toast options
   */
  loading: (message: string, options?: ToastOptions) => {
    return hotToast.loading(message, {
      duration: DURATIONS.loading,
      ...options,
    });
  },

  /**
   * Info toast - Use for informational messages
   * @param message - The info message to display
   * @param emoji - Optional emoji (defaults to 'ℹ️')
   * @param options - Optional toast options
   */
  info: (message: string, emoji?: string, options?: ToastOptions) => {
    return hotToast(message, {
      duration: DURATIONS.info,
      icon: emoji || 'ℹ️',
      ...options,
    });
  },

  /**
   * Dismiss a toast
   * @param toastId - Optional toast ID to dismiss specific toast
   */
  dismiss: (toastId?: string) => {
    return hotToast.dismiss(toastId);
  },

  /**
   * Promise toast - Use for async operations with success/error states
   */
  promise: hotToast.promise,

  /**
   * Custom toast - Use for complete customization
   */
  custom: hotToast.custom,
};

/**
 * Predefined toast messages for consistency across the app
 * 
 * Usage:
 * ```typescript
 * import { toast, toastMessages } from '@/utils/toast';
 * toast.success(toastMessages.auth.loginSuccess);
 * ```
 */
export const toastMessages = {
  // Authentication messages
  auth: {
    loginSuccess: 'Welcome back! 🎉',
    logoutSuccess: 'Logged out successfully! 👋',
    registerSuccess: 'Account created successfully! 🎉',
    registerWelcome: 'Account created! Please log in to continue. 🎉',
    passwordChanged: 'Password changed successfully! 🔒',
    passwordResetSent: 'Password reset email sent! 📧',
    passwordResetSuccess: 'Password reset successfully! 🎉',
    emailVerified: 'Email verified successfully! ✅',
    emailSent: 'Verification email sent! 📧',
    emailResent: 'Email sent again! 📧',
    
    // Error messages
    loginError: 'Login failed. Please check your credentials.',
    registerError: 'Registration failed. Please try again.',
    passwordChangeError: 'Failed to change password. Please try again.',
    passwordResetError: 'Failed to send reset email. Please try again.',
    emailVerifyError: 'Verification failed. Please try again.',
    emailSendError: 'Failed to send email. Please try again.',
    unauthorized: 'Please log in to continue.',
    sessionExpired: 'Your session has expired. Please log in again.',
  },

  // Profile messages
  profile: {
    updateSuccess: 'Profile updated successfully! 🎉',
    updateError: 'Failed to update profile. Please try again.',
    avatarUpdateSuccess: 'Profile picture updated! 📸',
    avatarUpdateError: 'Failed to update profile picture.',
  },

  // Cart messages
  cart: {
    addSuccess: 'Added to cart! 🛒',
    removeSuccess: 'Removed from cart',
    updateSuccess: 'Cart updated',
    clearSuccess: 'Cart cleared',
    quantityUpdated: 'Quantity updated',
    
    // Error messages
    addError: 'Failed to add to cart',
    removeError: 'Failed to remove from cart',
    updateError: 'Failed to update cart',
  },

  // Wishlist messages
  wishlist: {
    addSuccess: 'Added to wishlist! ❤️',
    removeSuccess: 'Removed from wishlist',
    clearSuccess: 'Wishlist cleared',
    movedToCart: 'Moved to cart! 🛒',
    
    // Error messages
    addError: 'Failed to add to wishlist',
    removeError: 'Failed to remove from wishlist',
  },

  // Order messages
  order: {
    placeSuccess: 'Order placed successfully! 🎉',
    cancelSuccess: 'Order cancelled',
    returnSuccess: 'Return requested successfully',
    
    // Error messages
    placeError: 'Failed to place order. Please try again.',
    cancelError: 'Failed to cancel order',
    returnError: 'Failed to request return',
  },

  // Settings messages
  settings: {
    saveSuccess: 'Settings saved successfully! ⚙️',
    saveError: 'Failed to save settings. Please try again.',
    preferencesUpdated: 'Preferences updated',
    notificationUpdated: 'Notification preferences updated',
  },

  // Address messages
  address: {
    addSuccess: 'Address added successfully! 📍',
    updateSuccess: 'Address updated successfully! 📍',
    deleteSuccess: 'Address deleted',
    setDefaultSuccess: 'Default address updated',
    
    // Error messages
    addError: 'Failed to add address',
    updateError: 'Failed to update address',
    deleteError: 'Failed to delete address',
  },

  // Newsletter messages
  newsletter: {
    subscribeSuccess: 'Thank you for subscribing! 📧',
    subscribeError: 'Failed to subscribe. Please try again.',
    unsubscribeSuccess: 'Unsubscribed successfully',
  },

  // Review messages
  review: {
    submitSuccess: 'Review submitted successfully! ⭐',
    updateSuccess: 'Review updated successfully! ⭐',
    deleteSuccess: 'Review deleted',
    
    // Error messages
    submitError: 'Failed to submit review',
    updateError: 'Failed to update review',
    deleteError: 'Failed to delete review',
  },

  // Payment messages
  payment: {
    success: 'Payment successful! 🎉',
    failed: 'Payment failed. Please try again.',
    processing: 'Processing payment...',
    cardAdded: 'Payment method added',
    cardRemoved: 'Payment method removed',
  },

  // Rental messages
  rental: {
    addSuccess: 'Rental booking added to cart! 📅',
    bookSuccess: 'Rental booked successfully! 🎉',
    cancelSuccess: 'Rental cancelled',
    extendSuccess: 'Rental extended',
    
    // Error messages
    bookError: 'Failed to book rental',
    cancelError: 'Failed to cancel rental',
    extendError: 'Failed to extend rental',
  },

  // Search messages
  search: {
    noResults: 'No results found',
    loading: 'Searching...',
  },

  // Account deletion
  account: {
    deleteRequested: 'Account deletion requested. You will receive a confirmation email.',
    deleteError: 'Failed to delete account. Please try again.',
  },

  // Generic messages
  generic: {
    saveSuccess: 'Saved successfully! ✅',
    saveError: 'Failed to save. Please try again.',
    deleteSuccess: 'Deleted successfully',
    deleteError: 'Failed to delete. Please try again.',
    updateSuccess: 'Updated successfully! ✅',
    updateError: 'Failed to update. Please try again.',
    loading: 'Loading...',
    processing: 'Processing...',
    copied: 'Copied to clipboard! 📋',
    invalidInput: 'Please check your input and try again.',
    networkError: 'Network error. Please check your connection.',
    serverError: 'Server error. Please try again later.',
  },
};

/**
 * Toast helper for async operations
 * 
 * @example
 * ```typescript
 * await toastAsync(
 *   apiCall(),
 *   'Saving...',
 *   toastMessages.profile.updateSuccess,
 *   toastMessages.profile.updateError
 * );
 * ```
 */
export const toastAsync = async <T,>(
  promise: Promise<T>,
  loadingMessage: string,
  successMessage: string,
  errorMessage: string
): Promise<T> => {
  return hotToast.promise(promise, {
    loading: loadingMessage,
    success: successMessage,
    error: errorMessage,
  });
};

/**
 * Toast position options
 */
export const toastPositions = {
  topLeft: 'top-left',
  topCenter: 'top-center',
  topRight: 'top-right',
  bottomLeft: 'bottom-left',
  bottomCenter: 'bottom-center',
  bottomRight: 'bottom-right',
} as const;

export default toast;
