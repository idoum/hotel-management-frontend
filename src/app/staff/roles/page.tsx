'use client';

import React, { useState } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import RoleTable from '@/features/staff-security/components/RoleTable';
import RoleForm from '@/features/staff-security/components/RoleForm';

export default function StaffRolesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="mb-1">Gestion des Rôles</h2>
              <p className="text-muted mb-0">
                Gérez les rôles et leurs permissions. Les rôles assignés à des utilisateurs ne peuvent pas être supprimés.
              </p>
            </div>
            <Button 
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="flex-shrink-0"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Nouveau Rôle
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <RoleTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de création */}
      <RoleForm
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        mode="create"
      />
    </Container>
  );
}
