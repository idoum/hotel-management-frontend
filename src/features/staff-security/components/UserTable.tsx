'use client';

import React, { useState, useMemo } from 'react';
import { Table, Button, Badge, Spinner, Alert, Form, InputGroup, Pagination, Row, Col } from 'react-bootstrap';
import { useUsers, useDeleteUser } from '../hooks/useUsers';
import { useRoles } from '../hooks/useRoles';
import { useDepartments } from '../hooks/useDepartments';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import UserForm from './UserForm';
import UserRolesModal from './UserRolesModal';
import PasswordChangeModal from './PasswordChangeModal';
import { UserWithRelations, UserFilters } from '../types/staff-security.types';

export default function UserTable() {
  // États pour filtres et pagination
  const [filters, setFilters] = useState<UserFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Hooks
  const { data: users, isLoading, error } = useUsers(filters);
  const { data: roles } = useRoles();
  const { data: departments } = useDepartments();
  const deleteUser = useDeleteUser();
  
  // États pour les modaux
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRelations | null>(null);

  // Filtrage et pagination
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users; // Le filtrage est déjà fait côté serveur
  }, [users]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleEdit = (user: UserWithRelations) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleManageRoles = (user: UserWithRelations) => {
    setSelectedUser(user);
    setShowRolesModal(true);
  };

  const handleChangePassword = (user: UserWithRelations) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  const handleDelete = (user: UserWithRelations) => {
    if (!user.canDelete) {
      alert('Cet utilisateur ne peut pas être supprimé car il a des rôles assignés.');
      return;
    }
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await deleteUser.mutateAsync(selectedUser.user_id);
        setShowDeleteModal(false);
        setSelectedUser(null);
        
        if (currentUsers.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error: any) {
        alert(`Erreur lors de la suppression: ${error.message}`);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" />
        <p className="mt-2">Chargement des utilisateurs...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Erreur: {error.message}</Alert>;
  }

  return (
    <>
      {/* Filtres */}
      <div className="mb-4">
        <Row>
          <Col md={4}>
            <InputGroup className="mb-2">
              <InputGroup.Text>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Rechercher par nom d'utilisateur ou email..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select
              value={filters.role_id || ''}
              onChange={(e) => handleFilterChange('role_id', e.target.value ? parseInt(e.target.value) : undefined)}
            >
              <option value="">Tous les rôles</option>
              {roles?.map(role => (
                <option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              value={filters.active?.toString() || ''}
              onChange={(e) => handleFilterChange('active', e.target.value === '' ? undefined : e.target.value === 'true')}
            >
              <option value="">Tous les statuts</option>
              <option value="true">Actifs</option>
              <option value="false">Inactifs</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={clearFilters} size="sm">
                <i className="bi bi-x-lg me-1"></i>
                Effacer
              </Button>
            </div>
          </Col>
        </Row>
        
        <small className="text-muted">
          {filteredUsers.length} utilisateur(s) trouvé(s)
        </small>
      </div>

      {/* Message si aucun résultat */}
      {filteredUsers.length === 0 && Object.keys(filters).length > 0 && (
        <Alert variant="info">
          <i className="bi bi-info-circle me-2"></i>
          Aucun utilisateur ne correspond à vos critères de recherche.
        </Alert>
      )}

      {/* Tableau */}
      {filteredUsers.length > 0 && (
        <>
          <Table striped hover responsive className="mb-3">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Utilisateur</th>
                <th>Employé</th>
                <th>Email</th>
                <th>Rôles</th>
                <th>Département</th>
                <th>Statut</th>
                <th style={{ width: '180px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user.user_id}>
                  <td className="text-muted">
                    {startIndex + index + 1}
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div>
                        <strong>{user.username}</strong>
                        <div className="small text-muted">ID: {user.user_id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {user.staff ? (
                      <div>
                        <strong>{user.staff.name}</strong>
                        <div className="small text-muted">ID: {user.staff.staff_id}</div>
                      </div>
                    ) : (
                      <em className="text-muted">Non assigné</em>
                    )}
                  </td>
                  <td>
                    <small className="text-break">{user.email}</small>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map(role => (
                          <Badge key={role.role_id} bg="primary" className="small">
                            {role.role_name}
                          </Badge>
                        ))
                      ) : (
                        <Badge bg="secondary">Aucun rôle</Badge>
                      )}
                    </div>
                    <small className="text-muted">
                      {user.rolesCount} rôle(s)
                    </small>
                  </td>
                  <td>
                    {user.staff?.department ? (
                      <Badge bg="info">{user.staff.department.name}</Badge>
                    ) : (
                      <Badge bg="secondary">Non assigné</Badge>
                    )}
                  </td>
                  <td>
                    <Badge bg={user.active ? 'success' : 'danger'}>
                      {user.active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-1 flex-wrap">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleEdit(user)}
                        title="Modifier"
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button 
                        variant="outline-info" 
                        size="sm"
                        onClick={() => handleManageRoles(user)}
                        title="Gérer les rôles"
                      >
                        <i className="bi bi-shield-check"></i>
                      </Button>
                      <Button 
                        variant="outline-warning" 
                        size="sm"
                        onClick={() => handleChangePassword(user)}
                        title="Changer le mot de passe"
                      >
                        <i className="bi bi-key"></i>
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        disabled={!user.canDelete}
                        onClick={() => handleDelete(user)}
                        title={user.canDelete ? 'Supprimer' : 'Suppression impossible - a des rôles assignés'}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted small">
                Affichage de {startIndex + 1} à {Math.min(endIndex, filteredUsers.length)} sur {filteredUsers.length} résultats
              </div>
              
              <Pagination className="mb-0">
                <Pagination.First 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(1)}
                />
                <Pagination.Prev 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    const delta = 2;
                    return page === 1 || page === totalPages || 
                           (page >= currentPage - delta && page <= currentPage + delta);
                  })
                  .map((page, index, array) => {
                    const showEllipsisAfter = array[index + 1] && array[index + 1] - page > 1;
                    return (
                      <React.Fragment key={page}>
                        <Pagination.Item
                          active={page === currentPage}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Pagination.Item>
                        {showEllipsisAfter && <Pagination.Ellipsis disabled />}
                      </React.Fragment>
                    );
                  })}
                
                <Pagination.Next 
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
                <Pagination.Last 
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(totalPages)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Modal d'édition */}
      <UserForm
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        mode="edit"
      />

      {/* Modal gestion des rôles */}
      <UserRolesModal
        show={showRolesModal}
        onHide={() => {
          setShowRolesModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* Modal changement de mot de passe */}
      <PasswordChangeModal
        show={showPasswordModal}
        onHide={() => {
          setShowPasswordModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* Modal de confirmation de suppression */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Supprimer l'Utilisateur"
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${selectedUser?.username}" ?`}
        isLoading={deleteUser.isPending}
      />
    </>
  );
}
