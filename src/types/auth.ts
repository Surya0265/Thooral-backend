export interface RegisterUserInput {
  fullName: string;
  email: string;
  schoolName: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailInput {
  email: string;
  code: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    schoolName: string;
    isVerified: boolean;
  };
}
