import { apiClient, ApiResponse } from './api';
import { User } from '../types';

export interface RegisterData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  referral_code?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyOtpData {
  user_id: string;
  otp: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: {
    id: string | number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    referral_code: string;
    has_referral_bonus: boolean;
  };
  otp_sent: boolean;
}

class AuthService {
  async register(data: RegisterData): Promise<ApiResponse<RegisterResponse>> {
    return apiClient.post<RegisterResponse>('/register', data);
  }

  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/login', data);
  }

  async sendOtp(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/resend-verification', { email });
  }

  async verifyOtp(data: VerifyOtpData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/verify-email', data);
    if (response.data.token) {
      apiClient.setToken(response.data.token);
    }
    return response;
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post<{ message: string }>('/logout');
    apiClient.clearToken();
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/user');
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>('/user/profile', data);
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/forgot-password', { email });
  }

  async resetPassword(
    token: string,
    password: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/reset-password', {
      token,
      password,
    });
  }
}

export const authService = new AuthService();
