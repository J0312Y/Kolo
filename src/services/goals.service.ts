import { apiClient, ApiResponse } from './api';
import { Goal } from '../types';

export interface CreateGoalData {
  name: string;
  description: string;
  targetAmount: number;
  deadline: string;
  category: string;
  icon?: string;
  color?: string;
}

class GoalsService {
  async getMyGoals(): Promise<ApiResponse<Goal[]>> {
    return apiClient.get<Goal[]>('/goals');
  }

  async getGoalById(id: string | number): Promise<ApiResponse<Goal>> {
    return apiClient.get<Goal>(`/goals/${id}`);
  }

  async createGoal(data: CreateGoalData): Promise<ApiResponse<Goal>> {
    return apiClient.post<Goal>('/goals', data);
  }

  async updateGoal(id: string | number, data: Partial<CreateGoalData>): Promise<ApiResponse<Goal>> {
    return apiClient.put<Goal>(`/goals/${id}`, data);
  }

  async deleteGoal(id: string | number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/goals/${id}`);
  }

  async contributeToGoal(
    id: string | number,
    amount: number,
    paymentMethodId: string
  ): Promise<ApiResponse<{ message: string; transactionId: string }>> {
    return apiClient.post<{ message: string; transactionId: string }>(`/goals/${id}/contribute`, {
      amount,
      payment_method_id: paymentMethodId,
    });
  }

  async withdrawFromGoal(
    id: string | number,
    amount: number
  ): Promise<ApiResponse<{ message: string; transactionId: string }>> {
    return apiClient.post<{ message: string; transactionId: string }>(`/goals/${id}/withdraw`, {
      amount,
    });
  }
}

export const goalsService = new GoalsService();
