// src/app/dashboard/staff/page.tsx
'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import StaffTable from '@/features/staff-security/components/StaffTable';
import { NextButton } from '@/components/ui/NextButton';

export default function StaffPage() {
  return (
    <Container className="py-4">
      <Row className="align-items-center mb-3">
        <Col>
          <h2 className="mb-0">Gestion du Personnel</h2>
        </Col>
        <Col className="text-end">
          <NextButton href="/dashboard/staff/create" variant="primary">
            + Ajouter un membre
          </NextButton>
        </Col>
      </Row>

      <Row>
        <Col>
          <StaffTable />
        </Col>
      </Row>
    </Container>
  );
}
