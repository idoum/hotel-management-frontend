export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Hotel Management System',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api',
};

// Routes API alignées sur le backend
export const API_ENDPOINTS = {
  // Module A - Staff Security
  STAFF_SECURITY: {
    STAFF: '/staff',
    ROLES: '/roles',
    PERMISSIONS: '/permissions',
    DEPARTMENTS: '/departments',
    ACTION_LOGS: '/action-logs',
  },
  
  // Module B - Accommodation
  ACCOMMODATION: {
    ROOM_TYPES: '/accommodation/room-types',
    ROOMS: '/accommodation/rooms',
    GUESTS: '/accommodation/guests',
    BOOKINGS: '/accommodation/bookings',
    PAYMENTS: '/accommodation/payments',
  },
  
  // Module C - Restaurant
  RESTAURANT: {
    RESTAURANTS: '/restaurant/restaurants',
    TABLES: '/restaurant/tables',
    MENU_ITEMS: '/restaurant/menu-items',
    ORDERS: '/restaurant/orders',
    ORDER_ITEMS: '/restaurant/order-items',
  },
  
  // Module D - Rental
  RENTAL: {
    ROOMS: '/rental/rooms',
    RESERVATIONS: '/rental/reservations',
  },
  
  // Module E - Maintenance
  MAINTENANCE: {
    REQUESTS: '/maintenance/requests',
  },
  
  // Module F - Pool
  POOL: {
    POOLS: '/pool/pools',
    RESERVATIONS: '/pool/reservations',
  },
  
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
} as const;

// Permissions alignées backend
export const PERMISSIONS = {
  // Staff & Security
  STAFF: {
    VIEW: 'staff:view',
    CREATE: 'staff:create',
    UPDATE: 'staff:update',
    DELETE: 'staff:delete',
  },
  ROLES: {
    VIEW: 'roles:view',
    CREATE: 'roles:create',
    UPDATE: 'roles:update',
    DELETE: 'roles:delete',
  },
  
  // Accommodation
  ROOMS: {
    VIEW: 'rooms:view',
    CREATE: 'rooms:create',
    UPDATE: 'rooms:update',
    DELETE: 'rooms:delete',
  },
  BOOKINGS: {
    VIEW: 'bookings:view',
    CREATE: 'bookings:create',
    UPDATE: 'bookings:update',
    DELETE: 'bookings:delete',
  },
  
  // Restaurant
  RESTAURANTS: {
    VIEW: 'restaurants:view',
    MANAGE: 'restaurants:manage',
  },
  ORDERS: {
    VIEW: 'orders:view',
    CREATE: 'orders:create',
    UPDATE: 'orders:update',
  },
  
  // Rental
  RENTAL: {
    VIEW: 'rental:view',
    MANAGE: 'rental:manage',
  },
  
  // Maintenance
  MAINTENANCE: {
    VIEW: 'maintenance:view',
    CREATE: 'maintenance:create',
    ASSIGN: 'maintenance:assign',
    COMPLETE: 'maintenance:complete',
  },
  
  // Pool
  POOL: {
    VIEW: 'pool:view',
    MANAGE: 'pool:manage',
    RESERVE: 'pool:reserve',
  },
} as const;

// Navigation basée sur les modules backend
export const NAVIGATION = [
  {
    id: 'staff',
    label: 'Personnel',
    icon: 'people-fill',
    href: '/dashboard/staff',
    permission: PERMISSIONS.STAFF.VIEW,
  },

  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'speedometer2',
    href: '/dashboard',
    permission: null,
  },
  {
    id: 'staff-security',
    label: 'Staff & Sécurité',
    icon: 'people-fill',
    href: '/staff',
    permission: PERMISSIONS.STAFF.VIEW,
    children: [
      { label: 'Personnel', href: '/staff/users', permission: PERMISSIONS.STAFF.VIEW },
      { label: 'Rôles', href: '/staff/roles', permission: PERMISSIONS.ROLES.VIEW },
      { label: 'Permissions', href: '/staff/permissions', permission: PERMISSIONS.ROLES.VIEW },
      { label: 'Départements', href: '/staff/departments', permission: PERMISSIONS.STAFF.VIEW },
      { label: 'Audit', href: '/staff/audit-logs', permission: PERMISSIONS.STAFF.VIEW },
    ],
  },
  {
    id: 'accommodation',
    label: 'Hébergement',
    icon: 'door-open-fill',
    href: '/accommodation',
    permission: PERMISSIONS.ROOMS.VIEW,
    children: [
      { label: 'Chambres', href: '/accommodation/rooms', permission: PERMISSIONS.ROOMS.VIEW },
      { label: 'Types de chambres', href: '/accommodation/room-types', permission: PERMISSIONS.ROOMS.VIEW },
      { label: 'Clients', href: '/accommodation/guests', permission: PERMISSIONS.BOOKINGS.VIEW },
      { label: 'Réservations', href: '/accommodation/bookings', permission: PERMISSIONS.BOOKINGS.VIEW },
      { label: 'Paiements', href: '/accommodation/payments', permission: PERMISSIONS.BOOKINGS.VIEW },
    ],
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    icon: 'cup-hot-fill',
    href: '/restaurant',
    permission: PERMISSIONS.RESTAURANTS.VIEW,
    children: [
      { label: 'Restaurants', href: '/restaurant/restaurants', permission: PERMISSIONS.RESTAURANTS.VIEW },
      { label: 'Tables', href: '/restaurant/tables', permission: PERMISSIONS.RESTAURANTS.VIEW },
      { label: 'Menu', href: '/restaurant/menu', permission: PERMISSIONS.RESTAURANTS.VIEW },
      { label: 'Commandes', href: '/restaurant/orders', permission: PERMISSIONS.ORDERS.VIEW },
    ],
  },
  {
    id: 'rental',
    label: 'Location de Salle',
    icon: 'calendar-event-fill',
    href: '/rental',
    permission: PERMISSIONS.RENTAL.VIEW,
    children: [
      { label: 'Salles', href: '/rental/rooms', permission: PERMISSIONS.RENTAL.VIEW },
      { label: 'Réservations', href: '/rental/reservations', permission: PERMISSIONS.RENTAL.VIEW },
    ],
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: 'wrench',
    href: '/maintenance',
    permission: PERMISSIONS.MAINTENANCE.VIEW,
    children: [
      { label: 'Demandes', href: '/maintenance/requests', permission: PERMISSIONS.MAINTENANCE.VIEW },
    ],
  },
  {
    id: 'pool',
    label: 'Piscine',
    icon: 'water',
    href: '/pool',
    permission: PERMISSIONS.POOL.VIEW,
    children: [
      { label: 'Piscines', href: '/pool/pools', permission: PERMISSIONS.POOL.VIEW },
      { label: 'Réservations', href: '/pool/reservations', permission: PERMISSIONS.POOL.VIEW },
    ],
  },
] as const;
