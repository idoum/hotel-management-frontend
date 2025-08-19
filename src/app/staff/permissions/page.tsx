// src/app/staff/permissions/page.tsx
'use client';

import React, { useState } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import PermissionTable from '@/features/staff-security/components/PermissionTable';
import PermissionForm from '@/features/staff-security/components/PermissionForm';

export default function StaffPermissionsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="mb-1">Gestion des Permissions</h2>
              <p className="text-muted mb-0">
                Gérez les permissions du système. Les permissions liées à des rôles ne peuvent pas être supprimées.
              </p>
            </div>
            <Button 
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="flex-shrink-0"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Nouvelle Permission
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <PermissionTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de création */}
      <PermissionForm
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        mode="create"
      />
    </Container>
  );
}
