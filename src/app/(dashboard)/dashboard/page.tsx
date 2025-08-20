'use client';

import React from 'react';
import { Container, Row, Col, Card, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '@/features/staff-security/hooks/useAuth';
import { useUsers } from '@/features/staff-security/hooks/useUsers';
import { useRoles } from '@/features/staff-security/hooks/useRoles';
import { useStaff } from '@/features/staff-security/hooks/useStaff';
import { useDepartments } from '@/features/staff-security/hooks/useDepartments';

export default function DashboardPage() {
  const { data: currentUser } = useAuth();
  const { data: users } = useUsers();
  const { data: roles } = useRoles();
  const { data: staff } = useStaff();
  const { data: departments } = useDepartments();

  const stats = React.useMemo(() => {
    return {
      users: {
        total: users?.length || 0,
        active: users?.filter(u => u.active).length || 0,
        inactive: users?.filter(u => !u.active).length || 0,
      },
      staff: {
        total: staff?.length || 0,
        active: staff?.filter(s => s.isActive).length || 0,
      },
      departments: {
        total: departments?.length || 0,
        withStaff: departments?.filter(d => d.staff_count > 0).length || 0,
      },
      roles: {
        total: roles?.length || 0,
      }
    };
  }, [users, staff, departments, roles]);

  return (
    <Container fluid>
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-1">
                <i className="bi bi-speedometer2 me-2"></i>
                Tableau de Bord
              </h1>
              <p className="text-muted mb-0">
                Vue d'ensemble du système de gestion hôtelière
              </p>
            </div>
            
            {currentUser && (
              <Alert variant="primary" className="mb-0 py-2">
                <div className="d-flex align-items-center">
                  <i className="bi bi-person-check-fill me-2 fs-5"></i>
                  <div>
                    <strong>Bienvenue, {currentUser.username}</strong>
                    <div className="small">
                      {currentUser.staff?.name && (
                        <span className="me-3">👤 {currentUser.staff.name}</span>
                      )}
                      <span className="me-3">📧 {currentUser.email}</span>
                      <Badge bg="success" className="me-2">
                        {currentUser.roles?.length || 0} rôle(s)
                      </Badge>
                      <Badge bg="info">
                        {currentUser.permissions?.length || 0} permission(s)
                      </Badge>
                    </div>
                  </div>
                </div>
              </Alert>
            )}
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-primary h-100">
            <Card.Body className="text-center">
              <div className="text-primary mb-2">
                <i className="bi bi-person-badge display-4"></i>
              </div>
              <h3 className="text-primary">{stats.users.total}</h3>
              <p className="card-text">Utilisateurs Total</p>
              <div className="small text-muted">
                <Badge bg="success" className="me-2">{stats.users.active} Actifs</Badge>
                <Badge bg="secondary">{stats.users.inactive} Inactifs</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-success h-100">
            <Card.Body className="text-center">
              <div className="text-success mb-2">
                <i className="bi bi-people display-4"></i>
              </div>
              <h3 className="text-success">{stats.staff.total}</h3>
              <p className="card-text">Employés</p>
              <div className="small text-muted">
                <Badge bg="success">{stats.staff.active} Actifs</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-info h-100">
            <Card.Body className="text-center">
              <div className="text-info mb-2">
                <i className="bi bi-building display-4"></i>
              </div>
              <h3 className="text-info">{stats.departments.total}</h3>
              <p className="card-text">Départements</p>
              <div className="small text-muted">
                <Badge bg="info">{stats.departments.withStaff} Avec personnel</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-warning h-100">
            <Card.Body className="text-center">
              <div className="text-warning mb-2">
                <i className="bi bi-shield-check display-4"></i>
              </div>
              <h3 className="text-warning">{stats.roles.total}</h3>
              <p className="card-text">Rôles Système</p>
              <div className="small text-muted">
                <Badge bg="warning">{currentUser?.roles?.length || 0} Vos rôles</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col lg={6}>
          <Card>
            <Card.Header>
              <i className="bi bi-lightning me-2"></i>
              Actions Rapides
            </Card.Header>
            <Card.Body>
              <Row>
                <Col sm={6} className="mb-2">
                  <a href="/staff/users" className="btn btn-outline-primary w-100">
                    <i className="bi bi-person-plus me-2"></i>
                    Nouvel Utilisateur
                  </a>
                </Col>
                <Col sm={6} className="mb-2">
                  <a href="/staff/departments" className="btn btn-outline-success w-100">
                    <i className="bi bi-building-add me-2"></i>
                    Nouveau Département
                  </a>
                </Col>
                <Col sm={6} className="mb-2">
                  <a href="/staff/roles" className="btn btn-outline-info w-100">
                    <i className="bi bi-shield-plus me-2"></i>
                    Nouveau Rôle
                  </a>
                </Col>
                <Col sm={6} className="mb-2">
                  <a href="/staff/permissions-matrix" className="btn btn-outline-warning w-100">
                    <i className="bi bi-gear me-2"></i>
                    Gérer Permissions
                  </a>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6}>
          <Card>
            <Card.Header>
              <i className="bi bi-info-circle me-2"></i>
              Informations Système
            </Card.Header>
            <Card.Body>
              <div className="small">
                <div className="d-flex justify-content-between py-1">
                  <span>Version:</span>
                  <Badge bg="secondary">2.0.0</Badge>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span>Base de données:</span>
                  <Badge bg="success">Connectée</Badge>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span>API Status:</span>
                  <Badge bg="success">Opérationnelle</Badge>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span>Dernière connexion:</span>
                  <span className="text-muted">Maintenant</span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span>Modules actifs:</span>
                  <Badge bg="info">6</Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Placeholder */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <i className="bi bi-clock-history me-2"></i>
              Activité Récente
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Le module d'audit et d'historique sera disponible dans une future version.
                Il permettra de visualiser les dernières actions des utilisateurs.
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
