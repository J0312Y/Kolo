import { apiClient, ApiResponse } from './api';
import { User } from '../types';

// Transforms snake_case user object from Laravel into the camelCase User type
function transformUser(raw: any): User {
  return {
    id: raw.id,
    firstName: raw.first_name ?? raw.firstName ?? '',
    lastName: raw.last_name ?? raw.lastName ?? '',
    fullName: raw.full_name ?? raw.fullName ?? `${raw.first_name ?? ''} ${raw.last_name ?? ''}`.trim(),
    phone: raw.phone ?? '',
    email: raw.email ?? '',
    referralCode: raw.referral_code ?? raw.referralCode,
    walletBalance: Number(raw.wallet_balance ?? raw.walletBalance ?? 0),
    cardBalance: Number(raw.card_balance ?? raw.cardBalance ?? 0),
    plan: raw.plan?.tier ? raw.plan as User['plan'] : {
      tier: raw.plan_tier ?? 'bronze',
      tierName: 'Bronze',
      badge: '🥉',
      color: 'bg-amber-600',
      subscriptionStart: new Date().toISOString(),
      subscriptionEnd: null,
      autoRenew: false,
      features: {
        maxCircles: 2, adminFeePercent: 5, customGoalsLimit: 0,
        prioritySupport: false, zeroFees: false, cashbackPercent: 0,
        prioritySlots: false, advancedStats: false, referralMultiplier: 1,
        paymentReminders: true, createCircles: true,
      },
      addOns: [],
    },
  };
}

export { transformUser };

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
    const response = await apiClient.post<AuthResponse>('/login', data);
    if (response.data?.user) {
      response.data.user = transformUser(response.data.user);
    }
    return response;
  }

  async sendOtp(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/resend-verification', { email });
  }

  async verifyOtp(data: VerifyOtpData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/verify-email', data);
    if (response.data?.token) {
      apiClient.setToken(response.data.token);
    }
    if (response.data?.user) {
      response.data.user = transformUser(response.data.user);
    }
    return response;
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post<{ message: string }>('/logout');
    apiClient.clearToken();
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    // Backend returns { data: { user: {...}, wallet_balance, card_balance, plan } }
    const response = await apiClient.get<any>('/user');
    const raw = response.data?.user ?? response.data;
    // Merge top-level wallet/card/plan from the wrapper if present
    if (response.data?.wallet_balance !== undefined) {
      raw.wallet_balance = response.data.wallet_balance;
    }
    if (response.data?.card_balance !== undefined) {
      raw.card_balance = response.data.card_balance;
    }
    if (response.data?.plan) {
      raw.plan = response.data.plan;
    }
    return { ...response, data: transformUser(raw) };
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
