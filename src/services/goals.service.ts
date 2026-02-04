import { apiClient } from './api';
import type { ApiResponse } from './api';

export interface Goal {
  id: number;
  user_id: number;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  status: 'active' | 'completed' | 'cancelled';
  category: 'education' | 'health' | 'business' | 'travel' | 'other';
  created_at: string;
  updated_at: string;
}

export interface CreateGoalData {
  title: string;
  description: string;
  target_amount: number;
  deadline: string;
  category: 'education' | 'health' | 'business' | 'travel' | 'other';
}

export interface GoalContribution {
  amount: number;
  payment_method: string;
}

class GoalsService {
  async getGoals(): Promise<ApiResponse<Goal[]>> {
    return apiClient.get<Goal[]>('/goals');
  }

  async getGoal(id: number): Promise<ApiResponse<Goal>> {
    return apiClient.get<Goal>(`/goals/${id}`);
  }

  async createGoal(data: CreateGoalData): Promise<ApiResponse<Goal>> {
    return apiClient.post<Goal>('/goals', data);
  }

  async updateGoal(id: number, data: Partial<CreateGoalData>): Promise<ApiResponse<Goal>> {
    return apiClient.put<Goal>(`/goals/${id}`, data);
  }

  async deleteGoal(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/goals/${id}`);
  }

  async contribute(id: number, data: GoalContribution): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/goals/${id}/contribute`, data);
  }

  async withdraw(id: number, amount: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/goals/${id}/withdraw`, { amount });
  }

  async getProgress(id: number): Promise<ApiResponse<{ percentage: number; amount_remaining: number }>> {
    return apiClient.get<{ percentage: number; amount_remaining: number }>(`/goals/${id}/progress`);
  }
}

export const goalsService = new GoalsService();
