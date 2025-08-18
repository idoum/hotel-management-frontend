// src/app/staff/permissions/page.tsx
'use client';

import React from 'react';
import { Container } from 'react-bootstrap';
import PermissionMatrix from '@/features/staff-security/components/PermissionMatrix';  // à créer

export default function StaffPermissionsPage() {
  return (
    <Container>
      <h2 className="mb-3">Permissions</h2>
      <PermissionMatrix />
    </Container>
  );
}
