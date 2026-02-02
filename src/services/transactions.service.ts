import { apiClient, ApiResponse } from './api';
import { Transaction, Notification } from '../types';

class TransactionsService {
  async getTransactions(filter?: string): Promise<ApiResponse<Transaction[]>> {
    const params = filter ? `?filter=${filter}` : '';
    return apiClient.get<Transaction[]>(`/transactions${params}`);
  }

  async getTransactionById(id: string | number): Promise<ApiResponse<Transaction>> {
    return apiClient.get<Transaction>(`/transactions/${id}`);
  }

  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return apiClient.get<Notification[]>('/notifications');
  }

  async markNotificationAsRead(id: string | number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch<{ message: string }>(`/notifications/${id}/read`);
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/notifications/read-all');
  }
}

export const transactionsService = new TransactionsService();
