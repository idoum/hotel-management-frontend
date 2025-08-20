'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { useCreateDepartment, useUpdateDepartment } from '../hooks/useDepartments';
import { CreateDepartmentDTO, DepartmentWithRelations } from '../types/staff-security.types';
import InputField from '@/components/forms/InputField';

interface Props {
  show: boolean;
  onHide: () => void;
  department?: DepartmentWithRelations | null;
  mode: 'create' | 'edit';
}

export default function DepartmentForm({ show, onHide, department, mode }: Props) {
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<CreateDepartmentDTO>();

  // Remplir le formulaire en mode édition
  useEffect(() => {
    if (show && department && mode === 'edit') {
      reset({
        name: department.name,
        head: department.head || '',
        role: department.role || '',
        staff_count: department.staff_count || 0,
      });
    } else if (show && mode === 'create') {
      reset({
        name: '',
        head: '',
        role: '',
        staff_count: 0,
      });
    }
  }, [show, department, mode, reset]);

  const onSubmit = async (data: CreateDepartmentDTO) => {
    try {
      if (mode === 'create') {
        await createDepartment.mutateAsync(data);
      } else if (mode === 'edit' && department) {
        await updateDepartment.mutateAsync({
          id: department.department_id,
          data,
        });
      }
      onHide();
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
    }
  };

  const isLoading = createDepartment.isPending || updateDepartment.isPending;
  const error = createDepartment.error || updateDepartment.error;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'create' ? 'Nouveau Département' : 'Modifier le Département'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          {error && (
            <Alert variant="danger">
              <strong>Erreur:</strong> {error.message}
            </Alert>
          )}

          <Row>
            <Col md={12}>
              <InputField
                label="Nom du Département"
                register={register('name', {
                  required: 'Le nom du département est obligatoire',
                  minLength: {
                    value: 2,
                    message: 'Le nom doit contenir au moins 2 caractères'
                  },
                  maxLength: {
                    value: 255,
                    message: 'Le nom ne peut pas dépasser 255 caractères'
                  }
                })}
                error={errors.name}
                placeholder="Ex: Ressources Humaines, Informatique, Comptabilité"
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <InputField
                label="Responsable"
                register={register('head', {
                  maxLength: {
                    value: 255,
                    message: 'Le nom ne peut pas dépasser 255 caractères'
                  }
                })}
                error={errors.head}
                placeholder="Nom du chef de département"
                required={false}
              />
            </Col>
            <Col md={6}>
              <InputField
                label="Rôle/Description"
                register={register('role', {
                  maxLength: {
                    value: 255,
                    message: 'La description ne peut pas dépasser 255 caractères'
                  }
                })}
                error={errors.role}
                placeholder="Ex: Gestion du personnel, Support technique"
                required={false}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Capacité d'employés</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  max="1000"
                  {...register('staff_count', {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'La capacité ne peut pas être négative'
                    },
                    max: {
                      value: 1000,
                      message: 'La capacité ne peut pas dépasser 1000'
                    }
                  })}
                  isInvalid={!!errors.staff_count}
                  placeholder="0"
                />
                <Form.Text className="text-muted">
                  Nombre maximal d&apos;employés pour ce département
                </Form.Text>
                {errors.staff_count && (
                  <Form.Control.Feedback type="invalid">
                    {errors.staff_count.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Informations supplémentaires en mode édition */}
          {mode === 'edit' && department && (
            <Alert variant="info" className="small">
              <div className="row">
                <div className="col-md-6">
                  <strong>Employés actuels:</strong> {department.actualStaffCount}
                </div>
                <div className="col-md-6">
                  <strong>Capacité:</strong> {department.staff_count}
                </div>
              </div>
            </Alert>
          )}

          {/* Prévisualisation */}
          {watch('name') && (
            <Alert variant="secondary" className="small">
              <strong>Aperçu:</strong> {watch('name')}
              {watch('head') && <span> - Responsable: {watch('head')}</span>}
              {watch('role') && <span> - {watch('role')}</span>}
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isLoading}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Enregistrement...
              </>
            ) : (
              mode === 'create' ? 'Créer' : 'Modifier'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
