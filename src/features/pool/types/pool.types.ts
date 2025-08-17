import { BaseEntity } from '@/types/common';
import { Staff } from '@/features/staff-security/types/staff-security.types';
import { Guest } from '@/features/accommodation/types/accommodation.types';

// Pool
export interface Pool extends BaseEntity {
  name: string;
  description?: string;
  type: PoolType;
  capacity: number;
  depth?: string; // "1.2m - 2.5m"
  temperature?: number;
  status: PoolStatus;
  features: string[];
  openingHours: {
    [day: string]: { open: string; close: string } | null;
  };
  isActive: boolean;
  images: string[];
  rules?: string[];
}

export enum PoolType {
  INDOOR = 'indoor',
  OUTDOOR = 'outdoor',
  HEATED = 'heated',
  INFINITY = 'infinity',
  KIDS = 'kids',
  LAP = 'lap'
}

export enum PoolStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  MAINTENANCE = 'maintenance',
  PRIVATE_EVENT = 'private_event'
}

// Pool Reservation
export interface PoolReservation extends BaseEntity {
  reservationNumber: string;
  pool: Pool;
  guest?: Guest;
  guestName: string;
  roomNumber?: string;
  date: string;
  startTime: string;
  endTime: string;
  numberOfGuests: number;
  status: PoolReservationStatus;
  assignedLifeguard?: Staff;
  isPrivateEvent?: boolean;
  eventType?: string;
  specialRequirements?: string;
  notes?: string;
}

export enum PoolReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}
