'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useCreateRole, useUpdateRole } from '../hooks/useRoles';
import { CreateRoleDTO, RoleWithRelations } from '../types/staff-security.types';
import InputField from '@/components/forms/InputField';

interface Props {
  show: boolean;
  onHide: () => void;
  role?: RoleWithRelations | null;
  mode: 'create' | 'edit';
}

export default function RoleForm({ show, onHide, role, mode }: Props) {
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<CreateRoleDTO>();

  // Remplir le formulaire en mode édition
  useEffect(() => {
    if (show && role && mode === 'edit') {
      reset({
        role_name: role.role_name,
        description: role.description || '',
      });
    } else if (show && mode === 'create') {
      reset({
        role_name: '',
        description: '',
      });
    }
  }, [show, role, mode, reset]);

  const onSubmit = async (data: CreateRoleDTO) => {
    try {
      if (mode === 'create') {
        await createRole.mutateAsync(data);
      } else if (mode === 'edit' && role) {
        await updateRole.mutateAsync({
          id: role.role_id,
          data,
        });
      }
      onHide();
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
    }
  };

  const isLoading = createRole.isPending || updateRole.isPending;
  const error = createRole.error || updateRole.error;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'create' ? 'Nouveau Rôle' : 'Modifier le Rôle'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          {error && (
            <Alert variant="danger">
              <strong>Erreur:</strong> {error.message}
            </Alert>
          )}

          <InputField
            label="Nom du Rôle"
            register={register('role_name', {
              required: 'Le nom du rôle est obligatoire',
              minLength: {
                value: 2,
                message: 'Le nom doit contenir au moins 2 caractères'
              },
              maxLength: {
                value: 50,
                message: 'Le nom ne peut pas dépasser 50 caractères'
              }
            })}
            error={errors.role_name}
            placeholder="Ex: Admin, Manager, Employé"
          />

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register('description')}
              placeholder="Description du rôle et de ses responsabilités..."
            />
            <Form.Text className="text-muted">
              Décrivez les responsabilités de ce rôle (optionnel).
            </Form.Text>
          </Form.Group>

          {/* Informations supplémentaires en mode édition */}
          {mode === 'edit' && role && (
            <Alert variant="info" className="small">
              <div className="d-flex justify-content-between">
                <span><strong>Permissions:</strong> {role.permissionsCount}</span>
                <span><strong>Utilisateurs:</strong> {role.usersCount}</span>
              </div>
            </Alert>
          )}

          {/* Prévisualisation du nom */}
          {watch('role_name') && (
            <Alert variant="secondary" className="small">
              <strong>Aperçu:</strong> {watch('role_name')}
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
