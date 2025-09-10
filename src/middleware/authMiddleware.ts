import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

// Extend Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

/**
 * Middleware to protect routes requiring authentication
 */
export const protect = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      status: 'error',
      message: 'Access denied. No token provided.'
    });
    return;
  }
  
  // Extract token
  const token = authHeader.split(' ')[1];
  
  // Verify token
  const decoded = verifyAccessToken(token);
  
  if (!decoded) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
    return;
  }
  
  // Add user to request
  req.user = {
    userId: decoded.userId,
    email: decoded.email
  };
  
  next();
};
