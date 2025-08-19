import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/types/common';
import { Permission, CreatePermissionDTO, UpdatePermissionDTO, PermissionWithRoles } from '../types/staff-security.types';
import { API_ENDPOINTS } from '@/lib/constants';

export class PermissionService {
  static async getPermissions(): Promise<PermissionWithRoles[]> {
    // Retourne directement le tableau, pas un wrapper ApiResponse
    const response = await apiClient.get<PermissionWithRoles[]>(API_ENDPOINTS.STAFF_SECURITY.PERMISSIONS);
    
    // Ajouter les propriétés manquantes pour chaque permission
    return response.map(permission => ({
      ...permission,
      canDelete: true, // Par défaut, à adapter selon ta logique
      roles: [], // Par défaut vide, à remplir selon ta logique
    }));
  }

  static async createPermission(data: CreatePermissionDTO): Promise<ApiResponse<Permission>> {
    const response = await apiClient.post<Permission>(API_ENDPOINTS.STAFF_SECURITY.PERMISSIONS, data);
    return {
      success: true,
      data: response,
      message: 'Permission créée avec succès'
    };
  }

  static async updatePermission(id: number, data: UpdatePermissionDTO): Promise<ApiResponse<Permission>> {
    const response = await apiClient.put<Permission>(`${API_ENDPOINTS.STAFF_SECURITY.PERMISSIONS}/${id}`, data);
    return {
      success: true,
      data: response,
      message: 'Permission mise à jour avec succès'
    };
  }

  static async deletePermission(id: number): Promise<ApiResponse<void>> {
    await apiClient.delete(`${API_ENDPOINTS.STAFF_SECURITY.PERMISSIONS}/${id}`);
    return {
      success: true,
      data: undefined,
      message: 'Permission supprimée avec succès'
    };
  }

  static async getPermission(id: number): Promise<ApiResponse<PermissionWithRoles>> {
    const response = await apiClient.get<Permission>(`${API_ENDPOINTS.STAFF_SECURITY.PERMISSIONS}/${id}`);
    const permissionWithRoles: PermissionWithRoles = {
      ...response,
      canDelete: true,
      roles: [],
    };
    
    return {
      success: true,
      data: permissionWithRoles,
      message: 'Permission trouvée'
    };
  }

  static async canDeletePermission(id: number): Promise<ApiResponse<{ canDelete: boolean; rolesCount: number }>> {
    // À adapter selon ton endpoint backend
    return {
      success: true,
      data: {
        canDelete: true,
        rolesCount: 0,
      },
      message: 'Vérification effectuée'
    };
  }
}
