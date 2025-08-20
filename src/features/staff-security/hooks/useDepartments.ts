import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DepartmentService } from '../services/department.service';
import { Department, CreateDepartmentDTO, UpdateDepartmentDTO, DepartmentWithRelations } from '../types/staff-security.types';

// Hook pour récupérer tous les départements
export function useDepartments() {
  return useQuery<DepartmentWithRelations[], Error>({
    queryKey: ['departments'],
    queryFn: async () => {
      console.log('🚀 Fetching departments...');
      try {
        const result = await DepartmentService.getDepartments();
        console.log('✅ Raw API response (departments):', result);
        
        // Gérer les différents formats de réponse
        let data: Department[];
        
        if (Array.isArray(result)) {
          data = result;
        } else if (result && typeof result === 'object' && 'data' in result) {
          data = (result as any).data;
        } else {
          throw new Error('Format de réponse API inattendu pour les départements');
        }
        
        // Enrichir chaque département
        const processedData: DepartmentWithRelations[] = data.map(department => ({
          ...department,
          canDelete: department.canDelete ?? (department.staff_count === 0),
          actualStaffCount: department.actualStaffCount ?? department.staff_count ?? 0,
          staff: department.staff ?? [],
        }));
        
        console.log('✅ Processed departments data:', processedData);
        return processedData;
      } catch (error) {
        console.error('❌ Error fetching departments:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pour récupérer un département par ID
export function useDepartment(id: number) {
  return useQuery<DepartmentWithRelations, Error>({
    queryKey: ['department', id],
    queryFn: async () => {
      console.log(`🚀 Fetching department ${id}...`);
      try {
        const result = await DepartmentService.getDepartment(id);
        console.log(`✅ Department ${id} response:`, result);
        
        // Gérer les formats de réponse
        let data: Department;
        
        if (result && typeof result === 'object' && 'data' in result) {
          data = (result as any).data;
        } else {
          data = result as Department;
        }
        
        // Enrichir avec les propriétés requises
        const processedData: DepartmentWithRelations = {
          ...data,
          canDelete: data.canDelete ?? (data.staff_count === 0),
          actualStaffCount: data.actualStaffCount ?? data.staff_count ?? 0,
          staff: data.staff ?? [],
        };
        
        console.log(`✅ Processed department ${id}:`, processedData);
        return processedData;
      } catch (error) {
        console.error(`❌ Error fetching department ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour créer un département
export function useCreateDepartment() {
  const queryClient = useQueryClient();
  
  return useMutation<Department, Error, CreateDepartmentDTO>({
    mutationFn: async (data) => {
      console.log('🚀 Creating department:', data);
      try {
        const result = await DepartmentService.createDepartment(data);
        console.log('✅ Department created:', result);
        
        if (result && typeof result === 'object' && 'data' in result) {
          return (result as any).data;
        }
        return result as Department;
      } catch (error) {
        console.error('❌ Error creating department:', error);
        throw error;
      }
    },
    onSuccess: (newDepartment) => {
      console.log('✅ Department created successfully:', newDepartment);
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
    onError: (error) => {
      console.error('❌ Failed to create department:', error);
    },
  });
}

// Hook pour mettre à jour un département
export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  
  return useMutation<Department, Error, { id: number; data: UpdateDepartmentDTO }>({
    mutationFn: async ({ id, data }) => {
      console.log(`🚀 Updating department ${id}:`, data);
      try {
        const result = await DepartmentService.updateDepartment(id, data);
        console.log(`✅ Department ${id} updated:`, result);
        
        if (result && typeof result === 'object' && 'data' in result) {
          return (result as any).data;
        }
        return result as Department;
      } catch (error) {
        console.error(`❌ Error updating department ${id}:`, error);
        throw error;
      }
    },
    onSuccess: (updatedDepartment, { id }) => {
      console.log(`✅ Department ${id} updated successfully:`, updatedDepartment);
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['department', id] });
      queryClient.invalidateQueries({ queryKey: ['staff'] }); // Invalider aussi staff car ils ont des départements
    },
    onError: (error, { id }) => {
      console.error(`❌ Failed to update department ${id}:`, error);
    },
  });
}

// Hook pour supprimer un département
export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      console.log(`🚀 Deleting department ${id}...`);
      try {
        await DepartmentService.deleteDepartment(id);
        console.log(`✅ Department ${id} deleted`);
      } catch (error) {
        console.error(`❌ Error deleting department ${id}:`, error);
        throw error;
      }
    },
    onSuccess: (_, id) => {
      console.log(`✅ Department ${id} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['department', id] });
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
    onError: (error, id) => {
      console.error(`❌ Failed to delete department ${id}:`, error);
    },
  });
}

// Hook pour vérifier si un département peut être supprimé
export function useCanDeleteDepartment(id: number) {
  return useQuery<{ canDelete: boolean; staffCount: number }, Error>({
    queryKey: ['department-can-delete', id],
    queryFn: async () => {
      console.log(`🚀 Checking if department ${id} can be deleted...`);
      try {
        const result = await DepartmentService.canDeleteDepartment(id);
        console.log(`✅ Department ${id} delete check:`, result);
        
        if (result && typeof result === 'object' && 'data' in result) {
          return (result as any).data;
        }
        
        return {
          canDelete: true,
          staffCount: 0,
        };
      } catch (error) {
        console.error(`❌ Error checking department ${id} deletion:`, error);
        return {
          canDelete: true,
          staffCount: 0,
        };
      }
    },
    enabled: !!id,
    staleTime: 30 * 1000, // 30 secondes
  });
}

// Hook pour obtenir les statistiques d'un département
export function useDepartmentStats(id: number) {
  return useQuery<{ totalStaff: number; activeStaff: number; roles: { [role: string]: number } }, Error>({
    queryKey: ['department-stats', id],
    queryFn: async () => {
      const result = await DepartmentService.getDepartmentStats(id);
      return result.data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook personnalisé pour rafraîchir les départements
export function useRefreshDepartments() {
  const queryClient = useQueryClient();
  
  return () => {
    console.log('🔄 Refreshing departments...');
    queryClient.invalidateQueries({ queryKey: ['departments'] });
  };
}

// Hook pour obtenir un département depuis le cache
export function useDepartmentFromCache(departmentId: number): DepartmentWithRelations | undefined {
  const queryClient = useQueryClient();
  const departments = queryClient.getQueryData<DepartmentWithRelations[]>(['departments']);
  
  return departments?.find(d => d.department_id === departmentId);
}
