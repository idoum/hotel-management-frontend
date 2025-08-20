import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/types/common';
import { 
  User, 
  CreateUserDTO, 
  UpdateUserDTO, 
  UserWithRelations, 
  UserFilters,
  UpdatePasswordDTO,
  UpdateUserRolesDTO 
} from '../types/staff-security.types';
import { API_ENDPOINTS } from '@/lib/constants';

export class UserService {
  // Récupérer tous les utilisateurs
  static async getUsers(filters?: UserFilters): Promise<UserWithRelations[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.STAFF_SECURITY.USERS}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get<UserWithRelations[]>(url);
    
    return Array.isArray(response) ? response : [];
  }

  // Récupérer un utilisateur par ID
  static async getUser(id: number): Promise<ApiResponse<UserWithRelations>> {
    const response = await apiClient.get<UserWithRelations>(`${API_ENDPOINTS.STAFF_SECURITY.USERS}/${id}`);
    return {
      success: true,
      data: response,
      message: 'Utilisateur trouvé'
    };
  }

  // Créer un utilisateur
  static async createUser(data: CreateUserDTO): Promise<ApiResponse<User>> {
    const response = await apiClient.post<User>(API_ENDPOINTS.STAFF_SECURITY.USERS, data);
    return {
      success: true,
      data: response,
      message: 'Utilisateur créé avec succès'
    };
  }

  // Mettre à jour un utilisateur
  static async updateUser(id: number, data: UpdateUserDTO): Promise<ApiResponse<User>> {
    const response = await apiClient.put<User>(`${API_ENDPOINTS.STAFF_SECURITY.USERS}/${id}`, data);
    return {
      success: true,
      data: response,
      message: 'Utilisateur mis à jour'
    };
  }

  // Supprimer un utilisateur
  static async deleteUser(id: number): Promise<ApiResponse<void>> {
    await apiClient.delete(`${API_ENDPOINTS.STAFF_SECURITY.USERS}/${id}`);
    return {
      success: true,
      data: undefined,
      message: 'Utilisateur supprimé'
    };
  }

  // Récupérer les rôles d'un utilisateur
  static async getUserRoles(id: number): Promise<ApiResponse<number[]>> {
    const response = await apiClient.get(`${API_ENDPOINTS.STAFF_SECURITY.USERS}/${id}/roles`);
    
    // Extraire les IDs des rôles
    const roleIds = Array.isArray(response) 
      ? response.map((r: any) => r.role_id) 
      : [];
      
    return {
      success: true,
      data: roleIds,
      message: 'Rôles utilisateur récupérés'
    };
  }

  // Mettre à jour les rôles d'un utilisateur
  static async updateUserRoles(id: number, data: UpdateUserRolesDTO): Promise<ApiResponse<void>> {
    await apiClient.put(`${API_ENDPOINTS.STAFF_SECURITY.USERS}/${id}/roles`, data);
    return {
      success: true,
      data: undefined,
      message: 'Rôles mis à jour'
    };
  }

  // Récupérer toutes les permissions d'un utilisateur
  static async getUserPermissions(id: number): Promise<ApiResponse<string[]>> {
    const response = await apiClient.get(`${API_ENDPOINTS.STAFF_SECURITY.USERS}/${id}/permissions`);
    
    const permissions = Array.isArray(response) 
      ? response.map((p: any) => p.permission_name) 
      : [];
      
    return {
      success: true,
      data: permissions,
      message: 'Permissions utilisateur récupérées'
    };
  }

  // Changer le mot de passe
  static async updatePassword(id: number, data: UpdatePasswordDTO): Promise<ApiResponse<void>> {
    await apiClient.put(`${API_ENDPOINTS.STAFF_SECURITY.USERS}/${id}/password`, data);
    return {
      success: true,
      data: undefined,
      message: 'Mot de passe mis à jour'
    };
  }
}
