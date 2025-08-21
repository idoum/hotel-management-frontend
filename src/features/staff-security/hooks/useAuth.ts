import React from 'react'; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AuthService } from '../services/auth.service';
import { 
  LoginRequest, 
  LoginResponse, 
  AuthUser, 
  ResetPasswordDTO 
} from '../types/staff-security.types';

// Hook principal pour l'état d'authentification
export function useAuth() {
  return useQuery<AuthUser | null>({
    queryKey: ['auth'],
    queryFn: () => AuthService.getUser(),
    staleTime: Infinity,
    retry: false,
  });
}

// Hook pour la connexion
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (credentials) => {
      console.log('🚀 Attempting login...');
      const result = await AuthService.login(credentials);
      console.log('✅ Login successful');
      return result;
    },
    onSuccess: (data) => {
      // Mettre à jour le cache d'authentification
      queryClient.setQueryData(['auth'], {
        ...data.user,
        isAuthenticated: true
      });
      
      // Rediriger vers le dashboard
      router.push('/dashboard');
    },
    onError: (error) => {
      console.error('❌ Login failed:', error);
    },
  });
}

// Hook pour la déconnexion
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      console.log('🚀 Logging out...');
      await AuthService.logout();
      console.log('✅ Logout successful');
    },
    onSuccess: () => {
      // Effacer tous les caches
      queryClient.clear();
      queryClient.setQueryData(['auth'], null);
      
      // Rediriger vers la page de connexion
      router.push('/login');
    },
    onError: (error) => {
      console.error('❌ Logout error:', error);
      // Même en cas d'erreur, on nettoie localement
      AuthService.clearAuth();
      queryClient.clear();
      router.push('/login');
    },
  });
}

// Hook pour obtenir le profil
export function useProfile() {
  const queryClient = useQueryClient();
  
  return useQuery<AuthUser>({
    queryKey: ['profile'],
    queryFn: async () => {
      const profile = await AuthService.getProfile();
      // Mettre à jour aussi le cache auth
      queryClient.setQueryData(['auth'], profile);
      return profile;
    },
    enabled: AuthService.isAuthenticated(),
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour vérifier le token
export function useVerifyToken() {
  const queryClient = useQueryClient();
  
  return useQuery<{ valid: boolean; user?: AuthUser }>({
    queryKey: ['verify-token'],
    queryFn: async () => {
      const result = await AuthService.verifyToken();
      if (result.valid && result.user) {
        queryClient.setQueryData(['auth'], result.user);
      } else {
        queryClient.setQueryData(['auth'], null);
      }
      return result;
    },
    enabled: !!AuthService.getToken(),
    retry: false,
    staleTime: 30 * 1000,
  });
}

// Hook pour réinitialiser le mot de passe
export function useResetPassword() {
  return useMutation<void, Error, ResetPasswordDTO>({
    mutationFn: async (data) => {
      await AuthService.resetPassword(data);
    },
  });
}

// Hook pour vérifier les permissions
export function usePermissions() {
  const { data: user } = useAuth();
  
  return {
    hasRole: (roleName: string) => {
      if (!user || !user.roles) return false;
      return user.roles.some(role => role.role_name === roleName);
    },
    
    hasPermission: (permissionName: string) => {
      if (!user || !user.permissions) return false;
      return user.permissions.includes(permissionName);
    },
    
    hasAnyRole: (roleNames: string[]) => {
      if (!user || !user.roles) return false;
      return roleNames.some(roleName => 
        user.roles.some(role => role.role_name === roleName)
      );
    },
    
    hasAnyPermission: (permissionNames: string[]) => {
      if (!user || !user.permissions) return false;
      return permissionNames.some(permissionName => 
        user.permissions.includes(permissionName)
      );
    },
    
    isAdmin: () => {
      return user?.roles?.some(role => role.role_name === 'admin') ?? false;
    },
    
    canAccess: (requiredPermission: string) => {
      return user?.permissions?.includes(requiredPermission) ?? false;
    }
  };
}

// Hook pour initialiser l'auth au démarrage de l'app
export function useInitializeAuth() {
  const queryClient = useQueryClient();
  
  React.useEffect(() => {
    console.log('🔄 Initializing auth...');
    
    // Configurer l'intercepteur axios avec le token
    AuthService.initializeAuth();
    
    // Récupérer l'utilisateur depuis localStorage
    const user = AuthService.getUser();
    if (user) {
      queryClient.setQueryData(['auth'], user);
      console.log('✅ Auth initialized with user:', user.username);
    } else {
      console.log('ℹ️ No user found in localStorage');
    }
  }, [queryClient]);
}

// Hook pour obtenir l'utilisateur actuel (alias pour useAuth)
export function useCurrentUser() {
  return useAuth();
}

// Hook pour vérifier si l'utilisateur est connecté
export function useIsAuthenticated() {
  const { data: user } = useAuth();
  return user?.isAuthenticated ?? false;
}
