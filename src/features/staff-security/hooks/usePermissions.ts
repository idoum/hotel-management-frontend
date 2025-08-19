import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PermissionService } from '../services/permission.service';
import { Permission, CreatePermissionDTO, UpdatePermissionDTO, PermissionWithRoles } from '../types/staff-security.types';

// Hook pour récupérer toutes les permissions
export function usePermissions() {
  return useQuery<PermissionWithRoles[], Error>({
    queryKey: ['permissions'],
    queryFn: async () => {
      console.log('🚀 Fetching permissions...');
      try {
        const result = await PermissionService.getPermissions();
        console.log('✅ Raw API response:', result);
        
        // Gérer les différents formats de réponse
        let data: Permission[];
        
        if (Array.isArray(result)) {
          // Format: [...] (ton backend actuel)
          data = result;
        } else if (result && typeof result === 'object' && 'data' in result) {
          // Format: {data: [...]}
          data = (result as any).data;
        } else {
          throw new Error('Format de réponse API inattendu');
        }
        
        // Enrichir chaque permission avec les propriétés requises
        const processedData: PermissionWithRoles[] = data.map(permission => ({
          ...permission,
          canDelete: true, // Par défaut, à adapter selon ta logique backend
          roles: [], // Par défaut vide, sera rempli si ton backend fournit cette info
        }));
        
        console.log('✅ Processed data:', processedData);
        return processedData;
      } catch (error) {
        console.error('❌ Error fetching permissions:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pour récupérer une permission par ID
export function usePermission(id: number) {
  return useQuery<PermissionWithRoles, Error>({
    queryKey: ['permission', id],
    queryFn: async () => {
      console.log(`🚀 Fetching permission ${id}...`);
      try {
        const result = await PermissionService.getPermission(id);
        console.log(`✅ Permission ${id} response:`, result);
        
        // Gérer les formats de réponse
        let data: Permission;
        
        if (result && typeof result === 'object' && 'data' in result) {
          data = (result as any).data;
        } else {
          data = result as Permission;
        }
        
        // Enrichir avec les propriétés requises
        const processedData: PermissionWithRoles = {
          ...data,
          canDelete: true,
          roles: [],
        };
        
        return processedData;
      } catch (error) {
        console.error(`❌ Error fetching permission ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour créer une permission
export function useCreatePermission() {
  const queryClient = useQueryClient();
  
  return useMutation<Permission, Error, CreatePermissionDTO>({
    mutationFn: async (data) => {
      console.log('🚀 Creating permission:', data);
      try {
        const result = await PermissionService.createPermission(data);
        console.log('✅ Permission created:', result);
        
        // Gérer les formats de réponse
        if (result && typeof result === 'object' && 'data' in result) {
          return (result as any).data;
        }
        return result as Permission;
      } catch (error) {
        console.error('❌ Error creating permission:', error);
        throw error;
      }
    },
    onSuccess: (newPermission) => {
      console.log('✅ Permission created successfully:', newPermission);
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
    onError: (error) => {
      console.error('❌ Failed to create permission:', error);
    },
  });
}

// Hook pour mettre à jour une permission
export function useUpdatePermission() {
  const queryClient = useQueryClient();
  
  return useMutation<Permission, Error, { id: number; data: UpdatePermissionDTO }>({
    mutationFn: async ({ id, data }) => {
      console.log(`🚀 Updating permission ${id}:`, data);
      try {
        const result = await PermissionService.updatePermission(id, data);
        console.log(`✅ Permission ${id} updated:`, result);
        
        // Gérer les formats de réponse
        if (result && typeof result === 'object' && 'data' in result) {
          return (result as any).data;
        }
        return result as Permission;
      } catch (error) {
        console.error(`❌ Error updating permission ${id}:`, error);
        throw error;
      }
    },
    onSuccess: (updatedPermission, { id }) => {
      console.log(`✅ Permission ${id} updated successfully:`, updatedPermission);
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({ queryKey: ['permission', id] });
    },
    onError: (error, { id }) => {
      console.error(`❌ Failed to update permission ${id}:`, error);
    },
  });
}

// Hook pour supprimer une permission
export function useDeletePermission() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      console.log(`🚀 Deleting permission ${id}...`);
      try {
        await PermissionService.deletePermission(id);
        console.log(`✅ Permission ${id} deleted`);
      } catch (error) {
        console.error(`❌ Error deleting permission ${id}:`, error);
        throw error;
      }
    },
    onSuccess: (_, id) => {
      console.log(`✅ Permission ${id} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({ queryKey: ['permission', id] });
    },
    onError: (error, id) => {
      console.error(`❌ Failed to delete permission ${id}:`, error);
    },
  });
}

// Hook pour vérifier si une permission peut être supprimée
export function useCanDeletePermission(id: number) {
  return useQuery<{ canDelete: boolean; rolesCount: number }, Error>({
    queryKey: ['permission-can-delete', id],
    queryFn: async () => {
      console.log(`🚀 Checking if permission ${id} can be deleted...`);
      try {
        const result = await PermissionService.canDeletePermission(id);
        console.log(`✅ Permission ${id} delete check:`, result);
        
        // Gérer les formats de réponse
        if (result && typeof result === 'object' && 'data' in result) {
          return (result as any).data;
        }
        
        // Fallback si l'endpoint n'existe pas encore
        return {
          canDelete: true,
          rolesCount: 0,
        };
      } catch (error) {
        console.error(`❌ Error checking permission ${id} deletion:`, error);
        // En cas d'erreur, on permet la suppression par défaut
        return {
          canDelete: true,
          rolesCount: 0,
        };
      }
    },
    enabled: !!id,
    staleTime: 30 * 1000, // 30 secondes
  });
}

// Hook personnalisé pour rafraîchir les permissions
export function useRefreshPermissions() {
  const queryClient = useQueryClient();
  
  return () => {
    console.log('🔄 Refreshing permissions...');
    queryClient.invalidateQueries({ queryKey: ['permissions'] });
  };
}

// Hook pour obtenir une permission depuis le cache (sans requête réseau)
export function usePermissionFromCache(id: number): PermissionWithRoles | undefined {
  const queryClient = useQueryClient();
  const permissions = queryClient.getQueryData<PermissionWithRoles[]>(['permissions']);
  
  return permissions?.find(p => p.permission_id === id);
}
