'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useUpdatePassword } from '../hooks/useUsers';
import { UserWithRelations, UpdatePasswordDTO } from '../types/staff-security.types';
import InputField from '@/components/forms/InputField';

interface Props {
  show: boolean;
  onHide: () => void;
  user: UserWithRelations | null;
}

export default function PasswordChangeModal({ show, onHide, user }: Props) {
  const updatePassword = useUpdatePassword();
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<UpdatePasswordDTO>();

  // Réinitialiser le formulaire à l'ouverture
  React.useEffect(() => {
    if (show) {
      reset({
        currentPassword: '',
        newPassword: '',
      });
    }
  }, [show, reset]);

  const onSubmit = async (data: UpdatePasswordDTO) => {
    if (!user) return;

    try {
      await updatePassword.mutateAsync({
        userId: user.user_id,
        data,
      });
      
      // Réinitialiser et fermer
      reset();
      onHide();
    } catch (error: any) {
      console.error('Erreur lors du changement de mot de passe:', error);
    }
  };

  const newPassword = watch('newPassword');
  const currentPassword = watch('currentPassword');

  // Validation de la force du mot de passe
  const passwordStrength = React.useMemo(() => {
    if (!newPassword) return { score: 0, text: '', color: '' };
    
    let score = 0;
    const checks = {
      length: newPassword.length >= 8,
      lowercase: /[a-z]/.test(newPassword),
      uppercase: /[A-Z]/.test(newPassword),
      number: /\d/.test(newPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    const levels = [
      { score: 0, text: '', color: '' },
      { score: 1, text: 'Très faible', color: 'danger' },
      { score: 2, text: 'Faible', color: 'warning' },
      { score: 3, text: 'Moyen', color: 'info' },
      { score: 4, text: 'Fort', color: 'success' },
      { score: 5, text: 'Très fort', color: 'success' },
    ];
    
    return levels[score] || levels[0];
  }, [newPassword]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-key me-2"></i>
          Changer le mot de passe
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          {user && (
            <Alert variant="info" className="mb-3">
              <strong>Utilisateur:</strong> {user.username} ({user.email})
              <br />
              <small className="text-muted">
                Employé: {user.staff?.name || 'Non assigné'}
              </small>
            </Alert>
          )}

          <InputField
            label="Mot de passe actuel"
            type="password"
            register={register('currentPassword', {
              required: 'Le mot de passe actuel est obligatoire',
            })}
            error={errors.currentPassword}
            placeholder="Entrez le mot de passe actuel"
            autoComplete="current-password"
          />

          <div className="mb-3">
            <InputField
              label="Nouveau mot de passe"
              type="password"
              register={register('newPassword', {
                required: 'Le nouveau mot de passe est obligatoire',
                minLength: {
                  value: 8,
                  message: 'Le mot de passe doit contenir au moins 8 caractères'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
                },
                validate: (value) => {
                  if (value === currentPassword) {
                    return 'Le nouveau mot de passe doit être différent de l\'ancien';
                  }
                  return true;
                }
              })}
              error={errors.newPassword}
              placeholder="Entrez le nouveau mot de passe"
              autoComplete="new-password"
            />
            
            {/* Indicateur de force du mot de passe */}
            {newPassword && (
              <div className="mt-2">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">Force du mot de passe:</small>
                  <small className={`text-${passwordStrength.color}`}>
                    {passwordStrength.text}
                  </small>
                </div>
                <div className="progress" style={{ height: '4px' }}>
                  <div 
                    className={`progress-bar bg-${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <InputField
            label="Confirmer le nouveau mot de passe"
            type="password"
            register={register('confirmPassword' as keyof UpdatePasswordDTO, {
              required: 'La confirmation du mot de passe est obligatoire',
              validate: (value) => {
                if (value !== newPassword) {
                  return 'Les mots de passe ne correspondent pas';
                }
                return true;
              }
            })}
            error={errors.confirmPassword as any}
            placeholder="Confirmez le nouveau mot de passe"
            autoComplete="new-password"
          />

          {/* Conseils de sécurité */}
          <Alert variant="light" className="mt-3 small">
            <strong>Conseils pour un mot de passe sécurisé :</strong>
            <ul className="mb-0 mt-1">
              <li>Au moins 8 caractères</li>
              <li>Mélange de majuscules et minuscules</li>
              <li>Au moins un chiffre</li>
              <li>Caractères spéciaux recommandés</li>
              <li>Évitez les informations personnelles</li>
            </ul>
          </Alert>

          {updatePassword.error && (
            <Alert variant="danger">
              <strong>Erreur:</strong> {updatePassword.error.message}
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={onHide}
            disabled={updatePassword.isPending}
          >
            Annuler
          </Button>
          
          <Button 
            variant="primary" 
            type="submit"
            disabled={updatePassword.isPending}
          >
            {updatePassword.isPending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Changement...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-2"></i>
                Changer le mot de passe
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
