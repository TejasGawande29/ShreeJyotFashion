import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Backend API URL - matches backend server configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Try to refresh token
      if (typeof window !== 'undefined') {
        try {
          // Attempt token refresh (if your backend supports it)
          // const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
          //   headers: { Authorization: `Bearer ${localStorage.getItem('refreshToken')}` }
          // });
          
          // If refresh is successful:
          // const { token } = response.data;
          // localStorage.setItem('token', token);
          // processQueue(null, token);
          // isRefreshing = false;
          // return api(originalRequest);
          
          // For now, just logout (until refresh token is implemented in backend)
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          processQueue(error, null);
          isRefreshing = false;
          
          // Redirect to login
          if (!window.location.pathname.includes('/login')) {
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
          }
        } catch (err) {
          processQueue(err, null);
          isRefreshing = false;
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (!window.location.pathname.includes('/login')) {
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
          }
        }
      }
    }
    
    // Handle 403 Forbidden - No permission
    if (error.response?.status === 403) {
      console.error('Access forbidden - Insufficient permissions');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // Optionally show an error message or redirect
      }
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.config?.url);
    }
    
    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error - Please try again later');
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - Please check your connection');
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const apiClient = {
  // GET request
  get: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return api.get<T>(url, config);
  },
  
  // POST request
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return api.post<T>(url, data, config);
  },
  
  // PUT request
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return api.put<T>(url, data, config);
  },
  
  // PATCH request
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return api.patch<T>(url, data, config);
  },
  
  // DELETE request
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return api.delete<T>(url, config);
  },
};

// ========================================
// Authentication API
// ========================================

export const authAPI = {
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => apiClient.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),
  
  logout: () => apiClient.post('/auth/logout'),
  
  refreshToken: () => apiClient.post('/auth/refresh-token'),
  
  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),
  
  verifyEmail: (token: string) =>
    apiClient.get(`/auth/verify/${token}`),
  
  socialLogin: (provider: 'google' | 'facebook', token: string) =>
    apiClient.post(`/auth/${provider}`, { token }),
};

// ========================================
// Products API
// ========================================

export const productsAPI = {
  getAll: (params?: any) => apiClient.get('/products', { params }),
  
  getById: (id: number) => apiClient.get(`/products/${id}`),
  
  getBySlug: (slug: string) => apiClient.get(`/products/slug/${slug}`),
  
  getFeatured: () => apiClient.get('/products/featured'),
  
  getNew: () => apiClient.get('/products/new'),
  
  getBestsellers: () => apiClient.get('/products/bestsellers'),
  
  getRentalProducts: (params?: any) =>
    apiClient.get('/products/rental/available', { params }),
  
  checkRentalAvailability: (productId: number, startDate: string, endDate: string) =>
    apiClient.post('/products/rental/check-availability', {
      productId,
      startDate,
      endDate,
    }),
  
  search: (query: string, params?: any) =>
    apiClient.get('/products/search', { params: { q: query, ...params } }),
};

// ========================================
// Cart API
// ========================================

export const cartAPI = {
  get: () => apiClient.get('/cart'),
  
  add: (data: {
    productId: number;
    variantId?: number;
    quantity: number;
    type: 'sale' | 'rental';
    rentalStartDate?: string;
    rentalEndDate?: string;
  }) => apiClient.post('/cart/add', data),
  
  updateQuantity: (itemId: string, quantity: number) =>
    apiClient.put(`/cart/${itemId}`, { quantity }),
  
  remove: (itemId: string) => apiClient.delete(`/cart/${itemId}`),
  
  clear: () => apiClient.delete('/cart/clear'),
  
  applyCoupon: (code: string) => apiClient.post('/cart/coupon', { code }),
  
  removeCoupon: () => apiClient.delete('/cart/coupon'),
};

// ========================================
// Orders API
// ========================================

export const ordersAPI = {
  create: (data: any) => apiClient.post('/orders', data),
  
  getAll: (params?: any) => apiClient.get('/orders', { params }),
  
  getById: (id: number) => apiClient.get(`/orders/${id}`),
  
  cancel: (id: number, reason?: string) =>
    apiClient.post(`/orders/${id}/cancel`, { reason }),
  
  trackOrder: (orderNumber: string) =>
    apiClient.get(`/orders/track/${orderNumber}`),
};

// ========================================
// Rentals API (Unique Feature)
// ========================================

export const rentalsAPI = {
  book: (data: {
    productId: number;
    variantId?: number;
    startDate: string;
    endDate: string;
    addressId: number;
  }) => apiClient.post('/rentals/book', data),
  
  getMyRentals: (params?: any) => apiClient.get('/rentals/my-rentals', { params }),
  
  getById: (id: number) => apiClient.get(`/rentals/${id}`),
  
  cancel: (id: number, reason?: string) =>
    apiClient.post(`/rentals/${id}/cancel`, { reason }),
  
  extendRental: (id: number, newEndDate: string) =>
    apiClient.post(`/rentals/${id}/extend`, { newEndDate }),
};

// ========================================
// User API
// ========================================

export const userAPI = {
  getProfile: () => apiClient.get('/user/profile'),
  
  updateProfile: (data: any) => apiClient.put('/user/profile', data),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post('/user/change-password', { currentPassword, newPassword }),
  
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ========================================
// Addresses API
// ========================================

export const addressesAPI = {
  getAll: () => apiClient.get('/addresses'),
  
  getById: (id: number) => apiClient.get(`/addresses/${id}`),
  
  create: (data: any) => apiClient.post('/addresses', data),
  
  update: (id: number, data: any) => apiClient.put(`/addresses/${id}`, data),
  
  delete: (id: number) => apiClient.delete(`/addresses/${id}`),
  
  setDefault: (id: number) => apiClient.post(`/addresses/${id}/set-default`),
};

// ========================================
// Wishlist API
// ========================================

export const wishlistAPI = {
  getAll: () => apiClient.get('/wishlist'),
  
  add: (productId: number) => apiClient.post('/wishlist/add', { productId }),
  
  remove: (productId: number) => apiClient.delete(`/wishlist/${productId}`),
  
  check: (productId: number) => apiClient.get(`/wishlist/check/${productId}`),
};

// ========================================
// Reviews API
// ========================================

export const reviewsAPI = {
  getByProduct: (productId: number, params?: any) =>
    apiClient.get(`/reviews/product/${productId}`, { params }),
  
  create: (data: {
    productId: number;
    rating: number;
    title?: string;
    comment: string;
  }) => apiClient.post('/reviews', data),
  
  update: (id: number, data: any) => apiClient.put(`/reviews/${id}`, data),
  
  delete: (id: number) => apiClient.delete(`/reviews/${id}`),
  
  markHelpful: (id: number) => apiClient.post(`/reviews/${id}/helpful`),
};

// ========================================
// Categories API
// ========================================

export const categoriesAPI = {
  getAll: () => apiClient.get('/categories'),
  
  getById: (id: number) => apiClient.get(`/categories/${id}`),
  
  getBySlug: (slug: string) => apiClient.get(`/categories/slug/${slug}`),
  
  getTree: () => apiClient.get('/categories/tree'),
};

// ========================================
// Payments API
// ========================================

export const paymentsAPI = {
  createOrder: (data: { orderId?: number; rentalId?: number; amount: number }) =>
    apiClient.post('/payments/create-order', data),
  
  verifyPayment: (data: {
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }) => apiClient.post('/payments/verify', data),
};

// ========================================
// Coupons API
// ========================================

export const couponsAPI = {
  validate: (code: string, cartTotal: number) =>
    apiClient.post('/coupons/validate', { code, cartTotal }),
};

export default api;
