import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwtHelper';
import logger from '../utils/logger';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        role: 'customer' | 'admin' | 'staff';
      };
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'No authorization token provided',
      });
      return;
    }

    // Check if Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Invalid token format. Use: Bearer <token>',
      });
      return;
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token is empty',
      });
      return;
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
      return;
    }

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role as 'customer' | 'admin' | 'staff',
    };

    // Continue to next middleware/route handler
    next();
  } catch (error: any) {
    logger.error('Authentication error:', error);
    
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Authorization middleware - Check if user has required role
 * @param roles - Array of allowed roles
 */
export const authorize = (...roles: Array<'customer' | 'admin' | 'staff'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
        requiredRoles: roles,
        yourRole: req.user.role,
      });
      return;
    }

    // User is authorized, continue
    next();
  };
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't fail if no token
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);

      if (decoded) {
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role as 'customer' | 'admin' | 'staff',
        };
      }
    }

    // Continue regardless of token validity
    next();
  } catch (error) {
    // Silently fail, user will be undefined
    next();
  }
};

export default authenticate;
