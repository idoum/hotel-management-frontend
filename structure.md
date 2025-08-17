src/
├── app/                              # Next.js 14 App Router
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── (dashboard)/
│       ├── layout.tsx
│       ├── dashboard/page.tsx
│       ├── staff/                    # Module A - Staff-Security
│       │   ├── page.tsx
│       │   ├── users/page.tsx
│       │   ├── roles/page.tsx
│       │   ├── permissions/page.tsx
│       │   ├── departments/page.tsx
│       │   └── audit-logs/page.tsx
│       ├── accommodation/            # Module B - Hébergement
│       │   ├── page.tsx
│       │   ├── rooms/page.tsx
│       │   ├── room-types/page.tsx
│       │   ├── guests/page.tsx
│       │   ├── bookings/page.tsx
│       │   └── payments/page.tsx
│       ├── restaurant/               # Module C - Restaurant
│       │   ├── page.tsx
│       │   ├── restaurants/page.tsx
│       │   ├── tables/page.tsx
│       │   ├── menu/page.tsx
│       │   └── orders/page.tsx
│       ├── rental/                   # Module D - Location de salle
│       │   ├── page.tsx
│       │   ├── rooms/page.tsx
│       │   └── reservations/page.tsx
│       ├── maintenance/              # Module E - Maintenance
│       │   ├── page.tsx
│       │   └── requests/page.tsx
│       └── pool/                     # Module F - Piscine
│           ├── page.tsx
│           ├── pools/page.tsx
│           └── reservations/page.tsx
├── features/                         # Modules métier alignés backend
│   ├── staff-security/               # Module A
│   │   ├── components/
│   │   │   ├── StaffTable.tsx
│   │   │   ├── RoleForm.tsx
│   │   │   ├── PermissionMatrix.tsx
│   │   │   └── AuditLogViewer.tsx
│   │   ├── hooks/
│   │   │   ├── useStaff.ts
│   │   │   ├── useRoles.ts
│   │   │   └── usePermissions.ts
│   │   ├── services/
│   │   │   ├── staff.service.ts
│   │   │   ├── role.service.ts
│   │   │   └── audit.service.ts
│   │   ├── types/
│   │   │   └── staff-security.types.ts
│   │   └── index.ts
│   ├── accommodation/                # Module B
│   │   ├── components/
│   │   │   ├── RoomCard.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   ├── GuestProfile.tsx
│   │   │   └── PaymentProcessor.tsx
│   │   ├── hooks/
│   │   │   ├── useRooms.ts
│   │   │   ├── useBookings.ts
│   │   │   └── useGuests.ts
│   │   ├── services/
│   │   │   ├── room.service.ts
│   │   │   ├── booking.service.ts
│   │   │   └── payment.service.ts
│   │   ├── types/
│   │   │   └── accommodation.types.ts
│   │   └── index.ts
│   ├── restaurant/                   # Module C
│   │   ├── components/
│   │   │   ├── TableLayout.tsx
│   │   │   ├── MenuManager.tsx
│   │   │   └── OrderTracker.tsx
│   │   ├── hooks/
│   │   │   ├── useRestaurants.ts
│   │   │   ├── useMenu.ts
│   │   │   └── useOrders.ts
│   │   ├── services/
│   │   │   ├── restaurant.service.ts
│   │   │   └── order.service.ts
│   │   ├── types/
│   │   │   └── restaurant.types.ts
│   │   └── index.ts
│   ├── rental/                       # Module D
│   │   ├── components/
│   │   │   ├── RentalRoomCard.tsx
│   │   │   └── EventBookingForm.tsx
│   │   ├── hooks/
│   │   │   └── useRentalRooms.ts
│   │   ├── services/
│   │   │   └── rental.service.ts
│   │   ├── types/
│   │   │   └── rental.types.ts
│   │   └── index.ts
│   ├── maintenance/                  # Module E
│   │   ├── components/
│   │   │   ├── MaintenanceRequest.tsx
│   │   │   └── TaskAssignment.tsx
│   │   ├── hooks/
│   │   │   └── useMaintenance.ts
│   │   ├── services/
│   │   │   └── maintenance.service.ts
│   │   ├── types/
│   │   │   └── maintenance.types.ts
│   │   └── index.ts
│   └── pool/                         # Module F
│       ├── components/
│       │   ├── PoolCard.tsx
│       │   └── PoolReservationForm.tsx
│       ├── hooks/
│       │   └── usePools.ts
│       ├── services/
│       │   └── pool.service.ts
│       ├── types/
│       │   └── pool.types.ts
│       └── index.ts
├── components/
│   ├── ui/                           # Composants Bootstrap
│   │   ├── LoadingSpinner/
│   │   ├── AlertMessage/
│   │   ├── ConfirmModal/
│   │   ├── DataTable/
│   │   └── index.ts
│   └── layout/                       # Layout components
│       ├── Navbar/
│       ├── Sidebar/
│       ├── Footer/
│       └── DashboardLayout/
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── constants.ts
│   └── utils.ts
├── hooks/                            # Hooks globaux
│   ├── useAuth.ts
│   ├── useApi.ts
│   └── usePermissions.ts
├── types/                            # Types centralisés
│   ├── api.ts
│   ├── auth.ts
│   ├── common.ts
│   └── index.ts
├── services/                         # Services globaux
│   ├── api.service.ts
│   └── auth.service.ts
└── middleware.ts
