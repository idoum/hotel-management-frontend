// src/providers/AuthProvider.tsx - VERSION CORRIGÉE
'use client';

import React, { createContext, useContext, useEffect } from 'react';
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
  
  // ✅ État local au lieu d'utiliser useAuth()
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Initialiser l'auth au démarrage
  useEffect(() => {
    console.log('🔄 AuthProvider: Initializing...');
    
    try {
      AuthService.initializeAuth();
      
      const storedUser = AuthService.getUser();
      if (storedUser) {
        setUser(storedUser);
        queryClient.setQueryData(['auth'], storedUser);
        console.log('✅ AuthProvider: User restored from storage:', storedUser.username);
      }
    } catch (error) {
      console.error('❌ AuthProvider: Error during initialization:', error);
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: user?.isAuthenticated ?? false,
    isLoading,
    
    login: async (credentials) => {
      const result = await AuthService.login(credentials);
      const newUser = {
        ...result.user,
        isAuthenticated: true
      };
      setUser(newUser);
      queryClient.setQueryData(['auth'], newUser);
    },
    
    logout: async () => {
      await AuthService.logout();
      setUser(null);
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

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
