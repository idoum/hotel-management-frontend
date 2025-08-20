'use client';

import React, { useEffect } from 'react';
import { Modal, Button, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { useUserRoles, useUpdateUserRoles } from '../hooks/useUsers';
import { useRoles } from '../hooks/useRoles';
import { UserWithRelations } from '../types/staff-security.types';

interface Props {
  show: boolean;
  onHide: () => void;
  user: UserWithRelations | null;
}

export default function UserRolesModal({ show, onHide, user }: Props) {
  const { data: userRoles, isLoading: loadingUserRoles } = useUserRoles(user?.user_id || 0);
  const { data: allRoles, isLoading: loadingAllRoles } = useRoles();
  const updateUserRoles = useUpdateUserRoles();

  const [selectedRoles, setSelectedRoles] = React.useState<number[]>([]);

  // Initialiser les rôles sélectionnés
  useEffect(() => {
    if (userRoles) {
      setSelectedRoles(userRoles);
    }
  }, [userRoles]);

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoles(prev => 
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      await updateUserRoles.mutateAsync({
        userId: user.user_id,
        roleIds: selectedRoles,
      });
      onHide();
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour des rôles:', error);
    }
  };

  const hasChanges = React.useMemo(() => {
    if (!userRoles) return false;
    
    const currentRoles = [...userRoles].sort();
    const newRoles = [...selectedRoles].sort();
    
    return JSON.stringify(currentRoles) !== JSON.stringify(newRoles);
  }, [userRoles, selectedRoles]);

  const isLoading = loadingUserRoles || loadingAllRoles;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Gérer les rôles - {user?.username}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {user && (
          <Alert variant="info" className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{user.username}</strong> ({user.email})
                <br />
                <small className="text-muted">
                  Employé: {user.staff?.name || 'Non assigné'}
                </small>
              </div>
              <Badge bg={user.active ? 'success' : 'danger'}>
                {user.active ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </Alert>
        )}

        {isLoading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2">Chargement des rôles...</p>
          </div>
        ) : (
          <div>
            <h6 className="mb-3">
              Rôles disponibles 
              <small className="text-muted ms-2">
                ({selectedRoles.length} sélectionné(s))
              </small>
            </h6>

            {allRoles && allRoles.length > 0 ? (
              <div className="border rounded p-3">
                {allRoles.map(role => {
                  const isSelected = selectedRoles.includes(role.role_id);
                  
                  return (
                    <div 
                      key={role.role_id} 
                      className={`d-flex align-items-center p-3 border rounded mb-2 cursor-pointer ${
                        isSelected ? 'bg-primary bg-opacity-10 border-primary' : 'bg-light'
                      }`}
                      onClick={() => handleRoleToggle(role.role_id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Form.Check
                        type="checkbox"
                        id={`role-${role.role_id}`}
                        checked={isSelected}
                        onChange={() => handleRoleToggle(role.role_id)}
                        className="me-3"
                      />
                      
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center">
                          <strong>{role.role_name}</strong>
                          {isSelected && (
                            <Badge bg="primary" className="ms-2">Assigné</Badge>
                          )}
                        </div>
                        {role.description && (
                          <div className="small text-muted mt-1">
                            {role.description}
                          </div>
                        )}
                        {role.permissions && role.permissions.length > 0 && (
                          <div className="small text-muted mt-1">
                            <i className="bi bi-shield-check me-1"></i>
                            {role.permissions.length} permission(s)
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Alert variant="warning">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Aucun rôle disponible dans le système.
              </Alert>
            )}

            {/* Résumé des changements */}
            {hasChanges && (
              <Alert variant="warning" className="mt-3">
                <h6><i className="bi bi-exclamation-triangle me-2"></i>Modifications en attente</h6>
                <div className="small">
                  <div>Rôles actuels: {userRoles?.length || 0}</div>
                  <div>Nouveaux rôles: {selectedRoles.length}</div>
                </div>
              </Alert>
            )}

            {/* Aperçu des permissions résultantes */}
            {selectedRoles.length > 0 && allRoles && (
              <div className="mt-3">
                <h6 className="text-muted">
                  <i className="bi bi-shield-check me-2"></i>
                  Permissions résultantes
                </h6>
                <div className="small text-muted border rounded p-2">
                  {(() => {
                    const allPermissions = new Set<string>();
                    selectedRoles.forEach(roleId => {
                      const role = allRoles.find(r => r.role_id === roleId);
                      if (role?.permissions) {
                        role.permissions.forEach(p => allPermissions.add(p.permission_name));
                      }
                    });
                    return Array.from(allPermissions).join(', ') || 'Aucune permission';
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {updateUserRoles.error && (
          <Alert variant="danger" className="mt-3">
            <strong>Erreur:</strong> {updateUserRoles.error.message}
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={onHide}
          disabled={updateUserRoles.isPending}
        >
          Annuler
        </Button>
        
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={updateUserRoles.isPending || !hasChanges}
        >
          {updateUserRoles.isPending ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Enregistrement...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg me-2"></i>
              Enregistrer les modifications
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
