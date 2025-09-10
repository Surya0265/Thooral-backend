export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  schoolName: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
