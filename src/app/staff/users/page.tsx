// src/app/staff/users/page.tsx
'use client';

import React from 'react';
import { Container } from 'react-bootstrap';
import StaffTable from '@/features/staff-security/components/StaffTable';
import { NextButton } from '@/components/ui/NextButton';

export default function StaffUsersPage() {
  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Personnel</h2>
        <NextButton href="/staff/users/create" variant="primary">
          + Ajouter un membre
        </NextButton>
      </div>
      <StaffTable />
    </Container>
  );
}
