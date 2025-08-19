// src/features/staff-security/hooks/useStaff.ts
import { useQuery } from '@tanstack/react-query';
import { StaffService } from '../services/staff.service';
import { Staff } from '../types/staff-security.types';

export function useStaff() {
  return useQuery<Staff[], Error>({
    queryKey: ['staff'],
    queryFn: () => StaffService.getStaff().then(res => res.data),
  });


}
