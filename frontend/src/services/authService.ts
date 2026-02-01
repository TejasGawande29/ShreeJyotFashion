/**
 * Authentication Service
 * Handles all authentication-related API calls to the backend
 */

import { apiClient } from '@/lib/api';
import { User } from '@/lib/redux/slices/authSlice';

// ========================================
// Types
// ========================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface BackendUser {
  id: number;
  email: string;
  phone: string | null;
  role: 'customer' | 'admin';
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

// ========================================
// Helper: Transform Backend User to Frontend User
// ========================================

const transformBackendUser = (backendUser: BackendUser): User => {
  return {
    id: backendUser.id.toString(),
    name: backendUser.email.split('@')[0], // Default name from email
    email: backendUser.email,
    phone: backendUser.phone || undefined,
    role: backendUser.role,
    emailVerified: backendUser.email_verified,
    createdAt: backendUser.created_at,
  };
};

// ========================================
// Auth Service Functions
// ========================================

/**
 * Login user with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Backend response structure: { success: true, message: '...', data: { user, accessToken, refreshToken } }
    const { data } = response.data;
    
    if (!data || !data.user || !data.accessToken) {
      throw new Error('Invalid response from server');
    }

    // Transform backend user to frontend user format
    const user = transformBackendUser(data.user);

    // Store tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
    }

    return {
      user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (error: any) {
    // Network error (server not reachable)
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }

    // Backend error responses
    if (error.response) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      throw new Error(errorMessage);
    }

    // Other errors
    throw new Error(error.message || 'An unexpected error occurred. Please try again.');
  }
};

/**
 * Register new user
 */
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    
    const { data } = response.data;
    
    if (!data || !data.user || !data.accessToken) {
      throw new Error('Invalid response from server');
    }

    // Transform backend user to frontend user format
    const user = transformBackendUser(data.user);

    // Store tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
    }

    return {
      user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (error: any) {
    // Handle backend error responses
    const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
    throw new Error(errorMessage);
  }
};

/**
 * Get current logged-in user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get('/auth/me');
    
    const { data } = response.data;
    
    if (!data) {
      throw new Error('Invalid response from server');
    }

    return transformBackendUser(data);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch user data';
    throw new Error(errorMessage);
  }
};

/**
 * Logout user (clear local storage and optionally notify backend)
 */
export const logout = async (): Promise<void> => {
  try {
    // Optionally call backend logout endpoint if it exists
    // await apiClient.post('/auth/logout');
    
    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token'); // Legacy token key
    }
  } catch (error) {
    // Even if backend call fails, clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
    }
    console.error('Logout error:', error);
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refresh_token') 
      : null;

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/auth/refresh-token', {
      refreshToken: refreshToken,
    });

    const { data } = response.data;
    
    if (!data || !data.accessToken) {
      throw new Error('Invalid response from server');
    }

    // Update access token
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.accessToken);
    }

    return data.accessToken;
  } catch (error: any) {
    // If refresh fails, clear tokens and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
    throw new Error('Session expired. Please login again.');
  }
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Get stored auth token
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

/**
 * Forgot password - Send reset link to email
 */
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post('/auth/forgot-password', { email });
    
    const { message } = response.data;
    
    return {
      message: message || 'Password reset link sent to your email',
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to send password reset email';
    throw new Error(errorMessage);
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      password: newPassword,
    });
    
    const { message } = response.data;
    
    return {
      message: message || 'Password reset successfully',
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to reset password';
    throw new Error(errorMessage);
  }
};

/**
 * Verify email with token
 */
export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.get(`/auth/verify-email/${token}`);
    
    const { message } = response.data;
    
    return {
      message: message || 'Email verified successfully',
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to verify email';
    throw new Error(errorMessage);
  }
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post('/auth/resend-verification');
    
    const { message } = response.data;
    
    return {
      message: message || 'Verification email sent',
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to send verification email';
    throw new Error(errorMessage);
  }
};

/**
 * Change password (for logged-in users)
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    
    const { message } = response.data;
    
    return {
      message: message || 'Password changed successfully',
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to change password';
    throw new Error(errorMessage);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData: Partial<User>): Promise<User> => {
  try {
    const response = await apiClient.put('/profile', profileData);
    
    const { data } = response.data;
    
    if (!data) {
      throw new Error('Invalid response from server');
    }

    return transformBackendUser(data);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update profile';
    throw new Error(errorMessage);
  }
};

/**
 * Get user profile
 */
export const getProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get('/profile');
    
    const { data } = response.data;
    
    if (!data) {
      throw new Error('Invalid response from server');
    }

    return transformBackendUser(data);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
    throw new Error(errorMessage);
  }
};
