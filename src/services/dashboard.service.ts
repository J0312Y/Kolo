import { apiClient } from './api';
import type { ApiResponse } from '../types';

export interface DashboardStats {
  wallet_balance: number;
  card_balance: number;
  total_circles: number;
  active_circles: number;
  total_goals: number;
  active_goals: number;
  total_transactions: number;
  recent_transactions: Array<{
    id: number;
    type: string;
    amount: number;
    title: string;
    description: string;
    status: string;
    created_at: string;
  }>;
  active_like_lembas: Array<{
    id: number;
    name: string;
    contribution_amount: number;
    current_members: number;
    total_slots: number;
    next_payout_date: string;
    my_slot: number | null;
    payments_made: number;
    payments_remaining: number;
  }>;
}

class DashboardService {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get<DashboardStats>('/dashboard/stats');
  }
}

export const dashboardService = new DashboardService();
