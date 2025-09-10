import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

/**
 * Hash a password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare a password with a hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate a random verification code (6 digits)
 */
export const generateVerificationCode = (): string => {
  const min = 100000;
  const max = 999999;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
};

/**
 * Generate a secure random token
 */
export const generateResetToken = (): string => {
  return randomBytes(32).toString('hex');
};

/**
 * Validate password strength
 * - Simple validation that password isn't empty
 */
export const isValidPassword = (password: string): boolean => {
  // Only check that password exists and isn't empty
  return password !== undefined && password !== null && password.length > 0;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
