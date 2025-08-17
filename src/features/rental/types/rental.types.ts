import { BaseEntity } from '@/types/common';
import { Staff } from '@/features/staff-security/types/staff-security.types';
import { Guest } from '@/features/accommodation/types/accommodation.types';

// Room Rental (Salle de location)
export interface RoomRental extends BaseEntity {
  name: string;
  description?: string;
  capacity: number;
  area: number; // en m²
  facilities: string[];
  hourlyRate: number;
  dailyRate?: number;
  images: string[];
  status: RentalRoomStatus;
  location?: string;
}

export enum RentalRoomStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  CLEANING = 'cleaning'
}

// Rental Reservation
export interface RentalReservation extends BaseEntity {
  reservationNumber: string;
  roomRental: RoomRental;
  guest?: Guest;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  eventDescription?: string;
  startDate: string;
  endDate: string;
  numberOfGuests: number;
  status: RentalReservationStatus;
  totalAmount: number;
  paidAmount: number;
  assignedStaff?: Staff[];
  setupRequirements?: string;
  cateringNeeded?: boolean;
  notes?: string;
}

export enum RentalReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
