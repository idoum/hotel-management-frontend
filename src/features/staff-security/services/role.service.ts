// src/features/staff-security/services/role.service.ts
import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/types/common';
import { Role } from '../types/staff-security.types';
import { API_ENDPOINTS } from '@/lib/constants';

export class RoleService {
  static async getRoles(): Promise<ApiResponse<Role[]>> {
    return apiClient.get(API_ENDPOINTS.STAFF_SECURITY.ROLES);
  }

  static async createRole(data: Partial<Role>): Promise<ApiResponse<Role>> {
    return apiClient.post(API_ENDPOINTS.STAFF_SECURITY.ROLES, data);
  }

  static async updateRole(id: string, data: Partial<Role>): Promise<ApiResponse<Role>> {
    return apiClient.put(`${API_ENDPOINTS.STAFF_SECURITY.ROLES}/${id}`, data);
  }

  static async deleteRole(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.STAFF_SECURITY.ROLES}/${id}`);
  }
}
