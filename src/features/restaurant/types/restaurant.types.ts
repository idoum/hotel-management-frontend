import { BaseEntity } from '@/types/common';

// Restaurant
export interface Restaurant extends BaseEntity {
  name: string;
  description?: string;
  cuisine: string;
  capacity: number;
  openingHours: {
    [day: string]: { open: string; close: string } | null;
  };
  isActive: boolean;
  images: string[];
}

// Table
export interface Table extends BaseEntity {
  number: string;
  restaurant: Restaurant;
  capacity: number;
  status: TableStatus;
  location?: string;
  notes?: string;
}

export enum TableStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  CLEANING = 'cleaning',
  OUT_OF_SERVICE = 'out_of_service'
}

// Menu Item
export interface MenuItem extends BaseEntity {
  name: string;
  description: string;
  category: string;
  price: number;
  restaurant: Restaurant;
  isAvailable: boolean;
  preparationTime?: number; // en minutes
  allergens: string[];
  dietary: string[]; // vegetarian, vegan, etc.
  image?: string;
  ingredients?: string[];
}

// Restaurant Order
export interface RestaurantOrder extends BaseEntity {
  orderNumber: string;
  restaurant: Restaurant;
  table?: Table;
  guestName?: string;
  roomNumber?: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  orderTime: string;
  estimatedReadyTime?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  SERVED = 'served',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Order Item
export interface OrderItem extends BaseEntity {
  order: RestaurantOrder;
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  status: OrderItemStatus;
}

export enum OrderItemStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  SERVED = 'served'
}
