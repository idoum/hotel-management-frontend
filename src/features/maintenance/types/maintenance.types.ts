import { BaseEntity } from '@/types/common';
import { Staff } from '@/features/staff-security/types/staff-security.types';
import { Room } from '@/features/accommodation/types/accommodation.types';

// Maintenance Request
export interface MaintenanceRequest extends BaseEntity {
  ticketNumber: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  category: MaintenanceCategory;
  
  // Location
  room?: Room;
  location?: string; // si pas lié à une chambre
  
  // People
  reportedBy: Staff;
  assignedTo?: Staff;
  
  // Timing
  reportedAt: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  
  // Details
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
  images?: string[];
  
  // Follow-up
  followUpRequired?: boolean;
  followUpDate?: string;
}

export enum MaintenancePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  EMERGENCY = 'emergency'
}

export enum MaintenanceStatus {
  REPORTED = 'reported',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REQUIRES_APPROVAL = 'requires_approval'
}

export enum MaintenanceCategory {
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  HVAC = 'hvac',
  CLEANING = 'cleaning',
  FURNITURE = 'furniture',
  APPLIANCES = 'appliances',
  SAFETY = 'safety',
  OTHER = 'other'
}
