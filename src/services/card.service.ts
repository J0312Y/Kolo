import { apiClient } from './api';
import type { ApiResponse } from '../types';

export interface CardData {
  card_balance: number;
  card_number?: string;
  card_status: 'active' | 'frozen' | 'blocked';
}

export interface CardTransaction {
  id: number;
  type: 'top_up' | 'withdrawal' | 'payment';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

class CardService {
  async getCardBalance(): Promise<ApiResponse<CardData>> {
    return apiClient.get<CardData>('/card/balance');
  }

  async getCardTransactions(): Promise<ApiResponse<CardTransaction[]>> {
    return apiClient.get<CardTransaction[]>('/card/transactions');
  }

  async topUpCard(amount: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/card/top-up', { amount });
  }

  async withdrawFromCard(amount: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/card/withdraw', { amount });
  }

  async freezeCard(): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/card/freeze', {});
  }

  async unfreezeCard(): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/card/unfreeze', {});
  }
}

export const cardService = new CardService();
