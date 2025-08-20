import { BaseEntity } from '@/types/common';


// ============ USER TYPES ============
export interface User {
  user_id: number;
  staff_id: number;
  username: string;
  email: string;
  active: boolean;
}

export interface CreateUserDTO {
  username: string;
  password: string;
  email: string;
  staff_id: number;
  role_ids?: number[];
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  active?: boolean;
}

export interface UserWithRelations extends User {
  staff?: Staff;
  roles?: Role[];
  permissions?: Permission[];
  rolesCount: number;
  permissionsCount: number;
  canDelete: boolean;
  lastLogin?: string;
}

export interface UpdatePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateUserRolesDTO {
  role_ids: number[];
}

// ============ AUTH TYPES ============
export interface LoginRequest {
  identifier: string; // username ou email
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    user_id: number;
    username: string;
    email: string;
    staff?: Staff;
    roles: { role_id: number; role_name: string }[];
    permissions: string[];
  };
}

export interface AuthUser {
  user_id: number;
  username: string;
  email: string;
  staff?: Staff;
  roles: { role_id: number; role_name: string }[];
  permissions: string[];
  isAuthenticated: boolean;
}

export interface ResetPasswordDTO {
  email: string;
  newPassword: string;
}

// ============ ROLE PERMISSION TYPES ============
export interface RolePermissionAssignment {
  role_id: number;
  permission_id: number;
}

export interface BulkPermissionAssignmentDTO {
  role_id: number;
  permission_ids: number[];
}

export interface PermissionsByModule {
  [module: string]: Permission[];
}

export interface RolePermissionMatrix {
  role: Role;
  permissions: {
    permission: Permission;
    assigned: boolean;
  }[];
}

// ============ FILTERS ============
export interface UserFilters {
  search?: string;
  active?: boolean;
  role_id?: number;
  department_id?: number;
}

// Staff aligné sur la structure de table backend
export interface Staff {
  staff_id: number;
  name: string;
  age?: number;
  contact_info?: string;
  salary?: number;
  department_id?: number;
  department?: Department;
}

// DTO pour création/édition
export interface CreateStaffDTO {
  name: string;
  age?: number;
  contact_info?: string;
  salary?: number;
  department_id?: number;
}

export interface UpdateStaffDTO {
  name?: string;
  age?: number;
  contact_info?: string;
  salary?: number;
  department_id?: number;
}

// Staff avec relations et métadonnées
export interface StaffWithRelations extends Staff {
  department?: Department; // Relation avec le département
  canDelete: boolean; // true si peut être supprimé
  isActive: boolean; // Statut actif/inactif
}

// DTO pour filtrage et recherche
export interface StaffFilters {
  search?: string;
  department_id?: number;
  minAge?: number;
  maxAge?: number;
  minSalary?: number;
  maxSalary?: number;
  isActive?: boolean;
}

// Interface Department (déjà existante, juste pour référence)
export interface Department {
  department_id: number;
  name: string;
  head?: string;
  role?: string;
  staff_count: number;
}


export interface Role {
  role_id: number;
  role_name: string;
  description?: string;
  permissions?: Permission[];
  users?: User[];
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
  roles?: Role[];
}

// Department aligné sur la structure de table backend
export interface Department {
  department_id: number; // INT PRIMARY KEY AUTO INCREMENT
  name: string; // VARCHAR(255) NOT NULL
  head?: string; // VARCHAR(255) NULL - Chef de département
  role?: string; // VARCHAR(255) NULL - Rôle du département
  staff_count: number; // INT NULL DEFAULT 0
}

// DTO pour création/édition
export interface CreateDepartmentDTO {
  name: string;
  head?: string;
  role?: string;
  staff_count?: number;
}

export interface UpdateDepartmentDTO {
  name?: string;
  head?: string;
  role?: string;
  staff_count?: number;
}

// Department avec relations et métadonnées
export interface DepartmentWithRelations extends Department {
  staff?: Staff[]; // Liste des employés du département
  actualStaffCount: number; // Nombre réel d'employés (calculé)
  canDelete: boolean; // true si aucun employé n'est assigné
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
