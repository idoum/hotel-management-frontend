'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@/features/staff-security/services/auth.service';
import { AuthUser } from '@/features/staff-security/types/staff-security.types';
import { useAuth } from '@/features/staff-security/hooks/useAuth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roleName: string) => boolean;
  hasPermission: (permissionName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const { data: user, isLoading } = useAuth();
  const queryClient = useQueryClient();

  // Initialiser l'auth au démarrage - SANS dépendances pour éviter les boucles
  useEffect(() => {
    console.log('🔄 AuthProvider: Initializing...');
    
    try {
      // Configurer l'intercepteur axios avec le token
      AuthService.initializeAuth();
      
      // Récupérer l'utilisateur depuis localStorage
      const storedUser = AuthService.getUser();
      if (storedUser) {
        queryClient.setQueryData(['auth'], storedUser);
        console.log('✅ AuthProvider: User restored from storage:', storedUser.username);
      } else {
        console.log('ℹ️ AuthProvider: No user found in localStorage');
      }
    } catch (error) {
      console.error('❌ AuthProvider: Error during initialization:', error);
    }
  }, []); // ✅ Pas de dépendances pour éviter les re-renders infinis

  const contextValue: AuthContextType = {
    user: user || null,
    isAuthenticated: user?.isAuthenticated ?? false,
    isLoading,
    
    login: async (credentials) => {
      const result = await AuthService.login(credentials);
      queryClient.setQueryData(['auth'], {
        ...result.user,
        isAuthenticated: true
      });
    },
    
    logout: async () => {
      await AuthService.logout();
      queryClient.clear();
      queryClient.setQueryData(['auth'], null);
    },
    
    hasRole: (roleName: string) => {
      return AuthService.hasRole(roleName);
    },
    
    hasPermission: (permissionName: string) => {
      return AuthService.hasPermission(permissionName);
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook pour utiliser le context
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
