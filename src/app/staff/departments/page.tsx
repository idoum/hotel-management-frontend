// src/app/staff/departments/page.tsx
'use client';

import React from 'react';
import { Container } from 'react-bootstrap';
import DepartmentTable from '@/features/staff-security/components/DepartmentTable';   // à créer
import { NextButton } from '@/components/ui/NextButton';

export default function StaffDepartmentsPage() {
  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Départements</h2>
        <NextButton href="/staff/departments/create" variant="primary">
          + Nouveau département
        </NextButton>
      </div>
      <DepartmentTable />
    </Container>
  );
}
