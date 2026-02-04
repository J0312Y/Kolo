import { apiClient } from './api';
import type { ApiResponse } from './api';

export interface LikeLemba {
  id: number;
  name: string;
  description: string;
  contribution_amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  total_slots: number;
  current_members: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  visibility: 'public' | 'private';
  auto_start: boolean;
  invitation_code?: string;
  next_payout_date: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  is_member?: boolean;
  my_slot?: number | null;
  admin_name?: string;
}

export interface LikeLembaMember {
  id: number;
  like_lemba_id: number;
  user_id: number;
  slot_number: number | null;
  join_date: string;
  payments_made: number;
  payments_remaining: number;
  has_received_payout: boolean;
  payout_date: string | null;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export interface CreateLikeLembaData {
  name: string;
  description: string;
  contribution_amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  total_slots: number;
  visibility: 'public' | 'private';
  auto_start?: boolean;
}

class CirclesService {
  async getMyCircles(): Promise<ApiResponse<LikeLemba[]>> {
    return apiClient.get<LikeLemba[]>('/likeLembas');
  }

  async discoverCircles(): Promise<ApiResponse<LikeLemba[]>> {
    return apiClient.get<LikeLemba[]>('/likeLembas/discover');
  }

  async getCircle(id: number): Promise<ApiResponse<LikeLemba>> {
    return apiClient.get<LikeLemba>(`/likeLembas/${id}`);
  }

  async createCircle(data: CreateLikeLembaData): Promise<ApiResponse<LikeLemba>> {
    return apiClient.post<LikeLemba>('/likeLembas', data);
  }

  async updateCircle(id: number, data: Partial<CreateLikeLembaData>): Promise<ApiResponse<LikeLemba>> {
    return apiClient.put<LikeLemba>(`/likeLembas/${id}`, data);
  }

  async deleteCircle(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/likeLembas/${id}`);
  }

  async joinCircle(id: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/likeLembas/${id}/join`, {});
  }

  async joinWithCode(code: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/likeLembas/join-with-code', { invitation_code: code });
  }

  async leaveCircle(id: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/likeLembas/${id}/leave`, {});
  }

  async getMembers(id: number): Promise<ApiResponse<LikeLembaMember[]>> {
    return apiClient.get<LikeLembaMember[]>(`/likeLembas/${id}/members`);
  }

  async getAvailableSlots(id: number): Promise<ApiResponse<number[]>> {
    return apiClient.get<number[]>(`/likeLembas/${id}/available-slots`);
  }

  async selectSlot(id: number, slotNumber: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/likeLembas/${id}/select-slot`, { slot_number: slotNumber });
  }

  async validateInvitationCode(code: string): Promise<ApiResponse<{ valid: boolean; like_lemba?: LikeLemba }>> {
    return apiClient.get<{ valid: boolean; like_lemba?: LikeLemba }>(`/likeLembas/validate-code/${code}`);
  }
}

export const circlesService = new CirclesService();
