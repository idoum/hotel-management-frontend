// src/features/staff-security/services/department.service.ts
import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/types/common';
import { Department } from '../types/staff-security.types';
import { API_ENDPOINTS } from '@/lib/constants';

export class DepartmentService {
  static async getDepartments(): Promise<ApiResponse<Department[]>> {
    return apiClient.get(API_ENDPOINTS.STAFF_SECURITY.DEPARTMENTS);
  }

  static async createDepartment(data: Partial<Department>): Promise<ApiResponse<Department>> {
    return apiClient.post(API_ENDPOINTS.STAFF_SECURITY.DEPARTMENTS, data);
  }

  static async updateDepartment(id: string, data: Partial<Department>): Promise<ApiResponse<Department>> {
    return apiClient.put(`${API_ENDPOINTS.STAFF_SECURITY.DEPARTMENTS}/${id}`, data);
  }

  static async deleteDepartment(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.STAFF_SECURITY.DEPARTMENTS}/${id}`);
  }
}
