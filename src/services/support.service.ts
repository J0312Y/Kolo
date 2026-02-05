import { apiClient } from './api';
import type { ApiResponse } from './api';

export interface SupportTicket {
  id: number;
  user_id: number;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  messages?: SupportMessage[];
}

export interface SupportMessage {
  id: number;
  support_ticket_id: number;
  user_id?: number;
  message: string;
  is_staff: boolean;
  created_at: string;
}

export interface CreateTicketData {
  subject: string;
  category: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
}

class SupportService {
  async getTickets(): Promise<ApiResponse<SupportTicket[]>> {
    return apiClient.get<SupportTicket[]>('/support/tickets');
  }

  async createTicket(data: CreateTicketData): Promise<ApiResponse<SupportTicket>> {
    return apiClient.post<SupportTicket>('/support/ticket', data);
  }

  async getFAQ(): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>('/support/faq');
  }
}

export const supportService = new SupportService();
