'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Alert, Spinner, Card, Badge } from 'react-bootstrap';
import { usePermissions } from '../hooks/usePermissions';
import { useRolePermissions, useUpdateRolePermissions } from '../hooks/useRoles';
import { RoleWithRelations } from '../types/staff-security.types';

interface Props {
  show: boolean;
  onHide: () => void;
  role?: RoleWithRelations | null;
}

export default function RolePermissionsModal({ show, onHide, role }: Props) {
  const { data: allPermissions, isLoading: permissionsLoading } = usePermissions();
  const { data: rolePermissionIds, isLoading: rolePermissionsLoading } = useRolePermissions(role?.role_id || 0);
  const updateRolePermissions = useUpdateRolePermissions();
  
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Initialiser les permissions sélectionnées
  useEffect(() => {
    if (rolePermissionIds) {
      setSelectedPermissions(rolePermissionIds);
    }
  }, [rolePermissionIds]);

  // Filtrer les permissions par recherche
  const filteredPermissions = useMemo(() => {
    if (!allPermissions) return [];
    
    return allPermissions.filter(permission =>
      permission.permission_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (permission.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );
  }, [allPermissions, searchTerm]);

  // Grouper les permissions par ressource
  const permissionsByResource = useMemo(() => {
    return filteredPermissions.reduce((acc, permission) => {
      const parts = permission.permission_name.split('_');
      const resource = parts.length > 1 ? parts[0] : 'general';
      
      if (!acc[resource]) {
        acc[resource] = [];
      }
      acc[resource].push(permission);
      return acc;
    }, {} as Record<string, typeof filteredPermissions>);
  }, [filteredPermissions]);

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  const handleSelectAllInResource = (resource: string, checked: boolean) => {
    const resourcePermissions = permissionsByResource[resource];
    const resourcePermissionIds = resourcePermissions.map(p => p.permission_id);
    
    if (checked) {
      setSelectedPermissions(prev => 
        [...new Set([...prev, ...resourcePermissionIds])]
      );
    } else {
      setSelectedPermissions(prev => 
        prev.filter(id => !resourcePermissionIds.includes(id))
      );
    }
  };

  const handleSave = async () => {
    if (!role) return;
    
    try {
      await updateRolePermissions.mutateAsync({
        roleId: role.role_id,
        permissionIds: selectedPermissions
      });
      onHide();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des permissions:', error);
    }
  };

  const isLoading = permissionsLoading || rolePermissionsLoading;
  const hasChanges = JSON.stringify(selectedPermissions.sort()) !== JSON.stringify((rolePermissionIds || []).sort());

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Permissions - {role?.role_name}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {isLoading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2">Chargement des permissions...</p>
          </div>
        ) : (
          <>
            {/* Barre de recherche */}
            <div className="mb-3">
              <Form.Control
                type="text"
                placeholder="Rechercher une permission..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Résumé */}
            <Alert variant="info" className="d-flex justify-content-between align-items-center">
              <span>
                <i className="bi bi-info-circle me-1"></i>
                {selectedPermissions.length} permission(s) sélectionnée(s)
              </span>
              {hasChanges && (
                <Badge bg="warning">Modifications non sauvegardées</Badge>
              )}
            </Alert>

            {/* Permissions par ressource */}
            {Object.entries(permissionsByResource).map(([resource, permissions]) => {
              const resourcePermissionIds = permissions.map(p => p.permission_id);
              const selectedInResource = resourcePermissionIds.filter(id => selectedPermissions.includes(id));
              const allSelected = selectedInResource.length === resourcePermissionIds.length;
              const someSelected = selectedInResource.length > 0;

              return (
                <Card key={resource} className="mb-3">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        checked={allSelected}
                        ref={(input) => {
                          if (input) input.indeterminate = someSelected && !allSelected;
                        }}
                        onChange={(e) => handleSelectAllInResource(resource, e.target.checked)}
                        className="me-2"
                      />
                      <h6 className="mb-0">
                        <i className="bi bi-folder me-2"></i>
                        {resource.toUpperCase()}
                      </h6>
                    </div>
                    <Badge bg={allSelected ? 'success' : someSelected ? 'warning' : 'secondary'}>
                      {selectedInResource.length}/{resourcePermissionIds.length}
                    </Badge>
                  </Card.Header>
                  <Card.Body>
                    <div className="row">
                      {permissions.map((permission) => (
                        <div key={permission.permission_id} className="col-md-6 mb-2">
                          <Form.Check
                            type="checkbox"
                            id={`permission-${permission.permission_id}`}
                            checked={selectedPermissions.includes(permission.permission_id)}
                            onChange={(e) => handlePermissionChange(permission.permission_id, e.target.checked)}
                            label={
                              <div>
                                <code className="small">{permission.permission_name}</code>
                                {permission.description && (
                                  <div className="text-muted small">
                                    {permission.description}
                                  </div>
                                )}
                              </div>
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              );
            })}

            {Object.keys(permissionsByResource).length === 0 && (
              <Alert variant="warning">
                Aucune permission ne correspond à votre recherche.
              </Alert>
            )}
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={updateRolePermissions.isPending}>
          Annuler
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave} 
          disabled={isLoading || updateRolePermissions.isPending || !hasChanges}
        >
          {updateRolePermissions.isPending ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Enregistrement...
            </>
          ) : (
            'Enregistrer'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
