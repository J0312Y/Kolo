import { apiClient, ApiResponse } from './api';
import { User } from '../types';

export interface RegisterData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  referralCode?: string;
}

export interface LoginData {
  phone: string;
  password?: string;
}

export interface VerifyOtpData {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/register', data);
  }

  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/login', data);
  }

  async sendOtp(phone: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/send-otp', { phone });
  }

  async verifyOtp(data: VerifyOtpData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/verify-otp', data);
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
