'use client';

import React, { useState, useMemo } from 'react';
import { Table, Button, Badge, Spinner, Alert, Form, InputGroup, Pagination, ProgressBar } from 'react-bootstrap';
import { useDepartments, useDeleteDepartment } from '../hooks/useDepartments';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import DepartmentForm from './DepartmentForm';
import { DepartmentWithRelations } from '../types/staff-security.types';

export default function DepartmentTable() {
  const { data: departments, isLoading, error } = useDepartments();
  const deleteDepartment = useDeleteDepartment();
  
  // États pour la recherche et pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // États pour les modaux
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentWithRelations | null>(null);

  // Filtrage par recherche
  const filteredDepartments = useMemo(() => {
    if (!departments) return [];
    
    return departments.filter(department =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (department.head?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (department.role?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );
  }, [departments, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDepartments = filteredDepartments.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleEdit = (department: DepartmentWithRelations) => {
    setSelectedDepartment(department);
    setShowEditModal(true);
  };

  const handleDelete = (department: DepartmentWithRelations) => {
    if (!department.canDelete) {
      alert(`Ce département ne peut pas être supprimé car il a ${department.staff_count} employé(s) assigné(s).`);
      return;
    }
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedDepartment) {
      try {
        await deleteDepartment.mutateAsync(selectedDepartment.department_id);
        setShowDeleteModal(false);
        setSelectedDepartment(null);
        
        if (currentDepartments.length === 1 && currentPage > 1) {
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
        <p className="mt-2">Chargement des départements...</p>
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
            placeholder="Rechercher par nom, responsable ou rôle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button variant="outline-secondary" onClick={clearSearch}>
              <i className="bi bi-x-lg"></i>
            </Button>
          )}
        </InputGroup>
        
        <small className="text-muted mt-1 d-block">
          {filteredDepartments.length === departments?.length ? (
            `${departments?.length || 0} département(s) au total`
          ) : (
            `${filteredDepartments.length} département(s) trouvé(s) sur ${departments?.length || 0}`
          )}
        </small>
      </div>

      {/* Message si aucun résultat */}
      {filteredDepartments.length === 0 && searchTerm && (
        <Alert variant="info">
          <i className="bi bi-info-circle me-2"></i>
          Aucun département ne correspond à votre recherche "{searchTerm}".
        </Alert>
      )}

      {/* Tableau */}
      {filteredDepartments.length > 0 && (
        <>
          <Table striped hover responsive className="mb-3">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Nom du Département</th>
                <th>Responsable</th>
                <th>Rôle/Description</th>
                <th>Personnel</th>
                <th>Taux d'occupation</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDepartments.map((department, index) => {
                const occupancyRate = department.actualStaffCount > 0 ? (department.actualStaffCount / Math.max(department.staff_count, 1)) * 100 : 0;
                
                return (
                  <tr key={department.department_id}>
                    <td className="text-muted">
                      {startIndex + index + 1}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <strong>{department.name}</strong>
                        {!department.canDelete && (
                          <Badge bg="warning" className="ms-2" title="Ne peut pas être supprimé - a des employés assignés">
                            <i className="bi bi-people-fill"></i>
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td>
                      {department.head ? (
                        <span className="fw-medium">{department.head}</span>
                      ) : (
                        <em className="text-muted">Non assigné</em>
                      )}
                    </td>
                    <td>
                      {department.role ? (
                        <Badge bg="info">{department.role}</Badge>
                      ) : (
                        <em className="text-muted">Non défini</em>
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Badge 
                          bg={department.staff_count > 0 ? 'success' : 'secondary'}
                          className="me-2"
                        >
                          {department.actualStaffCount}/{department.staff_count}
                        </Badge>
                        <small className="text-muted">employé(s)</small>
                      </div>
                    </td>
                    <td>
                      <div style={{ width: '80px' }}>
                        <ProgressBar 
                          now={Math.min(occupancyRate, 100)}
                          size="sm"
                          variant={
                            occupancyRate >= 100 ? 'success' : 
                            occupancyRate >= 70 ? 'warning' : 'info'
                          }
                        />
                        <small className="text-muted">
                          {occupancyRate.toFixed(0)}%
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleEdit(department)}
                          title="Modifier"
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          disabled={!department.canDelete}
                          onClick={() => handleDelete(department)}
                          title={department.canDelete ? 'Supprimer' : 'Suppression impossible - des employés sont assignés'}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted small">
                Affichage de {startIndex + 1} à {Math.min(endIndex, filteredDepartments.length)} sur {filteredDepartments.length} résultats
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
      <DepartmentForm
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setSelectedDepartment(null);
        }}
        department={selectedDepartment}
        mode="edit"
      />

      {/* Modal de confirmation de suppression */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Supprimer le Département"
        message={`Êtes-vous sûr de vouloir supprimer le département "${selectedDepartment?.name}" ?`}
        isLoading={deleteDepartment.isPending}
      />
    </>
  );
}
