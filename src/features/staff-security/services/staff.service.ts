import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/types/common';
import { Staff, CreateStaffDTO, UpdateStaffDTO, StaffWithRelations, StaffFilters } from '../types/staff-security.types';
import { API_ENDPOINTS } from '@/lib/constants';

export class StaffService {
  // Récupérer tous les employés
  static async getStaff(filters?: StaffFilters): Promise<StaffWithRelations[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.STAFF_SECURITY.STAFF}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get<StaffWithRelations[]>(url);
    
    // Enrichir chaque employé avec les propriétés manquantes
    return Array.isArray(response) ? response.map(staff => ({
      ...staff,
      canDelete: staff.canDelete ?? true,
      isActive: staff.isActive ?? true,
      department: staff.department ?? undefined,
    })) : [];
  }

  // Récupérer un employé par ID
  static async getStaffById(id: number): Promise<ApiResponse<StaffWithRelations>> {
    const response = await apiClient.get<Staff>(`${API_ENDPOINTS.STAFF_SECURITY.STAFF}/${id}`);
    
    const staffWithRelations: StaffWithRelations = {
      ...response,
      canDelete: true,
      isActive: true,
      department: undefined,
    };
    
    return {
      success: true,
      data: staffWithRelations,
      message: 'Employé trouvé'
    };
  }

  // Créer un nouvel employé
  static async createStaff(data: CreateStaffDTO): Promise<ApiResponse<Staff>> {
    const response = await apiClient.post<Staff>(API_ENDPOINTS.STAFF_SECURITY.STAFF, data);
    return {
      success: true,
      data: response,
      message: 'Employé créé avec succès'
    };
  }

  // Mettre à jour un employé
  static async updateStaff(id: number, data: UpdateStaffDTO): Promise<ApiResponse<Staff>> {
    const response = await apiClient.put<Staff>(`${API_ENDPOINTS.STAFF_SECURITY.STAFF}/${id}`, data);
    return {
      success: true,
      data: response,
      message: 'Employé mis à jour avec succès'
    };
  }

  // Supprimer un employé
  static async deleteStaff(id: number): Promise<ApiResponse<void>> {
    await apiClient.delete(`${API_ENDPOINTS.STAFF_SECURITY.STAFF}/${id}`);
    return {
      success: true,
      data: undefined,
      message: 'Employé supprimé avec succès'
    };
  }

  // Vérifier si un employé peut être supprimé
  static async canDeleteStaff(id: number): Promise<ApiResponse<{ canDelete: boolean; reason?: string }>> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.STAFF_SECURITY.STAFF}/${id}/can-delete`);
      return {
        success: true,
        data: response,
        message: 'Vérification effectuée'
      };
    } catch (error) {
      return {
        success: true,
        data: { canDelete: true },
        message: 'Vérification effectuée (fallback)'
      };
    }
  }

  // Récupérer les statistiques des employés
  static async getStaffStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    byDepartment: { [departmentName: string]: number };
    averageSalary: number;
    averageAge: number;
  }>> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.STAFF_SECURITY.STAFF}/stats`);
      return {
        success: true,
        data: response,
        message: 'Statistiques récupérées'
      };
    } catch (error) {
      return {
        success: true,
        data: {
          total: 0,
          active: 0,
          byDepartment: {},
          averageSalary: 0,
          averageAge: 0,
        },
        message: 'Statistiques par défaut'
      };
    }
  }

  // Activer/désactiver un employé
  static async toggleStaffStatus(id: number, isActive: boolean): Promise<ApiResponse<Staff>> {
    const response = await apiClient.patch<Staff>(`${API_ENDPOINTS.STAFF_SECURITY.STAFF}/${id}/status`, { isActive });
    return {
      success: true,
      data: response,
      message: `Employé ${isActive ? 'activé' : 'désactivé'} avec succès`
    };
  }
}
