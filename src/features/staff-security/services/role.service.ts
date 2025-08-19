import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/types/common';
import { Role, CreateRoleDTO, UpdateRoleDTO, RoleWithRelations, UpdateRolePermissionsDTO } from '../types/staff-security.types';
import { API_ENDPOINTS } from '@/lib/constants';

export class RoleService {
  // Récupérer tous les rôles avec permissions
  static async getRoles(): Promise<RoleWithRelations[]> {
    const response = await apiClient.get<RoleWithRelations[]>(API_ENDPOINTS.STAFF_SECURITY.ROLES);
    return Array.isArray(response) ? response : [];
  }

  // Récupérer un rôle par ID
  static async getRole(id: number): Promise<ApiResponse<RoleWithRelations>> {
    const response = await apiClient.get<RoleWithRelations>(`${API_ENDPOINTS.STAFF_SECURITY.ROLES}/${id}`);
    return {
      success: true,
      data: response,
      message: 'Rôle récupéré'
    };
  }

  // Créer un rôle avec permissions optionnelles
  static async createRole(data: CreateRoleDTO & { permissionIds?: number[] }): Promise<ApiResponse<Role>> {
    const response = await apiClient.post<Role>(API_ENDPOINTS.STAFF_SECURITY.ROLES, data);
    return {
      success: true,
      data: response,
      message: 'Rôle créé avec succès'
    };
  }

  // Mettre à jour un rôle
  static async updateRole(id: number, data: UpdateRoleDTO): Promise<ApiResponse<Role>> {
    const response = await apiClient.put<Role>(`${API_ENDPOINTS.STAFF_SECURITY.ROLES}/${id}`, data);
    return {
      success: true,
      data: response,
      message: 'Rôle mis à jour'
    };
  }

  // Supprimer un rôle
  static async deleteRole(id: number): Promise<ApiResponse<void>> {
    await apiClient.delete(`${API_ENDPOINTS.STAFF_SECURITY.ROLES}/${id}`);
    return {
      success: true,
      data: undefined,
      message: 'Rôle supprimé'
    };
  }

  // Récupérer les permissions d'un rôle
  static async getRolePermissions(id: number): Promise<ApiResponse<number[]>> {
    const response = await apiClient.get(`${API_ENDPOINTS.STAFF_SECURITY.ROLES}/${id}/permissions`);
    
    // Extraire les IDs des permissions
    const permissionIds = Array.isArray(response) 
      ? response.map((p: any) => p.permission_id) 
      : [];
      
    return {
      success: true,
      data: permissionIds,
      message: 'Permissions du rôle récupérées'
    };
  }

  // Mettre à jour les permissions d'un rôle
  static async updateRolePermissions(id: number, data: UpdateRolePermissionsDTO): Promise<ApiResponse<void>> {
    await apiClient.put(`${API_ENDPOINTS.STAFF_SECURITY.ROLES}/${id}/permissions`, data);
    return {
      success: true,
      data: undefined,
      message: 'Permissions mises à jour'
    };
  }

  // Vérifier si un rôle peut être supprimé
  static async canDeleteRole(id: number): Promise<ApiResponse<{ canDelete: boolean; usersCount: number; permissionsCount: number }>> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.STAFF_SECURITY.ROLES}/${id}/can-delete`);
      return {
        success: true,
        data: response,
        message: 'Vérification effectuée'
      };
    } catch (error) {
      return {
        success: true,
        data: { canDelete: true, usersCount: 0, permissionsCount: 0 },
        message: 'Vérification par défaut'
      };
    }
  }
}
