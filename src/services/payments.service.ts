import { apiClient } from './api';
import type { ApiResponse } from './api';

export interface Payment {
  id: number;
  user_id: number;
  like_lemba_id?: number;
  goal_id?: number;
  amount: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed' | 'overdue';
  payment_date: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ContributionData {
  like_lemba_id?: number;
  goal_id?: number;
  amount: number;
  payment_method: string;
}

export interface PaymentCalendar {
  date: string;
  payments: Payment[];
  total_amount: number;
}

class PaymentsService {
  async getAll(): Promise<ApiResponse<Payment[]>> {
    return apiClient.get<Payment[]>('/payments');
  }

  async getById(id: number): Promise<ApiResponse<Payment>> {
    return apiClient.get<Payment>(`/payments/${id}`);
  }

  async getUpcoming(): Promise<ApiResponse<Payment[]>> {
    return apiClient.get<Payment[]>('/payments/upcoming');
  }

  async getOverdue(): Promise<ApiResponse<Payment[]>> {
    return apiClient.get<Payment[]>('/payments/overdue');
  }

  async makeContribution(data: ContributionData): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/payments/contribute', data);
  }

  async retryPayment(id: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/payments/${id}/retry`, {});
  }

  async getCalendar(year: number, month: number): Promise<ApiResponse<PaymentCalendar[]>> {
    return apiClient.get<PaymentCalendar[]>(`/payments/calendar/${year}/${month}`);
  }
}

export const paymentsService = new PaymentsService();
