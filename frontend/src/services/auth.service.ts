/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls:
 * - Login, Register, Logout
 * - Password reset, Email verification
 * - Token refresh
 */

import api, { getErrorMessage } from './api';
import { setToken, setRefreshToken, setStoredUser, removeToken } from '@/utils/tokenManager';

// ====================================
// Types
// ====================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'admin' | 'vendor';
  isVerified: boolean;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ====================================
// Authentication Service
// ====================================

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);
      
      // Store tokens and user data
      if (data.accessToken) {
        setToken(data.accessToken);
      }
      if (data.refreshToken) {
        setRefreshToken(data.refreshToken);
      }
      if (data.user) {
        setStoredUser(data.user);
      }
      
      return data;
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', userData);
      return data;
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      // Always clear local storage
      removeToken();
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const { data } = await api.get<{ user: User }>('/auth/me');
      
      // Update stored user data
      if (data.user) {
        setStoredUser(data.user);
      }
      
      return data.user;
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const { data } = await api.post<{ accessToken: string }>('/auth/refresh-token', {
        refreshToken,
      });
      
      // Store new access token
      if (data.accessToken) {
        setToken(data.accessToken);
      }
      
      return data;
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const { data } = await api.post<{ message: string }>('/auth/forgot-password', {
        email,
      });
      return data;
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const { data } = await api.post<{ message: string }>('/auth/reset-password', {
        token,
        newPassword,
      });
      return data;
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ message: string; user?: User }> {
    try {
      const { data } = await api.post<{ message: string; user?: User }>('/auth/verify-email', {
        token,
      });
      
      // Update stored user if returned
      if (data.user) {
        setStoredUser(data.user);
      }
      
      return data;
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    try {
      const { data } = await api.post<{ message: string }>('/auth/resend-verification', {
        email,
      });
      return data;
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Change password (for logged-in users)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      const { data } = await api.put<{ message: string }>('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return data;
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Check if email is available
   */
  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    try {
      const { data } = await api.post<{ available: boolean }>('/auth/check-email', {
        email,
      });
      return data;
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default authService;
