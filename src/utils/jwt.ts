import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'access_secret', {
    expiresIn: '15m', // 15 minutes
  });
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refresh_secret', {
    expiresIn: '7d', // 7 days
  });
};

/**
 * Verify JWT access token
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access_secret') as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Verify JWT refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh_secret') as TokenPayload;
  } catch (error) {
    return null;
  }
};
