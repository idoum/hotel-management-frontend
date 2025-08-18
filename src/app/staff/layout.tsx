// src/app/staff/layout.tsx
'use client';

import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import { NextButton } from '@/components/ui/NextButton';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container fluid className="py-4">
      {/* Barre de sous-navigation du module */}
      <Nav variant="tabs" defaultActiveKey="/staff">
        <NextButton as={Nav.Link} href="/staff">
          Tableau général
        </NextButton>
        <NextButton as={Nav.Link} href="/staff/users">
          Personnel
        </NextButton>
        <NextButton as={Nav.Link} href="/staff/roles">
          Rôles
        </NextButton>
        <NextButton as={Nav.Link} href="/staff/permissions">
          Permissions
        </NextButton>
        <NextButton as={Nav.Link} href="/staff/departments">
          Départements
        </NextButton>
        <NextButton as={Nav.Link} href="/staff/audit-logs">
          Audit
        </NextButton>
      </Nav>

      <div className="pt-4">{children}</div>
    </Container>
  );
}
