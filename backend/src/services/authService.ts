import User from '../models/User';
import { generateTokenPair } from '../utils/jwtHelper';
import * as emailService from './emailService';
import * as notificationService from './notificationService';

interface RegisterData {
  email: string;
  phone?: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

/**
 * Register a new user
 */
export const registerUser = async (data: RegisterData) => {
  const { email, phone, password } = data;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Check if phone is already registered (if provided)
  if (phone) {
    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      throw new Error('User with this phone number already exists');
    }
  }

  // Create new user (password will be hashed by model hook)
  const user = await User.create({
    email,
    phone: phone || undefined,
    password_hash: password, // Will be hashed in beforeCreate hook
    role: 'customer',
    is_verified: false,
    is_active: true,
    is_deleted: false,
    failed_login_attempts: 0,
  });

  // Generate tokens
  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Send welcome email (async, don't wait)
  emailService.sendWelcomeEmail(
    user.email,
    user.id,
    user.email.split('@')[0] // Use email prefix as name if no profile exists
  ).catch(err => console.error('Failed to send welcome email:', err));

  return {
    user: user.toSafeObject(),
    ...tokens,
  };
};

/**
 * Login user
 */
export const loginUser = async (data: LoginData) => {
  const { email, password } = data;

  // Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check if user is active
  if (!user.is_active) {
    throw new Error('Your account has been deactivated. Please contact support.');
  }

  // Check if account is locked
  if (user.isLocked()) {
    throw new Error('Your account is temporarily locked due to multiple failed login attempts. Please try again later.');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    await user.recordFailedLogin();
    throw new Error('Invalid email or password');
  }

  // Reset failed login attempts and update last login
  await user.resetFailedLogins();
  await user.updateLastLogin();

  // Generate tokens
  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: user.toSafeObject(),
    ...tokens,
  };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: number) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user.toSafeObject();
};
