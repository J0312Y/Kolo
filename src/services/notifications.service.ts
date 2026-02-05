import { apiClient } from './api';
import type { ApiResponse } from './api';

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data?: any;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

class NotificationsService {
  async getAll(): Promise<ApiResponse<Notification[]>> {
    return apiClient.get<Notification[]>('/notifications');
  }

  async getUnread(): Promise<ApiResponse<Notification[]>> {
    return apiClient.get<Notification[]>('/notifications/unread');
  }

  async markAsRead(id: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/notifications/${id}/read`, {});
  }

  async markAllAsRead(): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/notifications/read-all', {});
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/notifications/${id}`);
  }
}

export const notificationsService = new NotificationsService();
