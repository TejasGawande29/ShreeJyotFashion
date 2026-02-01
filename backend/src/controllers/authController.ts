import { Request, Response } from 'express';
import * as authService from '../services/authService';
import logger from '../utils/logger';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, phone, password } = req.body;

    const result = await authService.registerUser({ email, phone, password });

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error: any) {
    logger.error('Registration error:', error);

    if (error.message.includes('already exists')) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser({ email, password });

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error: any) {
    logger.error('Login error:', error.message);

    if (error.message.includes('Invalid email or password')) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error.message.includes('locked') || error.message.includes('deactivated')) {
      res.status(403).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // userId will be set by auth middleware
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    const user = await authService.getUserById(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    logger.error('Get user error:', error);

    if (error.message === 'User not found') {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching user data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
