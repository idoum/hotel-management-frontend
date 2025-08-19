import { BaseEntity } from '@/types/common';

// Staff
export interface Staff extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  department?: Department;
  isActive: boolean;
  lastLogin?: string;
  avatar?: string;
}

// Role aligné sur le modèle backend
export interface Role {
  role_id: number; // INTEGER PRIMARY KEY AUTO INCREMENT
  role_name: string; // STRING NOT NULL UNIQUE
  description?: string; // TEXT
}

// DTO pour création/édition
export interface CreateRoleDTO {
  role_name: string;
  description?: string;
}

export interface UpdateRoleDTO {
  role_name?: string;
  description?: string;
}

// Response avec info sur les permissions et utilisateurs liés
export interface RoleWithRelations extends Role {
  permissions?: Permission[];
  users?: Staff[];
  canDelete: boolean; // true si aucun utilisateur n'a ce rôle
  usersCount: number; // nombre d'utilisateurs avec ce rôle
  permissionsCount: number; // nombre de permissions dans ce rôle
}

// DTO pour gestion des permissions d'un rôle
export interface UpdateRolePermissionsDTO {
  permissionIds: number[];
}

// Permission (déjà existant, juste pour référence)
export interface Permission {
  permission_id: number;
  permission_name: string;
  description?: string;
}

// Staff (référence pour les utilisateurs)
export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: Role;
}

// Permission alignée sur le modèle backend
export interface Permission {
  permission_id: number; // INTEGER PRIMARY KEY AUTO INCREMENT
  permission_name: string; // STRING NOT NULL UNIQUE
  description?: string; // TEXT
}

// DTO pour création/édition
export interface CreatePermissionDTO {
  permission_name: string;
  description?: string;
}

export interface UpdatePermissionDTO {
  permission_name?: string;
  description?: string;
}

// Response avec info sur les rôles liés
export interface PermissionWithRoles extends Permission {
  roles?: Role[];
  canDelete: boolean; // true si aucun rôle n'utilise cette permission
}

// Department
export interface Department extends BaseEntity {
  name: string;
  description?: string;
  manager?: Staff;
  staffCount?: number;
}

// Action Log (Audit)
export interface ActionLog extends BaseEntity {
  action: string;
  resource: string;
  resourceId?: string;
  staff: Staff;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

// Login Credentials
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Auth Tokens
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthState {
  user: Staff | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
