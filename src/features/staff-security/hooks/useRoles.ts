// src/features/staff-security/hooks/useRoles.ts
import { useQuery } from '@tanstack/react-query';
import { RoleService } from '../services/role.service';
import { Role } from '../types/staff-security.types';

export function useRoles() {
  return useQuery<Role[], Error>({
    queryKey: ['roles'],
    queryFn: () => RoleService.getRoles().then(res => res.data),
  });
}
