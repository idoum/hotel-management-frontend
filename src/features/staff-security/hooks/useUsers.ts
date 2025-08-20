import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '../services/user.service';
import { 
  User, 
  CreateUserDTO, 
  UpdateUserDTO, 
  UserWithRelations, 
  UserFilters,
  UpdatePasswordDTO,
  UpdateUserRolesDTO 
} from '../types/staff-security.types';

// Hook pour récupérer tous les utilisateurs
export function useUsers(filters?: UserFilters) {
  return useQuery<UserWithRelations[], Error>({
    queryKey: ['users', filters],
    queryFn: async () => {
      console.log('🚀 Fetching users...', filters);
      const result = await UserService.getUsers(filters);
      console.log('✅ Users fetched:', result.length);
      return result;
    },
    retry: 1,
    staleTime: 2 * 60 * 1000,
  });
}

// Hook pour récupérer un utilisateur par ID
export function useUser(id: number) {
  return useQuery<UserWithRelations, Error>({
    queryKey: ['user', id],
    queryFn: async () => {
      const result = await UserService.getUser(id);
      return result.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour créer un utilisateur
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation<User, Error, CreateUserDTO>({
    mutationFn: async (data) => {
      const result = await UserService.createUser(data);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['staff'] }); // Car on associe un staff à un user
    },
  });
}

// Hook pour mettre à jour un utilisateur
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation<User, Error, { id: number; data: UpdateUserDTO }>({
    mutationFn: async ({ id, data }) => {
      const result = await UserService.updateUser(id, data);
      return result.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
}

// Hook pour supprimer un utilisateur
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await UserService.deleteUser(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
}

// Hook pour récupérer les rôles d'un utilisateur
export function useUserRoles(userId: number) {
  return useQuery<number[], Error>({
    queryKey: ['user-roles', userId],
    queryFn: async () => {
      const result = await UserService.getUserRoles(userId);
      return result.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

// Hook pour mettre à jour les rôles d'un utilisateur
export function useUpdateUserRoles() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { userId: number; roleIds: number[] }>({
    mutationFn: async ({ userId, roleIds }) => {
      await UserService.updateUserRoles(userId, { role_ids: roleIds });
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['user-roles', userId] });
    },
  });
}

// Hook pour récupérer les permissions d'un utilisateur
export function useUserPermissions(userId: number) {
  return useQuery<string[], Error>({
    queryKey: ['user-permissions', userId],
    queryFn: async () => {
      const result = await UserService.getUserPermissions(userId);
      return result.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour changer le mot de passe
export function useUpdatePassword() {
  return useMutation<void, Error, { userId: number; data: UpdatePasswordDTO }>({
    mutationFn: async ({ userId, data }) => {
      await UserService.updatePassword(userId, data);
    },
  });
}
