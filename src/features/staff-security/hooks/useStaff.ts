import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StaffService } from '../services/staff.service';
import { Staff, CreateStaffDTO, UpdateStaffDTO, StaffWithRelations, StaffFilters } from '../types/staff-security.types';

// Hook pour récupérer tous les employés
export function useStaff(filters?: StaffFilters) {
  return useQuery<StaffWithRelations[], Error>({
    queryKey: ['staff', filters],
    queryFn: async () => {
      console.log('🚀 Fetching staff...', filters);
      try {
        const result = await StaffService.getStaff(filters);
        console.log('✅ Raw API response (staff):', result);
        
        // Gérer les différents formats de réponse
        let data: Staff[];
        
        if (Array.isArray(result)) {
          data = result;
        } else if (result && typeof result === 'object' && 'data' in result) {
          data = (result as any).data;
        } else {
          throw new Error('Format de réponse API inattendu pour les employés');
        }
        
        // Enrichir chaque employé
        const processedData: StaffWithRelations[] = data.map(staff => ({
          ...staff,
          canDelete: staff.canDelete ?? true,
          isActive: staff.isActive ?? true,
          department: staff.department ?? undefined,
        }));
        
        console.log('✅ Processed staff data:', processedData);
        return processedData;
      } catch (error) {
        console.error('❌ Error fetching staff:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook pour récupérer un employé par ID
export function useStaffById(id: number) {
  return useQuery<StaffWithRelations, Error>({
    queryKey: ['staff', id],
    queryFn: async () => {
      console.log(`🚀 Fetching staff ${id}...`);
      try {
        const result = await StaffService.getStaffById(id);
        console.log(`✅ Staff ${id} response:`, result);
        
        let data: Staff;
        if (result && typeof result === 'object' && 'data' in result) {
          data = (result as any).data;
        } else {
          data = result as Staff;
        }
        
        const processedData: StaffWithRelations = {
          ...data,
          canDelete: data.canDelete ?? true,
          isActive: data.isActive ?? true,
          department: data.department ?? undefined,
        };
        
        return processedData;
      } catch (error) {
        console.error(`❌ Error fetching staff ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour créer un employé
export function useCreateStaff() {
  const queryClient = useQueryClient();
  
  return useMutation<Staff, Error, CreateStaffDTO>({
    mutationFn: async (data) => {
      console.log('🚀 Creating staff:', data);
      try {
        const result = await StaffService.createStaff(data);
        console.log('✅ Staff created:', result);
        
        if (result && typeof result === 'object' && 'data' in result) {
          return (result as any).data;
        }
        return result as Staff;
      } catch (error) {
        console.error('❌ Error creating staff:', error);
        throw error;
      }
    },
    onSuccess: (newStaff) => {
      console.log('✅ Staff created successfully:', newStaff);
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] }); // Mettre à jour les compteurs de départements
    },
    onError: (error) => {
      console.error('❌ Failed to create staff:', error);
    },
  });
}

// Hook pour mettre à jour un employé
export function useUpdateStaff() {
  const queryClient = useQueryClient();
  
  return useMutation<Staff, Error, { id: number; data: UpdateStaffDTO }>({
    mutationFn: async ({ id, data }) => {
      console.log(`🚀 Updating staff ${id}:`, data);
      try {
        const result = await StaffService.updateStaff(id, data);
        console.log(`✅ Staff ${id} updated:`, result);
        
        if (result && typeof result === 'object' && 'data' in result) {
          return (result as any).data;
        }
        return result as Staff;
      } catch (error) {
        console.error(`❌ Error updating staff ${id}:`, error);
        throw error;
      }
    },
    onSuccess: (updatedStaff, { id }) => {
      console.log(`✅ Staff ${id} updated successfully:`, updatedStaff);
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['staff', id] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
    onError: (error, { id }) => {
      console.error(`❌ Failed to update staff ${id}:`, error);
    },
  });
}

// Hook pour supprimer un employé
export function useDeleteStaff() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      console.log(`🚀 Deleting staff ${id}...`);
      try {
        await StaffService.deleteStaff(id);
        console.log(`✅ Staff ${id} deleted`);
      } catch (error) {
        console.error(`❌ Error deleting staff ${id}:`, error);
        throw error;
      }
    },
    onSuccess: (_, id) => {
      console.log(`✅ Staff ${id} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['staff', id] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
    onError: (error, id) => {
      console.error(`❌ Failed to delete staff ${id}:`, error);
    },
  });
}

// Hook pour vérifier si un employé peut être supprimé
export function useCanDeleteStaff(id: number) {
  return useQuery<{ canDelete: boolean; reason?: string }, Error>({
    queryKey: ['staff-can-delete', id],
    queryFn: async () => {
      console.log(`🚀 Checking if staff ${id} can be deleted...`);
      try {
        const result = await StaffService.canDeleteStaff(id);
        console.log(`✅ Staff ${id} delete check:`, result);
        
        if (result && typeof result === 'object' && 'data' in result) {
          return (result as any).data;
        }
        
        return { canDelete: true };
      } catch (error) {
        console.error(`❌ Error checking staff ${id} deletion:`, error);
        return { canDelete: true };
      }
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

// Hook pour obtenir les statistiques des employés
export function useStaffStats() {
  return useQuery({
    queryKey: ['staff-stats'],
    queryFn: async () => {
      const result = await StaffService.getStaffStats();
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour activer/désactiver un employé
export function useToggleStaffStatus() {
  const queryClient = useQueryClient();
  
  return useMutation<Staff, Error, { id: number; isActive: boolean }>({
    mutationFn: async ({ id, isActive }) => {
      const result = await StaffService.toggleStaffStatus(id, isActive);
      return result.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['staff', id] });
    },
  });
}

// Hook personnalisé pour rafraîchir les employés
export function useRefreshStaff() {
  const queryClient = useQueryClient();
  
  return () => {
    console.log('🔄 Refreshing staff...');
    queryClient.invalidateQueries({ queryKey: ['staff'] });
  };
}

// Hook pour obtenir un employé depuis le cache
export function useStaffFromCache(staffId: number): StaffWithRelations | undefined {
  const queryClient = useQueryClient();
  const staff = queryClient.getQueryData<StaffWithRelations[]>(['staff']);
  
  return staff?.find(s => s.staff_id === staffId);
}
