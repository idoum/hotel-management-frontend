// src/features/staff-security/services/staff.service.ts
import { apiClient } from '@/lib/api';
import { ApiResponse, PaginationParams } from '@/types/common';
import { Staff } from '../types/staff-security.types';
import { API_ENDPOINTS } from '@/lib/constants';

export class StaffService {
  static async getStaff(params?: PaginationParams): Promise<ApiResponse<Staff[]>> {
    return apiClient.get(API_ENDPOINTS.STAFF_SECURITY.STAFF, { params });
  }

  static async createStaff(data: Partial<Staff>): Promise<ApiResponse<Staff>> {
    return apiClient.post(API_ENDPOINTS.STAFF_SECURITY.STAFF, data);
  }

  static async updateStaff(id: string, data: Partial<Staff>): Promise<ApiResponse<Staff>> {
    return apiClient.put(`${API_ENDPOINTS.STAFF_SECURITY.STAFF}/${id}`, data);
  }

  static async deleteStaff(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.STAFF_SECURITY.STAFF}/${id}`);
  }
}
