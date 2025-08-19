// src/features/staff-security/components/PermissionTable.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Table, Button, Badge, Spinner, Alert, Form, InputGroup, Pagination } from 'react-bootstrap';
import { usePermissions, useDeletePermission } from '../hooks/usePermissions';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import PermissionForm from './PermissionForm';
import { PermissionWithRoles } from '../types/staff-security.types';

export default function PermissionTable() {
  const { data: permissions, isLoading, error } = usePermissions();
  const deletePermission = useDeletePermission();
  
  // États pour la recherche et pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // États pour les modaux
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<PermissionWithRoles | null>(null);

  // Filtrage par recherche
  const filteredPermissions = useMemo(() => {
    if (!permissions) return [];
    
    return permissions.filter(permission =>
      permission.permission_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (permission.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );
  }, [permissions, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPermissions = filteredPermissions.slice(startIndex, endIndex);

  // Réinitialiser la pagination lors du changement de recherche
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleEdit = (permission: PermissionWithRoles) => {
    setSelectedPermission(permission);
    setShowEditModal(true);
  };

  const handleDelete = (permission: PermissionWithRoles) => {
    if (!permission.canDelete) {
      alert(`Cette permission ne peut pas être supprimée car elle est utilisée par ${permission.roles?.length || 0} rôle(s).`);
      return;
    }
    setSelectedPermission(permission);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedPermission) {
      try {
        await deletePermission.mutateAsync(selectedPermission.permission_id);
        setShowDeleteModal(false);
        setSelectedPermission(null);
        
        // Ajuster la page si nécessaire après suppression
        if (currentPermissions.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error: any) {
        alert(`Erreur lors de la suppression: ${error.message}`);
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" />
        <p className="mt-2">Chargement des permissions...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Erreur: {error.message}</Alert>;
  }

  return (
    <>
      {/* Barre de recherche */}
      <div className="mb-3">
        <InputGroup>
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Rechercher par nom ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button variant="outline-secondary" onClick={clearSearch}>
              <i className="bi bi-x-lg"></i>
            </Button>
          )}
        </InputGroup>
        
        {/* Statistiques */}
        <small className="text-muted mt-1 d-block">
          {filteredPermissions.length === permissions?.length ? (
            `${permissions?.length || 0} permission(s) au total`
          ) : (
            `${filteredPermissions.length} permission(s) trouvée(s) sur ${permissions?.length || 0}`
          )}
        </small>
      </div>

      {/* Message si aucun résultat */}
      {filteredPermissions.length === 0 && searchTerm && (
        <Alert variant="info">
          <i className="bi bi-info-circle me-2"></i>
          Aucune permission ne correspond à votre recherche "{searchTerm}".
        </Alert>
      )}

      {/* Tableau */}
      {filteredPermissions.length > 0 && (
        <>
          <Table striped hover responsive className="mb-3">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Nom de la Permission</th>
                <th>Description</th>
                <th>Rôles liés</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPermissions.map((permission, index) => (
                <tr key={permission.permission_id}>
                  {/* Numéro de ligne global (pas juste de la page) */}
                  <td className="text-muted">
                    {startIndex + index + 1}
                  </td>
                  <td>
                    <code className="bg-light p-1 rounded">
                      {permission.permission_name}
                    </code>
                  </td>
                  <td>
                    {permission.description ? (
                      <span>{permission.description}</span>
                    ) : (
                      <em className="text-muted">Aucune description</em>
                    )}
                  </td>
                  <td>
                    {permission.roles?.length ? (
                      <div>
                        {permission.roles.map((role) => (
                          <Badge key={role.id} bg="primary" className="me-1 mb-1">
                            {role.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <Badge bg="secondary">Aucun rôle</Badge>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleEdit(permission)}
                        title="Modifier"
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        disabled={!permission.canDelete}
                        onClick={() => handleDelete(permission)}
                        title={permission.canDelete ? 'Supprimer' : 'Suppression impossible - utilisée par des rôles'}
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
                Affichage de {startIndex + 1} à {Math.min(endIndex, filteredPermissions.length)} sur {filteredPermissions.length} résultats
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
                
                {/* Pages visibles */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Afficher les pages autour de la page courante
                    const delta = 2;
                    return page === 1 || page === totalPages || 
                           (page >= currentPage - delta && page <= currentPage + delta);
                  })
                  .map((page, index, array) => {
                    // Ajouter des ellipses si nécessaire
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
      <PermissionForm
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setSelectedPermission(null);
        }}
        permission={selectedPermission}
        mode="edit"
      />

      {/* Modal de confirmation de suppression */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Supprimer la Permission"
        message={`Êtes-vous sûr de vouloir supprimer la permission "${selectedPermission?.permission_name}" ?`}
        isLoading={deletePermission.isPending}
      />
    </>
  );
}
