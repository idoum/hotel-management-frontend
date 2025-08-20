'use client';

import React, { useState, useMemo } from 'react';
import { Table, Button, Form, Alert, Badge, Spinner, Card, Row, Col } from 'react-bootstrap';
import { useRoles, useUpdateRolePermissions } from '../hooks/useRoles';
import { usePermissions } from '../hooks/usePermissions';
import { Role, Permission, PermissionsByModule } from '../types/staff-security.types';

export default function RolePermissionsMatrix() {
  const { data: roles, isLoading: loadingRoles } = useRoles();
  const { data: permissions, isLoading: loadingPermissions } = usePermissions();
  const updateRolePermissions = useUpdateRolePermissions();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [pendingChanges, setPendingChanges] = useState<{ [roleId: number]: number[] }>({});

  // Organiser les permissions par module
  const permissionsByModule = useMemo(() => {
    if (!permissions) return {};

    const grouped: PermissionsByModule = {};
    permissions.forEach(permission => {
      // Extraire le module du nom de permission (ex: "user_create" -> "user")
      const module = permission.permission_name.split('_')[0] || 'general';
      if (!grouped[module]) {
        grouped[module] = [];
      }
      grouped[module].push(permission);
    });

    return grouped;
  }, [permissions]);

  // Obtenir les permissions actuelles d'un rôle
  const getRolePermissions = (role: Role): number[] => {
    return role.permissions?.map(p => p.permission_id) || [];
  };

  // Obtenir les permissions en attente pour un rôle
  const getPendingPermissions = (roleId: number): number[] => {
    return pendingChanges[roleId] || getRolePermissions(roles?.find(r => r.role_id === roleId) || {} as Role);
  };

  // Vérifier si une permission est assignée à un rôle
  const isPermissionAssigned = (roleId: number, permissionId: number): boolean => {
    const pendingPerms = getPendingPermissions(roleId);
    return pendingPerms.includes(permissionId);
  };

  // Toggle une permission pour un rôle
  const togglePermission = (roleId: number, permissionId: number) => {
    const currentPermissions = getPendingPermissions(roleId);
    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter(id => id !== permissionId)
      : [...currentPermissions, permissionId];

    setPendingChanges(prev => ({
      ...prev,
      [roleId]: newPermissions
    }));
  };

  // Toggle toutes les permissions d'un module pour un rôle
  const toggleModulePermissions = (roleId: number, modulePermissions: Permission[]) => {
    const modulePermissionIds = modulePermissions.map(p => p.permission_id);
    const currentPermissions = getPendingPermissions(roleId);
    
    // Vérifier si toutes les permissions du module sont assignées
    const allAssigned = modulePermissionIds.every(id => currentPermissions.includes(id));
    
    let newPermissions;
    if (allAssigned) {
      // Retirer toutes les permissions du module
      newPermissions = currentPermissions.filter(id => !modulePermissionIds.includes(id));
    } else {
      // Ajouter toutes les permissions du module
      const existingIds = new Set(currentPermissions);
      modulePermissionIds.forEach(id => existingIds.add(id));
      newPermissions = Array.from(existingIds);
    }

    setPendingChanges(prev => ({
      ...prev,
      [roleId]: newPermissions
    }));
  };

  // Sauvegarder les changements pour un rôle
  const saveRoleChanges = async (roleId: number) => {
    const newPermissions = pendingChanges[roleId];
    if (!newPermissions) return;

    try {
      await updateRolePermissions.mutateAsync({
        roleId,
        permissionIds: newPermissions
      });

      // Retirer des changements en attente
      setPendingChanges(prev => {
        const updated = { ...prev };
        delete updated[roleId];
        return updated;
      });
    } catch (error: any) {
      console.error(`Erreur sauvegarde rôle ${roleId}:`, error);
    }
  };

  // Annuler les changements pour un rôle
  const cancelRoleChanges = (roleId: number) => {
    setPendingChanges(prev => {
      const updated = { ...prev };
      delete updated[roleId];
      return updated;
    });
  };

  // Vérifier si un rôle a des changements en attente
  const hasUnsavedChanges = (roleId: number): boolean => {
    return roleId in pendingChanges;
  };

  if (loadingRoles || loadingPermissions) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" />
        <p className="mt-2">Chargement de la matrice des permissions...</p>
      </div>
    );
  }

  if (!roles || !permissions) {
    return (
      <Alert variant="warning">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Impossible de charger les rôles ou permissions.
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Matrice des Permissions</h4>
          <p className="text-muted mb-0">
            Gérez les permissions par rôle. Les modules regroupent les permissions par fonctionnalité.
          </p>
        </div>
        
        {Object.keys(pendingChanges).length > 0 && (
          <Alert variant="warning" className="mb-0 p-2">
            <small>
              <i className="bi bi-exclamation-triangle me-1"></i>
              {Object.keys(pendingChanges).length} rôle(s) avec des modifications non sauvegardées
            </small>
          </Alert>
        )}
      </div>

      {/* Vue tabulaire compacte */}
      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th style={{ minWidth: '200px' }}>Permissions</th>
                  {roles.map(role => (
                    <th key={role.role_id} className="text-center" style={{ minWidth: '120px' }}>
                      <div>
                        <strong>{role.role_name}</strong>
                        {hasUnsavedChanges(role.role_id) && (
                          <Badge bg="warning" className="ms-1">
                            <i className="bi bi-exclamation-triangle"></i>
                          </Badge>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                  <React.Fragment key={module}>
                    {/* En-tête de module */}
                    <tr className="table-secondary">
                      <td>
                        <strong className="text-uppercase">
                          <i className="bi bi-folder me-2"></i>
                          {module}
                        </strong>
                        <small className="text-muted ms-2">
                          ({modulePermissions.length} permission(s))
                        </small>
                      </td>
                      {roles.map(role => (
                        <td key={role.role_id} className="text-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => toggleModulePermissions(role.role_id, modulePermissions)}
                          >
                            <i className="bi bi-check-all"></i>
                          </Button>
                        </td>
                      ))}
                    </tr>

                    {/* Permissions du module */}
                    {modulePermissions.map(permission => (
                      <tr key={permission.permission_id}>
                        <td>
                          <div className="ps-3">
                            <strong>{permission.permission_name}</strong>
                            {permission.description && (
                              <div className="small text-muted">
                                {permission.description}
                              </div>
                            )}
                          </div>
                        </td>
                        {roles.map(role => (
                          <td key={role.role_id} className="text-center">
                            <Form.Check
                              type="checkbox"
                              checked={isPermissionAssigned(role.role_id, permission.permission_id)}
                              onChange={() => togglePermission(role.role_id, permission.permission_id)}
                              className="d-inline-block"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Actions de sauvegarde */}
          {Object.keys(pendingChanges).length > 0 && (
            <div className="border-top pt-3 mt-3">
              <Row>
                {roles
                  .filter(role => hasUnsavedChanges(role.role_id))
                  .map(role => (
                    <Col md={6} lg={4} key={role.role_id} className="mb-2">
                      <Card className="border-warning">
                        <Card.Body className="p-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{role.role_name}</strong>
                              <div className="small text-muted">
                                {getPendingPermissions(role.role_id).length} permission(s)
                              </div>
                            </div>
                            <div>
                              <Button
                                variant="success"
                                size="sm"
                                className="me-1"
                                onClick={() => saveRoleChanges(role.role_id)}
                                disabled={updateRolePermissions.isPending}
                              >
                                <i className="bi bi-check-lg"></i>
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => cancelRoleChanges(role.role_id)}
                                disabled={updateRolePermissions.isPending}
                              >
                                <i className="bi bi-x-lg"></i>
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                }
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Statistiques */}
      <Row className="mt-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{roles.length}</h3>
              <small className="text-muted">Rôles</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">{permissions.length}</h3>
              <small className="text-muted">Permissions</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{Object.keys(permissionsByModule).length}</h3>
              <small className="text-muted">Modules</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className={`text-${Object.keys(pendingChanges).length > 0 ? 'warning' : 'muted'}`}>
                {Object.keys(pendingChanges).length}
              </h3>
              <small className="text-muted">En attente</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
