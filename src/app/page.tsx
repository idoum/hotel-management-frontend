'use client';

import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { APP_CONFIG } from '@/lib/constants';
import Link from 'next/link';

const MODULES = [
  {
    id: 'staff-security',
    title: 'Staff & Sécurité',
    description: 'Gestion du personnel, rôles, permissions et audit',
    icon: 'people-fill',
    color: 'primary',
    href: '/staff',
    features: ['Gestion Staff', 'Rôles & Permissions', 'Départements', 'Audit Logs'],
  },
  {
    id: 'accommodation',
    title: 'Hébergement',
    description: 'Chambres, types, clients, réservations et paiements',
    icon: 'door-open-fill',
    color: 'success',
    href: '/accommodation',
    features: ['Gestion Chambres', 'Types de Chambres', 'Clients', 'Réservations', 'Paiements'],
  },
  {
    id: 'restaurant',
    title: 'Restaurant',
    description: 'Gestion des restaurants, tables, menu et commandes',
    icon: 'cup-hot-fill',
    color: 'warning',
    href: '/restaurant',
    features: ['Restaurants', 'Tables', 'Menu', 'Commandes'],
  },
  {
    id: 'rental',
    title: 'Location de Salle',
    description: 'Salles d\'événements et réservations',
    icon: 'calendar-event-fill',
    color: 'info',
    href: '/rental',
    features: ['Salles d\'Événements', 'Réservations'],
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    description: 'Demandes et gestion d\'interventions',
    icon: 'wrench',
    color: 'danger',
    href: '/maintenance',
    features: ['Demandes', 'Assignations', 'Suivi'],
  },
  {
    id: 'pool',
    title: 'Piscine',
    description: 'Gestion des piscines et réservations',
    icon: 'water',
    color: 'primary',
    href: '/pool',
    features: ['Gestion Piscines', 'Réservations', 'Planning'],
  },
];

export default function HomePage() {
  return (
    <div className="bg-light min-vh-100">
      {/* Header Navigation */}
      <nav className="navbar navbar-hotel navbar-expand-lg">
        <Container>
          <Link href="/" className="navbar-brand text-white fw-bold">
            🏨 {APP_CONFIG.name}
          </Link>
          <div className="navbar-nav ms-auto">
            <Link href="/login" className="nav-link text-white">
              <i className="bi bi-person me-1"></i>Connexion
            </Link>
          </div>
        </Container>
      </nav>

      <Container className="py-5">
        {/* Hero Section */}
        <Row className="text-center mb-5">
          <Col>
            <h1 className="display-4 fw-bold text-dark mb-4">
              Système de Gestion Hôtelière
            </h1>
            <p className="lead text-muted mb-4">
              Solution complète avec 6 modules intégrés :{' '}
              <Badge bg="primary">Next.js 14.2.31</Badge>{' '}
              <Badge bg="success">TypeScript</Badge>{' '}
              <Badge bg="info">Bootstrap 5</Badge>
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button as={Link} href="/login" variant="primary" size="lg">
                <i className="bi bi-person-check me-2"></i>Connexion Staff
              </Button>
              <Button as={Link} href="/dashboard" variant="outline-primary" size="lg">
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </Button>
            </div>
          </Col>
        </Row>

        {/* Modules Grid */}
        <Row className="g-4">
          {MODULES.map((module) => (
            <Col key={module.id} lg={4} md={6}>
              <Card className="h-100 shadow-soft border-0 card-hover">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className={`rounded-circle bg-${module.color} bg-opacity-10 d-flex align-items-center justify-content-center me-3`}
                      style={{ width: '50px', height: '50px' }}
                    >
                      <i className={`bi bi-${module.icon} text-${module.color} fs-4`}></i>
                    </div>
                    <div>
                      <Card.Title className="mb-1">{module.title}</Card.Title>
                      <Badge bg={module.color} className="mb-0">Module {module.id.charAt(0).toUpperCase()}</Badge>
                    </div>
                  </div>
                  
                  <Card.Text className="text-muted mb-3">
                    {module.description}
                  </Card.Text>
                  
                  <div className="mb-3">
                    <small className="text-muted fw-semibold d-block mb-2">Fonctionnalités :</small>
                    <div className="d-flex flex-wrap gap-1">
                      {module.features.map((feature, index) => (
                        <Badge key={index} bg={module.color} bg-opacity="10" text={module.color} className="fw-normal">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    as={Link} 
                    href={module.href} 
                    variant={`outline-${module.color}`} 
                    className="w-100"
                  >
                    Accéder au module
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Tech Stack */}
        <Row className="mt-5 pt-4 border-top">
          <Col lg={8} className="mx-auto text-center">
            <h3 className="mb-4">Architecture Technique</h3>
            <Row className="g-3">
              <Col md={4}>
                <div className="p-3 bg-white rounded shadow-sm">
                  <i className="bi bi-code-square text-primary fs-3 mb-2"></i>
                  <h6>Next.js 14.2.31</h6>
                  <small className="text-muted">App Router, SSR</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="p-3 bg-white rounded shadow-sm">
                  <i className="bi bi-file-earmark-code text-info fs-3 mb-2"></i>
                  <h6>TypeScript</h6>
                  <small className="text-muted">Types stricts</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="p-3 bg-white rounded shadow-sm">
                  <i className="bi bi-palette-fill text-success fs-3 mb-2"></i>
                  <h6>Bootstrap 5</h6>
                  <small className="text-muted">UI Components</small>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Footer */}
        <Row className="mt-5 pt-4">
          <Col className="text-center">
            <p className="text-muted mb-0">
              <strong>6 Modules Backend</strong> • Version {APP_CONFIG.version} • Prêt pour Production
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
