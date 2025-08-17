'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import StaffTable from '@/features/staff-security/components/StaffTable';

export default function StaffPage() {
  return (
    <Container className="py-4">
      <h2>Gestion du Personnel</h2>
      <Row>
        <Col>
          <StaffTable />
        </Col>
      </Row>
    </Container>
  );
}
