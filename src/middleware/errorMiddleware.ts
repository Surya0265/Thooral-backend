import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode: number;
  status: string;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  // Provide reasonable error info regardless of environment
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // Include error details but not the full stack trace for security
    details: err.name
  });
};
