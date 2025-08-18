// src/app/dashboard/page.tsx
'use client';

import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import { NextButton } from '@/components/ui/NextButton';
import { APP_CONFIG, NAVIGATION } from '@/lib/constants';

export default function DashboardPage() {
  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="mb-0">Tableau de Bord</h1>
          <p className="text-muted">Bienvenue dans le système {APP_CONFIG.name}</p>
        </Col>
        <Col className="text-end">
          <NextButton href="/" variant="outline-secondary">
            Retour à l'accueil
          </NextButton>
        </Col>
      </Row>

      <Row className="g-4">
        {NAVIGATION.map((item) => (
          <Col key={item.id} md={6} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center mb-3">
                    <i className={`bi bi-${item.icon} fs-2 me-3 text-primary`}></i>
                    <Card.Title>{item.label}</Card.Title>
                  </div>
                  <Card.Text className="text-muted">
                    Accédez à la gestion de {item.label.toLowerCase()}.
                  </Card.Text>
                </div>
                <NextButton href={item.href} variant="primary" className="mt-3">
                  Ouvrir
                </NextButton>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
