import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RoleService } from '../services/role.service';
import { Role, CreateRoleDTO, UpdateRoleDTO, RoleWithRelations, UpdateRolePermissionsDTO } from '../types/staff-security.types';
import React from 'react';

// Hook pour récupérer tous les rôles
export function useRoles() {
  return useQuery<RoleWithRelations[], Error>({
    queryKey: ['roles'],
    queryFn: async () => {
      console.log('🚀 Fetching roles...');
      try {
        const result = await RoleService.getRoles();
        console.log('✅ Raw API response (roles):', result);
        
        // Gérer les différents formats de réponse
        let data: Role[];
        
        if (Array.isArray(result)) {
          // Format: [...] (backend actuel)
          data = result;
        } else if (result && typeof result === 'object' && 'data' in result) {
          // Format: {data: [...]}
          data = (result as any).data;
        } else {
          throw new Error('Format de réponse API inattendu pour les rôles');
        }
        
        // Enrichir chaque rôle avec les propriétés requises
        const processedData: RoleWithRelations[] = data.map(role => ({
          ...role,
          canDelete: role.canDelete ?? true,
          usersCount: role.usersCount ?? 0,
          permissionsCount: role.permissionsCount ?? 0,
          permissions: role.permissions ?? [],
          users: role.users ?? [],
        }));
        
        console.log('✅ Processed roles data:', processedData);
        return processedData;
      } catch (error) {
        console.error('❌ Error fetching roles:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pour récupérer un rôle par ID
export function useRole(id: number) {
  return useQuery<RoleWithRelations, Error>({
    queryKey: ['role', id],
    queryFn: async () => {
      console.log(`🚀 Fetching role ${id}...`);
      try {
        const result = await RoleService.getRole(id);
        console.log(`✅ Role ${id} response:`, result);
        
        // Gérer les formats de réponse
        let data: Role;
        
        if (result && typeof result === 'object' && 'data' in result) {
          data = (result as any).data;
        } else {
          data = result as Role;
        }
        
        // Enrichir avec les propriétés requises
        const processedData: RoleWithRelations = {
          ...data,
          canDelete: data.canDelete ?? true,
          usersCount: data.usersCount ?? 0,
          permissionsCount: data.permissionsCount ?? 0,
          permissions: data.permissions ?? [],
          users: data.users ?? [],
        };
        
        console.log(`✅ Processed role ${id}:`, processedData);
        return processedData;
      } catch (error) {
        console.error(`❌ Error fetching role ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour créer un rôle
export function useCreateRole() {
  const queryClient = useQueryClient();
  
  return useMutation<Role, Error, CreateRoleDTO & { permissionIds?: number[] }>({
    mutationFn: async (data) => {
      console.log('🚀 Creating role:', data);
      try {
        const result = await RoleService.createRole(data);
        console.log('✅ Role created:', result);
        
        // Gérer les formats de réponse
        if (result && typeof result === 'object' && 'data' in result) {
          return (result as any).data;
        }
        return result as Role;
      } catch (error) {
        console.error('❌ Error creating role:', error);
        throw error;
      }
    },
    onSuccess: (newRole, variables) => {
      console.log('✅ Role created successfully:', newRole);
      // Invalider le cache des rôles pour refetch
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      
      // Si des permissions ont été assignées, invalider aussi le cache des permissions
      if (variables.permissionIds && variables.permissionIds.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['permissions'] });
      }
    },
    onError: (error, variables) => {
      console.error('❌ Failed to create role:', error);
      console.error('❌ Variables:', variables);
    },
  });
}

// Hook pour mettre à jour un rôle
export function useUpdateRole() {
  const queryClient = useQueryClient();
  
  return useMutation<Role, Error, { id: number; data: UpdateRoleDTO }>({
    mutationFn: async ({ id, data }) => {
      console.log(`🚀 Updating role ${id}:`, data);
      try {
        const result = await RoleService.updateRole(id, data);
        console.log(`✅ Role ${id} updated:`, result);
        
        // Gérer les formats de réponse
        if (result && typeof result === 'object' && 'data' in result) {
          return (result as any).data;
        }
        return result as Role;
      } catch (error) {
        console.error(`❌ Error updating role ${id}:`, error);
        throw error;
      }
    },
    onSuccess: (updatedRole, { id }) => {
      console.log(`✅ Role ${id} updated successfully:`, updatedRole);
      // Invalider les caches pertinents
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', id] });
    },
    onError: (error, { id }) => {
      console.error(`❌ Failed to update role ${id}:`, error);
    },
  });
}

// Hook pour supprimer un rôle
export function useDeleteRole() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      console.log(`🚀 Deleting role ${id}...`);
      try {
        await RoleService.deleteRole(id);
        console.log(`✅ Role ${id} deleted`);
      } catch (error) {
        console.error(`❌ Error deleting role ${id}:`, error);
        throw error;
      }
    },
    onSuccess: (_, id) => {
      console.log(`✅ Role ${id} deleted successfully`);
      // Invalider les caches pertinents
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', id] });
      queryClient.invalidateQueries({ queryKey: ['role-permissions', id] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] }); // Les permissions peuvent montrer les rôles liés
    },
    onError: (error, id) => {
      console.error(`❌ Failed to delete role ${id}:`, error);
    },
  });
}

// Hook pour vérifier si un rôle peut être supprimé
export function useCanDeleteRole(id: number) {
  return useQuery<{ canDelete: boolean; usersCount: number; permissionsCount: number }, Error>({
    queryKey: ['role-can-delete', id],
    queryFn: async () => {
      console.log(`🚀 Checking if role ${id} can be deleted...`);
      try {
        const result = await RoleService.canDeleteRole(id);
        console.log(`✅ Role ${id} delete check:`, result);
        
        // Gérer les formats de réponse
        if (result && typeof result === 'object' && 'data' in result) {
          return (result as any).data;
        }
        
        // Fallback si l'endpoint n'existe pas encore
        return {
          canDelete: true,
          usersCount: 0,
          permissionsCount: 0,
        };
      } catch (error) {
        console.error(`❌ Error checking role ${id} deletion:`, error);
        // En cas d'erreur, on permet la suppression par défaut
        return {
          canDelete: true,
          usersCount: 0,
          permissionsCount: 0,
        };
      }
    },
    enabled: !!id,
    staleTime: 30 * 1000, // 30 secondes
  });
}

// Hook pour récupérer les permissions d'un rôle
export function useRolePermissions(roleId: number) {
  return useQuery<number[], Error>({
    queryKey: ['role-permissions', roleId],
    queryFn: async () => {
      console.log(`🚀 Fetching permissions for role ${roleId}...`);
      try {
        const result = await RoleService.getRolePermissions(roleId);
        console.log(`✅ Role ${roleId} permissions:`, result);
        
        // Gérer les formats de réponse
        if (result && typeof result === 'object' && 'data' in result) {
          const data = (result as any).data;
          
          // Si c'est un tableau d'objets permission, extraire les IDs
          if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
            return data.map((p: any) => p.permission_id);
          }
          
          // Si c'est déjà un tableau d'IDs
          return Array.isArray(data) ? data : [];
        }
        
        // Si c'est directement un tableau
        if (Array.isArray(result)) {
          // Tableau d'objets permission
          if (result.length > 0 && typeof result[0] === 'object') {
            return result.map((p: any) => p.permission_id);
          }
          // Tableau d'IDs
          return result;
        }
        
        return [];
      } catch (error) {
        console.error(`❌ Error fetching role ${roleId} permissions:`, error);
        // En cas d'erreur, retourner un tableau vide
        return [];
      }
    },
    enabled: !!roleId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook pour mettre à jour les permissions d'un rôle
export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { roleId: number; permissionIds: number[] }>({
    mutationFn: async ({ roleId, permissionIds }) => {
      console.log(`🚀 Updating permissions for role ${roleId}:`, permissionIds);
      try {
        const result = await RoleService.updateRolePermissions(roleId, { permissionIds });
        console.log(`✅ Role ${roleId} permissions updated:`, result);
        
        // Gérer les formats de réponse si nécessaire
        if (result && typeof result === 'object' && 'data' in result) {
          return (result as any).data;
        }
        return result as void;
      } catch (error) {
        console.error(`❌ Error updating role ${roleId} permissions:`, error);
        throw error;
      }
    },
    onSuccess: (_, { roleId }) => {
      console.log(`✅ Role ${roleId} permissions updated successfully`);
      // Invalider les caches pertinents
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', roleId] });
      queryClient.invalidateQueries({ queryKey: ['role-permissions', roleId] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] }); // Les permissions montrent les rôles liés
    },
    onError: (error, { roleId }) => {
      console.error(`❌ Failed to update role ${roleId} permissions:`, error);
    },
  });
}

// Hook personnalisé pour rafraîchir les rôles
export function useRefreshRoles() {
  const queryClient = useQueryClient();
  
  return () => {
    console.log('🔄 Refreshing roles...');
    queryClient.invalidateQueries({ queryKey: ['roles'] });
  };
}

// Hook pour obtenir un rôle depuis le cache (sans requête réseau)
export function useRoleFromCache(roleId: number): RoleWithRelations | undefined {
  const queryClient = useQueryClient();
  const roles = queryClient.getQueryData<RoleWithRelations[]>(['roles']);
  
  return roles?.find(r => r.role_id === roleId);
}

// Hook pour obtenir les statistiques des rôles depuis le cache
export function useRolesStats() {
  const queryClient = useQueryClient();
  const roles = queryClient.getQueryData<RoleWithRelations[]>(['roles']);
  
  if (!roles) {
    return {
      total: 0,
      canDelete: 0,
      withUsers: 0,
      withPermissions: 0,
    };
  }
  
  return {
    total: roles.length,
    canDelete: roles.filter(r => r.canDelete).length,
    withUsers: roles.filter(r => r.usersCount > 0).length,
    withPermissions: roles.filter(r => r.permissionsCount > 0).length,
  };
}

// Hook pour précharger un rôle spécifique
export function usePrefetchRole() {
  const queryClient = useQueryClient();
  
  return (roleId: number) => {
    console.log(`🔮 Prefetching role ${roleId}...`);
    queryClient.prefetchQuery({
      queryKey: ['role', roleId],
      queryFn: async () => {
        const result = await RoleService.getRole(roleId);
        return result && typeof result === 'object' && 'data' in result 
          ? (result as any).data 
          : result;
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}

// Hook pour créer un rôle avec permissions en une seule opération
export function useCreateRoleWithPermissions() {
  const queryClient = useQueryClient();
  const createRole = useCreateRole();
  const updateRolePermissions = useUpdateRolePermissions();
  
  return useMutation<Role, Error, CreateRoleDTO & { permissionIds?: number[] }>({
    mutationFn: async (data) => {
      console.log('🚀 Creating role with permissions:', data);
      
      // Étape 1 : Créer le rôle
      const { permissionIds, ...roleData } = data;
      const newRole = await createRole.mutateAsync(roleData);
      
      // Étape 2 : Assigner les permissions si spécifiées
      if (permissionIds && permissionIds.length > 0) {
        await updateRolePermissions.mutateAsync({
          roleId: newRole.role_id,
          permissionIds,
        });
      }
      
      return newRole;
    },
    onSuccess: (newRole, data) => {
      console.log('✅ Role with permissions created successfully:', newRole);
      // Les invalidations sont gérées par les mutations individuelles
    },
    onError: (error, data) => {
      console.error('❌ Failed to create role with permissions:', error);
    },
  });
}

// Hook pour dupliquer un rôle (copier avec nouveau nom)
export function useDuplicateRole() {
  const queryClient = useQueryClient();
  const createRole = useCreateRole();
  const updateRolePermissions = useUpdateRolePermissions();
  const { data: roles } = useRoles();
  
  return useMutation<Role, Error, { originalRoleId: number; newRoleName: string; newDescription?: string }>({
    mutationFn: async ({ originalRoleId, newRoleName, newDescription }) => {
      console.log(`🚀 Duplicating role ${originalRoleId} as "${newRoleName}"`);
      
      // Trouver le rôle original
      const originalRole = roles?.find(r => r.role_id === originalRoleId);
      if (!originalRole) {
        throw new Error('Rôle original non trouvé');
      }
      
      // Créer le nouveau rôle
      const newRole = await createRole.mutateAsync({
        role_name: newRoleName,
        description: newDescription || `Copie de ${originalRole.role_name}`,
      });
      
      // Copier les permissions si le rôle original en a
      if (originalRole.permissions && originalRole.permissions.length > 0) {
        const permissionIds = originalRole.permissions.map(p => p.permission_id);
        await updateRolePermissions.mutateAsync({
          roleId: newRole.role_id,
          permissionIds,
        });
      }
      
      return newRole;
    },
    onSuccess: (newRole, { originalRoleId, newRoleName }) => {
      console.log(`✅ Role ${originalRoleId} duplicated as "${newRoleName}":`, newRole);
    },
    onError: (error, { originalRoleId, newRoleName }) => {
      console.error(`❌ Failed to duplicate role ${originalRoleId} as "${newRoleName}":`, error);
    },
  });
}

// Hook pour effectuer une recherche locale dans les rôles
export function useSearchRoles(searchTerm: string) {
  const { data: roles, ...rest } = useRoles();
  
  const filteredRoles = React.useMemo(() => {
    if (!roles || !searchTerm.trim()) return roles;
    
    const term = searchTerm.toLowerCase();
    return roles.filter(role =>
      role.role_name.toLowerCase().includes(term) ||
      (role.description?.toLowerCase().includes(term) ?? false)
    );
  }, [roles, searchTerm]);
  
  return {
    data: filteredRoles,
    ...rest,
  };
}

// Hook pour surveiller les changements sur un rôle spécifique
export function useWatchRole(roleId: number, callback: (role: RoleWithRelations | undefined) => void) {
  const { data: roles } = useRoles();
  
  React.useEffect(() => {
    if (roles) {
      const role = roles.find(r => r.role_id === roleId);
      callback(role);
    }
  }, [roles, roleId, callback]);
}
