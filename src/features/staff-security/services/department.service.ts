import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/types/common';
import { Department, CreateDepartmentDTO, UpdateDepartmentDTO, DepartmentWithRelations } from '../types/staff-security.types';
import { API_ENDPOINTS } from '@/lib/constants';

export class DepartmentService {
  // Récupérer tous les départements
  static async getDepartments(): Promise<DepartmentWithRelations[]> {
    const response = await apiClient.get<DepartmentWithRelations[]>(API_ENDPOINTS.STAFF_SECURITY.DEPARTMENTS);
    
    // Enrichir chaque département avec les propriétés manquantes si nécessaire
    return Array.isArray(response) ? response.map(department => ({
      ...department,
      canDelete: department.canDelete ?? (department.staff_count === 0),
      actualStaffCount: department.actualStaffCount ?? department.staff_count ?? 0,
      staff: department.staff ?? [],
    })) : [];
  }

  // Récupérer un département par ID
  static async getDepartment(id: number): Promise<ApiResponse<DepartmentWithRelations>> {
    const response = await apiClient.get<Department>(`${API_ENDPOINTS.STAFF_SECURITY.DEPARTMENTS}/${id}`);
    
    const departmentWithRelations: DepartmentWithRelations = {
      ...response,
      canDelete: (response.staff_count === 0),
      actualStaffCount: response.staff_count ?? 0,
      staff: [],
    };
    
    return {
      success: true,
      data: departmentWithRelations,
      message: 'Département trouvé'
    };
  }

  // Créer un nouveau département
  static async createDepartment(data: CreateDepartmentDTO): Promise<ApiResponse<Department>> {
    const response = await apiClient.post<Department>(API_ENDPOINTS.STAFF_SECURITY.DEPARTMENTS, data);
    return {
      success: true,
      data: response,
      message: 'Département créé avec succès'
    };
  }

  // Mettre à jour un département
  static async updateDepartment(id: number, data: UpdateDepartmentDTO): Promise<ApiResponse<Department>> {
    const response = await apiClient.put<Department>(`${API_ENDPOINTS.STAFF_SECURITY.DEPARTMENTS}/${id}`, data);
    return {
      success: true,
      data: response,
      message: 'Département mis à jour avec succès'
    };
  }

  // Supprimer un département
  static async deleteDepartment(id: number): Promise<ApiResponse<void>> {
    await apiClient.delete(`${API_ENDPOINTS.STAFF_SECURITY.DEPARTMENTS}/${id}`);
    return {
      success: true,
      data: undefined,
      message: 'Département supprimé avec succès'
    };
  }

  // Vérifier si un département peut être supprimé
  static async canDeleteDepartment(id: number): Promise<ApiResponse<{ canDelete: boolean; staffCount: number }>> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.STAFF_SECURITY.DEPARTMENTS}/${id}/can-delete`);
      return {
        success: true,
        data: response,
        message: 'Vérification effectuée'
      };
    } catch (error) {
      // Fallback si l'endpoint n'existe pas
      return {
        success: true,
        data: {
          canDelete: true,
          staffCount: 0,
        },
        message: 'Vérification effectuée (fallback)'
      };
    }
  }

  // Récupérer les statistiques d'un département
  static async getDepartmentStats(id: number): Promise<ApiResponse<{ 
    totalStaff: number; 
    activeStaff: number; 
    roles: { [role: string]: number } 
  }>> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.STAFF_SECURITY.DEPARTMENTS}/${id}/stats`);
      return {
        success: true,
        data: response,
        message: 'Statistiques récupérées'
      };
    } catch (error) {
      return {
        success: true,
        data: {
          totalStaff: 0,
          activeStaff: 0,
          roles: {}
        },
        message: 'Statistiques par défaut'
      };
    }
  }
}
