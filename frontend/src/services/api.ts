/**
 * API Service Layer
 * 
 * Central Axios configuration for all API calls.
 * Handles authentication, error handling, and token refresh.
 */

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getToken, setToken, getRefreshToken, removeToken } from '@/utils/tokenManager';

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
      console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Log error in development
    if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
      console.error('❌ API Error:', error.response?.status, error.response?.data);
    }
    
    // Token expired - attempt to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getRefreshToken();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Call refresh token endpoint
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          { refreshToken }
        );
        
        // Save new access token
        setToken(data.accessToken);
        
        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        console.error('Token refresh failed:', refreshError);
        removeToken();
        
        // Redirect to login (only in browser)
        if (typeof window !== 'undefined') {
          window.location.href = '/login?session=expired';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Helper function to extract error message from API response
 */
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Helper function to check if error is a network error
 */
export const isNetworkError = (error: any): boolean => {
  return error.code === 'ERR_NETWORK' || error.message === 'Network Error';
};

/**
 * API Response wrapper type
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export default api;
