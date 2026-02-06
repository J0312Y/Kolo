import { apiClient } from './api';
import type { ApiResponse } from './api';

export interface PaymentMethod {
  id: number;
  user_id: number;
  type: 'card' | 'mobile_money' | 'bank_account';
  provider: string;
  account_number?: string;
  phone_number?: string;
  card_last4?: string;
  card_brand?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddPaymentMethodData {
  type: 'card' | 'mobile_money' | 'bank_account';
  provider: string;
  account_number?: string;
  phone_number?: string;
  card_number?: string;
  card_expiry?: string;
  card_cvv?: string;
}

class PaymentMethodsService {
  async getAll(): Promise<ApiResponse<PaymentMethod[]>> {
    return apiClient.get<PaymentMethod[]>('/payment-methods');
  }

  async add(data: AddPaymentMethodData): Promise<ApiResponse<PaymentMethod>> {
    return apiClient.post<PaymentMethod>('/payment-methods', data);
  }

  async update(id: number, data: Partial<AddPaymentMethodData>): Promise<ApiResponse<PaymentMethod>> {
    return apiClient.put<PaymentMethod>(`/payment-methods/${id}`, data);
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/payment-methods/${id}`);
  }

  async setDefault(id: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/payment-methods/${id}/set-default`, {});
  }
}

export const paymentMethodsService = new PaymentMethodsService();
