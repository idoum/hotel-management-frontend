import { BaseEntity } from '@/types/common';

// Room Type
export interface RoomType extends BaseEntity {
  name: string;
  description: string;
  capacity: number;
  basePrice: number;
  amenities: string[];
  images: string[];
}

// Room
export interface Room extends BaseEntity {
  number: string;
  floor: number;
  roomType: RoomType;
  status: RoomStatus;
  currentPrice: number;
  description?: string;
  amenities: string[];
  images: string[];
  lastCleaned?: string;
  notes?: string;
}

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  CLEANING = 'cleaning',
  OUT_OF_ORDER = 'out_of_order'
}

// Guest
export interface Guest extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  nationality?: string;
  idNumber?: string;
  preferences?: string[];
}

// Booking
export interface Booking extends BaseEntity {
  bookingNumber: string;
  guest: Guest;
  room: Room;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  status: BookingStatus;
  totalAmount: number;
  paidAmount: number;
  payments: Payment[];
  notes?: string;
  specialRequests?: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

// Payment
export interface Payment extends BaseEntity {
  booking: Booking;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  reference?: string;
  notes?: string;
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  ONLINE = 'online'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
}
