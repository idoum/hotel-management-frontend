'use client';

import React, { useState } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import DepartmentTable from '@/features/staff-security/components/DepartmentTable';
import DepartmentForm from '@/features/staff-security/components/DepartmentForm';

export default function StaffDepartmentsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="mb-1">Gestion des Départements</h2>
              <p className="text-muted mb-0">
                Gérez les départements de votre organisation. Les départements avec des employés assignés ne peuvent pas être supprimés.
              </p>
            </div>
            <Button 
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="flex-shrink-0"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Nouveau Département
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <DepartmentTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de création */}
      <DepartmentForm
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        mode="create"
      />
    </Container>
  );
}
