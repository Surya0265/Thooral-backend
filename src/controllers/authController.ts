import { Request, Response } from 'express';
import { 
  hashPassword, 
  comparePassword, 
  generateVerificationCode, 
  generateResetToken, 
  isValidPassword, 
  isValidEmail 
} from '../utils/password';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken 
} from '../utils/jwt';
import { 
  sendVerificationEmail, 
  sendPasswordResetEmail 
} from '../utils/email';
import prisma from '../lib/prisma';
import { 
  RegisterUserInput, 
  VerifyEmailInput, 
  LoginUserInput, 
  ForgotPasswordInput, 
  ResetPasswordInput,
  RefreshTokenInput,
  AuthResponse
} from '../types/auth';

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, schoolName, password, confirmPassword }: RegisterUserInput = req.body;

    // Validate input
    if (!fullName || !email || !schoolName || !password || !confirmPassword) {
      res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid email format'
      });
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      res.status(400).json({
        status: 'error',
        message: 'Passwords do not match'
      });
      return;
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number'
      });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
      return;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        schoolName,
        passwordHash,
        isVerified: false
      }
    });

    // Generate verification code
    const verificationCode = generateVerificationCode();
    
    // Store verification code with 10 minute expiry
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 2);
    
    await prisma.emailVerification.create({
      data: {
        userId: newUser.id,
        code: verificationCode,
        expiresAt,
        isUsed: false
      }
    });

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    // Return response
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully. Please check your email for verification code.',
      data: {
        userId: newUser.id,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during registration'
    });
  }
};

/**
 * Verify email
 * @route POST /api/auth/verify-email
 */
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code }: VerifyEmailInput = req.body;

    if (!email || !code) {
      res.status(400).json({
        status: 'error',
        message: 'Email and verification code are required'
      });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }

    // Find the most recent unused verification code
    const verification = await prisma.emailVerification.findFirst({
      where: {
        userId: user.id,
        code,
        isUsed: false,
        expiresAt: {
          gt: new Date() // Not expired
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!verification) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid or expired verification code'
      });
      return;
    }

    // Update verification record
    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: { isUsed: true }
    });

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true }
    });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully. You can now log in.'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during email verification'
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginUserInput = req.body;

    if (!email || !password) {
      res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Check if user exists and password is correct
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
      return;
    }

    // Check if user is verified
    if (!user.isVerified) {
      res.status(401).json({
        status: 'error',
        message: 'Please verify your email before logging in'
      });
      return;
    }

    // Generate tokens
    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Create response
    const authResponse: AuthResponse = {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        schoolName: user.schoolName,
        isVerified: user.isVerified
      }
    };

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: authResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during login'
    });
  }
};

/**
 * Forgot password
 * @route POST /api/auth/forgot-password
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email }: ForgotPasswordInput = req.body;

    if (!email) {
      res.status(400).json({
        status: 'error',
        message: 'Email is required'
      });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // We don't want to reveal if a user exists or not for security reasons
    if (!user) {
      res.status(200).json({
        status: 'success',
        message: 'If an account with that email exists, a password reset link will be sent'
      });
      return;
    }

    // Generate reset token
    const token = generateResetToken();
    
    // Set expiry (10 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 2);

    // Store reset token
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
        isUsed: false
      }
    });

    // Send password reset email
    await sendPasswordResetEmail(email, token);

    res.status(200).json({
      status: 'success',
      message: 'If an account with that email exists, a password reset link will be sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing your request'
    });
  }
};

/**
 * Reset password
 * @route POST /api/auth/reset-password
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password, confirmPassword }: ResetPasswordInput = req.body;

    if (!token || !password || !confirmPassword) {
      res.status(400).json({
        status: 'error',
        message: 'Token, password, and confirm password are required'
      });
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      res.status(400).json({
        status: 'error',
        message: 'Passwords do not match'
      });
      return;
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number'
      });
      return;
    }

    // Find the valid reset token
    const resetRecord = await prisma.passwordReset.findFirst({
      where: {
        token,
        isUsed: false,
        expiresAt: {
          gt: new Date() // Not expired
        }
      },
      include: {
        User: true
      }
    });

    if (!resetRecord) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
      return;
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update user password
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash }
    });

    // Mark token as used
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { isUsed: true }
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful. You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while resetting your password'
    });
  }
};

/**
 * Refresh access token
 * @route POST /api/auth/refresh
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken: token }: RefreshTokenInput = req.body;

    if (!token) {
      res.status(400).json({
        status: 'error',
        message: 'Refresh token is required'
      });
      return;
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    if (!decoded) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid or expired refresh token'
      });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email
    });

    res.status(200).json({
      status: 'success',
      message: 'Access token refreshed successfully',
      data: {
        accessToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while refreshing token'
    });
  }
};
