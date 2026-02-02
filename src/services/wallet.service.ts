import { apiClient } from './api';
import type { ApiResponse } from '../types';

export interface Transaction {
  id: number;
  user_id: number;
  type: 'deposit' | 'withdrawal' | 'contribution' | 'payout' | 'transfer' | 'refund';
  amount: number;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  like_lemba_id?: number;
  goal_id?: number;
  payment_method?: string;
  reference_number?: string;
  created_at: string;
  updated_at: string;
}

export interface WalletData {
  wallet_balance: number;
  card_balance: number;
}

export interface TopUpData {
  amount: number;
  payment_method: string;
}

export interface WithdrawData {
  amount: number;
  destination: 'bank' | 'mobile_money';
  account_number?: string;
  phone_number?: string;
}

class WalletService {
  async getWalletBalance(): Promise<ApiResponse<WalletData>> {
    return apiClient.get<WalletData>('/user');
  }

  async getTransactions(): Promise<ApiResponse<Transaction[]>> {
    return apiClient.get<Transaction[]>('/transactions');
  }

  async getTransaction(id: number): Promise<ApiResponse<Transaction>> {
    return apiClient.get<Transaction>(`/transactions/${id}`);
  }

  async filterByType(type: string): Promise<ApiResponse<Transaction[]>> {
    return apiClient.get<Transaction[]>(`/transactions/filter/${type}`);
  }

  async getByDateRange(startDate: string, endDate: string): Promise<ApiResponse<Transaction[]>> {
    return apiClient.get<Transaction[]>('/transactions/date-range', {
      params: { start_date: startDate, end_date: endDate }
    });
  }

  async topUpWallet(data: TopUpData): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/card/top-up', data);
  }

  async withdrawFromWallet(data: WithdrawData): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/card/withdraw', data);
  }
}

export const walletService = new WalletService();
