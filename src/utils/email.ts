import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Email options interface
interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Get email credentials from environment variables
const USER_EMAIL = process.env.SMTP_USER!;
const EMAIL_APP_PASSWORD = process.env.SMTP_PASS!;

// Create reusable transporter object
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: USER_EMAIL,
      pass: EMAIL_APP_PASSWORD
    }
  });
};

/**
 * Send an email
 */
export const sendEmail = async ({ to, subject, text, html }: EmailOptions): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: USER_EMAIL,
      to,
      subject,
      text,
      html,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

/**
 * Send verification email
 */
export const sendVerificationEmail = async (to: string, code: string): Promise<boolean> => {
  try {
    const subject = 'Verify Your Email - Thooral Website';
    const html = `
      <h1>Email Verification</h1>
      <p>Thank you for registering with Thooral Website. Please use the verification code below to verify your email address:</p>
      <h2 style="letter-spacing: 5px; font-size: 24px; background-color: #f0f0f0; padding: 10px; display: inline-block;">${code}</h2>
      <p>This code will expire in 2 minutes.</p>
      <p>If you did not register for a Thooral Website account, please ignore this email.</p>
    `;

    return sendEmail({ 
      to, 
      subject, 
      html 
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (to: string, token: string): Promise<boolean> => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}&email=${to}`;
    
    const subject = 'Reset Your Password - Thooral Website';
    const html = `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Please click the link below to reset your password:</p>
      <p><a href="${resetUrl}" style="padding: 10px 15px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>This link will expire in 2 minutes.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Alternatively, you can copy and paste the following URL into your browser: ${resetUrl}</p>
    `;
    
    return sendEmail({ 
      to, 
      subject, 
      html 
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};
