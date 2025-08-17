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

// Role
export interface Role extends BaseEntity {
  name: string;
  description?: string;
  permissions: Permission[];
  color?: string;
}

// Permission
export interface Permission extends BaseEntity {
  name: string;
  resource: string;
  action: string;
  description?: string;
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
