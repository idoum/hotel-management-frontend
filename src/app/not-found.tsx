import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

import Link from 'next/link';

export default function NotFound() {
  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <Row>
        <Col className="text-center">
          <h1 className="display-1 fw-bold text-muted">404</h1>
          <h2 className="mb-4">Page non trouvée</h2>
          <p className="text-muted mb-4">
            La page que vous recherchez n existe pas ou a été déplacée.
          </p>
          <Button as={Link} href="/" variant="primary" size="lg">
            <i className="bi bi-house me-2"></i>
            Retour à l accueil
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
