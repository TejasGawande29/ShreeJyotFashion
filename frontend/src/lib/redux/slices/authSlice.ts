import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as authService from '@/services/authService';
import type { LoginCredentials, RegisterData } from '@/services/authService';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  emailVerified: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
};

// ========================================
// Async Thunks
// ========================================

/**
 * Login user
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

/**
 * Register new user
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

/**
 * Fetch current user profile
 */
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

/**
 * Update user profile
 */
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      const user = await authService.updateProfile(profileData);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

/**
 * Logout user
 */
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

/**
 * Forgot password
 */
export const forgotPasswordAction = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      return response.message;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send reset email');
    }
  }
);

/**
 * Reset password
 */
export const resetPasswordAction = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }: { token: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(token, password);
      return response.message;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to reset password');
    }
  }
);

/**
 * Change password
 */
export const changePasswordAction = createAsyncThunk(
  'auth/changePassword',
  async (
    { currentPassword, newPassword }: { currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      return response.message;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to change password');
    }
  }
);

// ========================================
// Auth Slice
// ========================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Load user from localStorage on app startup
    loadUserFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            state.token = token;
            state.user = user;
            state.isAuthenticated = true;
          } catch (error) {
            console.error('Failed to parse user from localStorage:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
          }
        }
      }
    },

    // Update user (optimistic update)
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      }
    },

    // Verify email
    verifyEmail: (state) => {
      if (state.user) {
        state.user.emailVerified = true;
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Manual logout (for use in other parts of the app)
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
    },
  },
  extraReducers: (builder) => {
    // ========================================
    // Login
    // ========================================
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.error = null;
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });

    // ========================================
    // Register
    // ========================================
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.error = null;
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ========================================
    // Fetch Profile
    // ========================================
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Don't clear auth on profile fetch failure
      });

    // ========================================
    // Update Profile
    // ========================================
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ========================================
    // Logout
    // ========================================
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout API fails, clear local state
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.error = null;
        state.isLoading = false;
      });

    // ========================================
    // Forgot Password
    // ========================================
    builder
      .addCase(forgotPasswordAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordAction.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPasswordAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ========================================
    // Reset Password
    // ========================================
    builder
      .addCase(resetPasswordAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordAction.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPasswordAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ========================================
    // Change Password
    // ========================================
    builder
      .addCase(changePasswordAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePasswordAction.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePasswordAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  loadUserFromStorage,
  updateUser,
  verifyEmail,
  clearError,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
