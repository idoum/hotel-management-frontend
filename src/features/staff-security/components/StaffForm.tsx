'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { useCreateStaff, useUpdateStaff } from '../hooks/useStaff';
import { useDepartments } from '../hooks/useDepartments';
import { CreateStaffDTO, StaffWithRelations } from '../types/staff-security.types';
import InputField from '@/components/forms/InputField';

interface Props {
  show: boolean;
  onHide: () => void;
  staff?: StaffWithRelations | null;
  mode: 'create' | 'edit';
}

export default function StaffForm({ show, onHide, staff, mode }: Props) {
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const { data: departments } = useDepartments();
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<CreateStaffDTO>();

  // Remplir le formulaire en mode édition
  useEffect(() => {
    if (show && staff && mode === 'edit') {
      reset({
        name: staff.name,
        age: staff.age || undefined,
        contact_info: staff.contact_info || '',
        salary: staff.salary || undefined,
        department_id: staff.department_id || undefined,
      });
    } else if (show && mode === 'create') {
      reset({
        name: '',
        age: undefined,
        contact_info: '',
        salary: undefined,
        department_id: undefined,
      });
    }
  }, [show, staff, mode, reset]);

  const onSubmit = async (data: CreateStaffDTO) => {
    try {
      // Nettoyer les données
      const cleanData = {
        ...data,
        age: data.age || undefined,
        contact_info: data.contact_info || undefined,
        salary: data.salary || undefined,
        department_id: data.department_id || undefined,
      };

      if (mode === 'create') {
        await createStaff.mutateAsync(cleanData);
      } else if (mode === 'edit' && staff) {
        await updateStaff.mutateAsync({
          id: staff.staff_id,
          data: cleanData,
        });
      }
      onHide();
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
    }
  };

  const isLoading = createStaff.isPending || updateStaff.isPending;
  const error = createStaff.error || updateStaff.error;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'create' ? 'Nouvel Employé' : 'Modifier l\'Employé'}
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
            <Col md={8}>
              <InputField
                label="Nom complet"
                register={register('name', {
                  required: 'Le nom est obligatoire',
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
                placeholder="Ex: Jean Dupont"
              />
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Âge</Form.Label>
                <Form.Control
                  type="number"
                  min="16"
                  max="70"
                  {...register('age', {
                    valueAsNumber: true,
                    min: {
                      value: 16,
                      message: 'L\'âge minimum est 16 ans'
                    },
                    max: {
                      value: 70,
                      message: 'L\'âge maximum est 70 ans'
                    }
                  })}
                  isInvalid={!!errors.age}
                  placeholder="Ex: 30"
                />
                <Form.Text className="text-muted">
                  Optionnel
                </Form.Text>
                {errors.age && (
                  <Form.Control.Feedback type="invalid">
                    {errors.age.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <InputField
                label="Informations de contact"
                register={register('contact_info', {
                  maxLength: {
                    value: 255,
                    message: 'Les informations de contact ne peuvent pas dépasser 255 caractères'
                  }
                })}
                error={errors.contact_info}
                placeholder="Email, téléphone, adresse..."
                required={false}
              />
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Département</Form.Label>
                <Form.Select
                  {...register('department_id', {
                    valueAsNumber: true
                  })}
                  isInvalid={!!errors.department_id}
                >
                  <option value="">Aucun département</option>
                  {departments?.map(dept => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Optionnel
                </Form.Text>
                {errors.department_id && (
                  <Form.Control.Feedback type="invalid">
                    {errors.department_id.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Salaire (€)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  max="999999.99"
                  {...register('salary', {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'Le salaire ne peut pas être négatif'
                    },
                    max: {
                      value: 999999.99,
                      message: 'Le salaire ne peut pas dépasser 999,999.99 €'
                    }
                  })}
                  isInvalid={!!errors.salary}
                  placeholder="Ex: 2500.00"
                />
                <Form.Text className="text-muted">
                  Montant brut mensuel (optionnel)
                </Form.Text>
                {errors.salary && (
                  <Form.Control.Feedback type="invalid">
                    {errors.salary.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Informations supplémentaires en mode édition */}
          {mode === 'edit' && staff && (
            <Alert variant="info" className="small">
              <div className="row">
                <div className="col-md-6">
                  <strong>ID:</strong> {staff.staff_id}
                </div>
                <div className="col-md-6">
                  <strong>Statut:</strong> {staff.isActive ? 'Actif' : 'Inactif'}
                </div>
              </div>
            </Alert>
          )}

          {/* Prévisualisation */}
          {watch('name') && (
            <Alert variant="secondary" className="small">
              <strong>Aperçu:</strong> {watch('name')}
              {watch('age') && <span> - {watch('age')} ans</span>}
              {watch('salary') && (
                <span> - {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(watch('salary'))}</span>
              )}
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
