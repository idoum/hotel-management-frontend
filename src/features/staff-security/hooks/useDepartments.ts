// src/features/staff-security/hooks/useDepartments.ts
import { useQuery } from '@tanstack/react-query';
import { DepartmentService } from '../services/department.service';
import { Department } from '../types/staff-security.types';

export function useDepartments() {
  return useQuery<Department[], Error>({
    queryKey: ['departments'],
    queryFn: () => DepartmentService.getDepartments().then(res => res.data),
  });
}
