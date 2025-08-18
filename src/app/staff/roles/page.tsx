// src/app/staff/roles/page.tsx
'use client';

import React from 'react';
import { Container } from 'react-bootstrap';
import RoleTable from '@/features/staff-security/components/RoleTable';      // à créer
import { NextButton } from '@/components/ui/NextButton';

export default function StaffRolesPage() {
  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Rôles</h2>
        <NextButton href="/staff/roles/create" variant="primary">
          + Nouveau rôle
        </NextButton>
      </div>
      <RoleTable />
    </Container>
  );
}
