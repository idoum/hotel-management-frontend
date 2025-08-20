'use client';

import React from 'react';
import { Container, Alert, Card, Row, Col } from 'react-bootstrap';
import RolePermissionsMatrix from '@/features/staff-security/components/RolePermissionsMatrix';
import { useAuth, usePermissions } from '@/features/staff-security/hooks/useAuth';

export default function PermissionsMatrixPage() {
  const { data: currentUser } = useAuth();
  const { hasPermission, canAccess, isAdmin } = usePermissions();

  // Vérification des permissions
  const canManagePermissions = canAccess('permission_manage') || hasPermission('permission_manage') || isAdmin();

  if (!canManagePermissions) {
    return (
      <Container fluid>
        <Alert variant="danger" className="mt-4">
          <i className="bi bi-shield-x me-2"></i>
          <strong>Accès refusé</strong>
          <p className="mb-0 mt-2">
            Vous n'avez pas les permissions nécessaires pour gérer les permissions.
            Cette page est réservée aux administrateurs.
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <i className="bi bi-shield-check me-2"></i>
                Matrice des Permissions
              </h2>
              <p className="text-muted mb-0">
                Gérez les permissions par rôle. Les modifications sont appliquées immédiatement.
              </p>
              {currentUser && (
                <small className="text-success mt-1 d-block">
                  <i className="bi bi-person-check-fill me-1"></i>
                  Session administrative: <strong>{currentUser.username}</strong>
                </small>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Alert variant="warning" className="mb-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
              <div>
                <strong>Attention - Zone Sensible</strong>
                <p className="mb-0 mt-1">
                  Les modifications des permissions affectent immédiatement l'accès aux fonctionnalités. 
                  Vérifiez vos changements avant de les sauvegarder.
                </p>
              </div>
            </div>
          </Alert>
        </Col>
      </Row>

      <Row>
        <Col>
          <RolePermissionsMatrix />
        </Col>
      </Row>

      {/* Aide contextuelle */}
      <Row className="mt-4">
        <Col lg={8}>
          <Card className="border-info">
            <Card.Header className="bg-info text-white">
              <i className="bi bi-info-circle me-2"></i>
              Guide d'utilisation
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Actions disponibles :</h6>
                  <ul className="small">
                    <li><strong>Case individuelle :</strong> Assigner/retirer une permission spécifique</li>
                    <li><strong>Bouton module :</strong> Assigner/retirer toutes les permissions d'un module</li>
                    <li><strong>Sauvegarde :</strong> Appliquer les modifications pour un rôle</li>
                    <li><strong>Annulation :</strong> Annuler les modifications non sauvegardées</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>Indicateurs :</h6>
                  <ul className="small">
                    <li><i className="bi bi-exclamation-triangle text-warning me-1"></i> Modifications en attente</li>
                    <li><i className="bi bi-check-circle text-success me-1"></i> Modifications sauvegardées</li>
                    <li><i className="bi bi-folder text-secondary me-1"></i> Regroupement par module</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="border-secondary">
            <Card.Header className="bg-secondary text-white">
              <i className="bi bi-gear me-2"></i>
              Modules Système
            </Card.Header>
            <Card.Body className="small">
              <div><strong>staff :</strong> Gestion des employés</div>
              <div><strong>user :</strong> Comptes utilisateurs</div>
              <div><strong>role :</strong> Gestion des rôles</div>
              <div><strong>permission :</strong> Gestion des permissions</div>
              <div><strong>department :</strong> Départements</div>
              <div><strong>accommodation :</strong> Hébergement</div>
              <div><strong>restaurant :</strong> Restaurant</div>
              <div><strong>maintenance :</strong> Maintenance</div>
              <div className="text-muted mt-2">
                <i className="bi bi-info-circle me-1"></i>
                Les permissions sont automatiquement regroupées par module.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
