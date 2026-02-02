import { apiClient, ApiResponse } from './api';
import { LikeLemba, LikeLembaMember, ChatMessage } from '../types';

export interface CreateCircleData {
  name: string;
  description?: string;
  amount: string;
  duration: number;
  totalMembers: number;
}

export interface JoinCircleData {
  inviteCode: string;
  slotNumber?: number;
}

class CirclesService {
  async getMyCircles(): Promise<ApiResponse<{ active: LikeLemba[]; finished: LikeLemba[] }>> {
    return apiClient.get<{ active: LikeLemba[]; finished: LikeLemba[] }>('/likelembas');
  }

  async getCircleById(id: string | number): Promise<ApiResponse<LikeLemba>> {
    return apiClient.get<LikeLemba>(`/likelembas/${id}`);
  }

  async createCircle(data: CreateCircleData): Promise<ApiResponse<LikeLemba>> {
    return apiClient.post<LikeLemba>('/likelembas', data);
  }

  async joinCircle(data: JoinCircleData): Promise<ApiResponse<LikeLemba>> {
    return apiClient.post<LikeLemba>('/likelembas/join', data);
  }

  async leaveCircle(id: string | number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`/likelembas/${id}/leave`);
  }

  async getCircleMembers(id: string | number): Promise<ApiResponse<LikeLembaMember[]>> {
    return apiClient.get<LikeLembaMember[]>(`/likelembas/${id}/members`);
  }

  async makePayment(
    id: string | number,
    paymentMethodId: string
  ): Promise<ApiResponse<{ message: string; transactionId: string }>> {
    return apiClient.post<{ message: string; transactionId: string }>(
      `/likelembas/${id}/payments`,
      { payment_method_id: paymentMethodId }
    );
  }

  async getCircleChat(id: string | number): Promise<ApiResponse<ChatMessage[]>> {
    return apiClient.get<ChatMessage[]>(`/likelembas/${id}/chat`);
  }

  async sendChatMessage(
    id: string | number,
    message: string
  ): Promise<ApiResponse<ChatMessage>> {
    return apiClient.post<ChatMessage>(`/likelembas/${id}/chat`, { message });
  }

  async inviteMembers(
    id: string | number,
    emails: string[]
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`/likelembas/${id}/invite`, { emails });
  }
}

export const circlesService = new CirclesService();
