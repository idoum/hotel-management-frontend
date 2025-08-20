'use client';

import React, { useState } from 'react';
import { Container, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import UserTable from '@/features/staff-security/components/UserTable';
import UserForm from '@/features/staff-security/components/UserForm';
import { useUsers } from '@/features/staff-security/hooks/useUsers';
import { useAuth, usePermissions } from '@/features/staff-security/hooks/useAuth';

export default function StaffUsersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: users, isLoading } = useUsers();
  const { data: currentUser } = useAuth();
  const { hasPermission, canAccess } = usePermissions();

  // Stats calculées côté client
  const userStats = React.useMemo(() => {
    if (!users) return null;
    
    return {
      total: users.length,
      active: users.filter(u => u.active).length,
      inactive: users.filter(u => !u.active).length,
      withRoles: users.filter(u => u.rolesCount > 0).length,
      withoutRoles: users.filter(u => u.rolesCount === 0).length,
    };
  }, [users]);

  // Vérification des permissions
  const canCreateUser = canAccess('user_create') || hasPermission('user_create');
  const canViewUsers = canAccess('user_read') || hasPermission('user_read');

  if (!canViewUsers) {
    return (
      <Container fluid>
        <Alert variant="danger" className="mt-4">
          <i className="bi bi-shield-x me-2"></i>
          <strong>Accès refusé</strong>
          <p className="mb-0 mt-2">
            Vous n'avez pas les permissions nécessaires pour voir cette page.
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="mb-1">Gestion des Utilisateurs</h2>
              <p className="text-muted mb-0">
                Gérez les comptes utilisateurs du système et leurs accès.
              </p>
              {currentUser && (
                <small className="text-info">
                  <i className="bi bi-person-check me-1"></i>
                  Connecté en tant que: <strong>{currentUser.username}</strong>
                </small>
              )}
            </div>
            {canCreateUser && (
              <Button 
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                className="flex-shrink-0"
              >
                <i className="bi bi-plus-circle me-2"></i>
                Nouvel Utilisateur
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* Statistiques */}
      {userStats && (
        <Row className="mb-4">
          <Col md={6} lg={2}>
            <Card className="text-center border-primary">
              <Card.Body>
                <h3 className="text-primary">{userStats.total}</h3>
                <small className="text-muted">Total utilisateurs</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={2}>
            <Card className="text-center border-success">
              <Card.Body>
                <h3 className="text-success">{userStats.active}</h3>
                <small className="text-muted">Comptes actifs</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={2}>
            <Card className="text-center border-danger">
              <Card.Body>
                <h3 className="text-danger">{userStats.inactive}</h3>
                <small className="text-muted">Comptes inactifs</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="text-center border-info">
              <Card.Body>
                <h3 className="text-info">{userStats.withRoles}</h3>
                <small className="text-muted">Avec rôles assignés</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="text-center border-warning">
              <Card.Body>
                <h3 className="text-warning">{userStats.withoutRoles}</h3>
                <small className="text-muted">Sans rôles</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-people me-2"></i>
                  Liste des Utilisateurs
                </h5>
                {isLoading && (
                  <div className="text-muted small">
                    <i className="spinner-border spinner-border-sm me-2"></i>
                    Chargement...
                  </div>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              <UserTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de création */}
      {canCreateUser && (
        <UserForm
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          mode="create"
        />
      )}
    </Container>
  );
}
