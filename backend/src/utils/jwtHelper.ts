import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Generate access token (15 minutes expiry)
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  // @ts-ignore - TypeScript has issues with string literals for expiresIn
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

/**
 * Generate refresh token (7 days expiry)
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  // @ts-ignore - TypeScript has issues with string literals for expiresIn
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d',
  });
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokenPair = (payload: TokenPayload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};
