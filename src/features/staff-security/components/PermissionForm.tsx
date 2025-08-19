'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useCreatePermission, useUpdatePermission } from '../hooks/usePermissions';
import { CreatePermissionDTO, PermissionWithRoles } from '../types/staff-security.types';
import InputField from '@/components/forms/InputField';

interface Props {
  show: boolean;
  onHide: () => void;
  permission?: PermissionWithRoles | null;
  mode: 'create' | 'edit';
}

export default function PermissionForm({ show, onHide, permission, mode }: Props) {
  const createPermission = useCreatePermission();
  const updatePermission = useUpdatePermission();
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<CreatePermissionDTO>();

  // Remplir le formulaire en mode édition
  useEffect(() => {
    if (show && permission && mode === 'edit') {
      reset({
        permission_name: permission.permission_name,
        description: permission.description || '',
      });
    } else if (show && mode === 'create') {
      reset({
        permission_name: '',
        description: '',
      });
    }
  }, [show, permission, mode, reset]);

  const onSubmit = async (data: CreatePermissionDTO) => {
    try {
      if (mode === 'create') {
        await createPermission.mutateAsync(data);
      } else if (mode === 'edit' && permission) {
        await updatePermission.mutateAsync({
          id: permission.permission_id,
          data,
        });
      }
      onHide();
    } catch (error: unknown) {
      console.error('Erreur lors de l\'enregistrement:', error);
    }
  };

  const isLoading = createPermission.isPending || updatePermission.isPending;
  const error = createPermission.error || updatePermission.error;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'create' ? 'Nouvelle Permission' : 'Modifier la Permission'}
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
            label="Nom de la Permission"
            register={register('permission_name', {
              required: 'Le nom de la permission est obligatoire',
              pattern: {
                value: /^[a-z][a-z0-9_]*[a-z0-9]$/,
                message: 'Format: minuscules, chiffres et _ uniquement (ex: user_create)'
              }
            })}
            error={errors.permission_name}
            placeholder="Ex: user_create, role_update, booking_delete"
          />

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register('description')}
              placeholder="Description de cette permission..."
            />
            <Form.Text className="text-muted">
              Décrivez à quoi sert cette permission (optionnel).
            </Form.Text>
          </Form.Group>

          {/* Prévisualisation du nom */}
          {watch('permission_name') && (
            <Alert variant="info" className="small">
              <strong>Prévisualisation:</strong>{' '}
              <code>{watch('permission_name')}</code>
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
