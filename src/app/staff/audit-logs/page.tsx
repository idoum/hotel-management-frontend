// src/app/staff/audit-logs/page.tsx
'use client';

import React from 'react';
import { Container } from 'react-bootstrap';
import AuditLogViewer from '@/features/staff-security/components/AuditLogViewer';     // à créer

export default function StaffAuditLogsPage() {
  return (
    <Container>
      <h2 className="mb-3">Journal d’audit</h2>
      <AuditLogViewer />
    </Container>
  );
}
