'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@/features/staff-security/services/auth.service';
import { AuthUser } from '@/features/staff-security/types/staff-security.types';

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
  const queryClient = useQueryClient();
  
  // ✅ État local pour éviter les dépendances circulaires
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // ✅ S'assurer qu'on est côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialiser l'auth au démarrage - SEULEMENT côté client
  useEffect(() => {
    if (!isClient) return;

    console.log('🔄 AuthProvider: Initializing...');
    
    try {
      // Configurer l'intercepteur axios avec le token
      AuthService.initializeAuth();
      
      // Récupérer l'utilisateur depuis localStorage
      const storedUser = AuthService.getUser();
      if (storedUser) {
        setUser(storedUser);
        queryClient.setQueryData(['auth'], storedUser);
        console.log('✅ AuthProvider: User restored from storage:', storedUser.username);
      } else {
        console.log('ℹ️ AuthProvider: No user found in localStorage');
      }
    } catch (error) {
      console.error('❌ AuthProvider: Error during initialization:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isClient, queryClient]);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: user?.isAuthenticated ?? false,
    isLoading,
    
    login: async (credentials) => {
      try {
        console.log('🚀 AuthProvider: Login attempt...');
        const result = await AuthService.login(credentials);
        const newUser = {
          ...result.user,
          isAuthenticated: true
        };
        setUser(newUser);
        queryClient.setQueryData(['auth'], newUser);
        console.log('✅ AuthProvider: Login successful');
      } catch (error) {
        console.error('❌ AuthProvider: Login failed:', error);
        throw error;
      }
    },
    
    logout: async () => {
      try {
        console.log('🚀 AuthProvider: Logout attempt...');
        await AuthService.logout();
        setUser(null);
        queryClient.clear();
        queryClient.setQueryData(['auth'], null);
        console.log('✅ AuthProvider: Logout successful');
      } catch (error) {
        console.error('❌ AuthProvider: Logout error:', error);
        // Même en cas d'erreur serveur, nettoyer côté client
        AuthService.clearAuth();
        setUser(null);
        queryClient.clear();
        queryClient.setQueryData(['auth'], null);
      }
    },
    
    hasRole: (roleName: string) => {
      if (!user || !user.roles) return false;
      return user.roles.some(role => role.role_name === roleName);
    },
    
    hasPermission: (permissionName: string) => {
      if (!user || !user.permissions) return false;
      return user.permissions.includes(permissionName);
    },
  };

  // ✅ Ne pas rendre tant qu'on n'est pas côté client
  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
