'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { useCreateUser, useUpdateUser } from '../hooks/useUsers';
import { useStaff } from '../hooks/useStaff';
import { useRoles } from '../hooks/useRoles';
import { CreateUserDTO, UserWithRelations } from '../types/staff-security.types';
import InputField from '@/components/forms/InputField';

interface Props {
  show: boolean;
  onHide: () => void;
  user?: UserWithRelations | null;
  mode: 'create' | 'edit';
}

export default function UserForm({ show, onHide, user, mode }: Props) {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const { data: staff } = useStaff();
  const { data: roles } = useRoles();
  
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<CreateUserDTO>();

  // Filtrer le staff qui n'a pas encore de compte utilisateur
  const availableStaff = React.useMemo(() => {
    if (!staff) return [];
    
    if (mode === 'edit' && user) {
      // En mode édition, inclure le staff actuel de l'utilisateur
      return staff.filter(s => s.staff_id === user.staff_id || !s.hasUser);
    }
    
    // En mode création, seulement le staff sans utilisateur
    return staff.filter(s => !s.hasUser);
  }, [staff, mode, user]);

  // Remplir le formulaire en mode édition
  useEffect(() => {
    if (show && user && mode === 'edit') {
      reset({
        username: user.username,
        email: user.email,
        staff_id: user.staff_id,
        role_ids: user.roles?.map(r => r.role_id) || [],
        password: '', // Ne pas préremplir le mot de passe
      });
    } else if (show && mode === 'create') {
      reset({
        username: '',
        email: '',
        staff_id: undefined,
        role_ids: [],
        password: '',
      });
    }
  }, [show, user, mode, reset]);

  const onSubmit = async (data: CreateUserDTO) => {
    try {
      // Nettoyer les données
      const cleanData = {
        ...data,
        staff_id: Number(data.staff_id),
        role_ids: data.role_ids || [],
      };

      if (mode === 'create') {
        if (!cleanData.password) {
          alert('Le mot de passe est requis pour créer un utilisateur');
          return;
        }
        await createUser.mutateAsync(cleanData);
      } else if (mode === 'edit' && user) {
        // En mode édition, ne pas envoyer le mot de passe s'il est vide
        const { password, role_ids, ...updateData } = cleanData;
        await updateUser.mutateAsync({
          id: user.user_id,
          data: updateData,
        });
      }
      onHide();
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
    }
  };

  const isLoading = createUser.isPending || updateUser.isPending;
  const error = createUser.error || updateUser.error;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'create' ? 'Nouvel Utilisateur' : 'Modifier l\'Utilisateur'}
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
            <Col md={6}>
              <InputField
                label="Nom d'utilisateur"
                register={register('username', {
                  required: 'Le nom d\'utilisateur est obligatoire',
                  minLength: {
                    value: 3,
                    message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères'
                  },
                  maxLength: {
                    value: 50,
                    message: 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères'
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'
                  }
                })}
                error={errors.username}
                placeholder="Ex: jdupont"
              />
            </Col>
            <Col md={6}>
              <InputField
                label="Adresse email"
                type="email"
                register={register('email', {
                  required: 'L\'adresse email est obligatoire',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Adresse email invalide'
                  }
                })}
                error={errors.email}
                placeholder="Ex: jean.dupont@hotel.com"
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Employé associé <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  {...register('staff_id', {
                    required: 'L\'employé associé est obligatoire',
                    valueAsNumber: true
                  })}
                  isInvalid={!!errors.staff_id}
                >
                  <option value="">Sélectionner un employé</option>
                  {availableStaff?.map(s => (
                    <option key={s.staff_id} value={s.staff_id}>
                      {s.name} {s.department?.name && `(${s.department.name})`}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  {mode === 'create' 
                    ? 'Seuls les employés sans compte utilisateur sont affichés'
                    : 'L\'employé actuel et ceux sans compte sont disponibles'
                  }
                </Form.Text>
                {errors.staff_id && (
                  <Form.Control.Feedback type="invalid">
                    {errors.staff_id.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Mot de passe 
                  {mode === 'create' && <span className="text-danger">*</span>}
                </Form.Label>
                <Form.Control
                  type="password"
                  {...register('password', {
                    required: mode === 'create' ? 'Le mot de passe est obligatoire' : false,
                    minLength: {
                      value: 8,
                      message: 'Le mot de passe doit contenir au moins 8 caractères'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
                    }
                  })}
                  isInvalid={!!errors.password}
                  placeholder={mode === 'edit' ? 'Laisser vide pour ne pas changer' : 'Mot de passe sécurisé'}
                />
                <Form.Text className="text-muted">
                  {mode === 'edit' 
                    ? 'Laissez vide pour conserver le mot de passe actuel'
                    : 'Au moins 8 caractères avec majuscule, minuscule et chiffre'
                  }
                </Form.Text>
                {errors.password && (
                  <Form.Control.Feedback type="invalid">
                    {errors.password.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Rôles à assigner</Form.Label>
                <div className="border p-3 rounded">
                  {roles && roles.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {roles.map(role => (
                        <Form.Check
                          key={role.role_id}
                          type="checkbox"
                          id={`role-${role.role_id}`}
                          label={
                            <div>
                              <strong>{role.role_name}</strong>
                              {role.description && (
                                <div className="small text-muted">{role.description}</div>
                              )}
                            </div>
                          }
                          value={role.role_id}
                          {...register('role_ids')}
                          className="mb-2"
                        />
                      ))}
                    </div>
                  ) : (
                    <em className="text-muted">Aucun rôle disponible</em>
                  )}
                </div>
                <Form.Text className="text-muted">
                  {mode === 'create' 
                    ? 'Sélectionnez les rôles à assigner au nouvel utilisateur'
                    : 'Note: Les rôles sont gérés via le bouton "Gérer les rôles" dans le tableau'
                  }
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {/* Informations supplémentaires en mode édition */}
          {mode === 'edit' && user && (
            <Alert variant="info" className="small">
              <div className="row">
                <div className="col-md-4">
                  <strong>ID:</strong> {user.user_id}
                </div>
                <div className="col-md-4">
                  <strong>Statut:</strong> {user.active ? 'Actif' : 'Inactif'}
                </div>
                <div className="col-md-4">
                  <strong>Rôles actuels:</strong> {user.rolesCount}
                </div>
              </div>
            </Alert>
          )}

          {/* Prévisualisation */}
          {watch('username') && (
            <Alert variant="secondary" className="small">
              <strong>Aperçu:</strong> {watch('username')} ({watch('email')})
              {availableStaff?.find(s => s.staff_id === Number(watch('staff_id')))?.name && (
                <span> - Employé: {availableStaff.find(s => s.staff_id === Number(watch('staff_id')))?.name}</span>
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
                {mode === 'create' ? 'Création...' : 'Modification...'}
              </>
            ) : (
              mode === 'create' ? 'Créer l\'utilisateur' : 'Modifier'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
