'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Alert, Card, InputGroup } from 'react-bootstrap';
import { useResetPassword } from '../hooks/useAuth';
import { ResetPasswordDTO } from '../types/staff-security.types';

export default function ResetPasswordForm() {
  const resetPassword = useResetPassword();
  
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<ResetPasswordDTO>();
  const [success, setSuccess] = React.useState(false);

  const onSubmit = async (data: ResetPasswordDTO) => {
    try {
      await resetPassword.mutateAsync(data);
      setSuccess(true);
      reset();
    } catch (error) {
      // L'erreur est gérée par le hook
    }
  };

  const newPassword = watch('newPassword');

  // Validation de la force du mot de passe
  const passwordStrength = React.useMemo(() => {
    if (!newPassword) return { score: 0, text: '', color: 'secondary' };
    
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
      { score: 0, text: '', color: 'secondary' },
      { score: 1, text: 'Très faible', color: 'danger' },
      { score: 2, text: 'Faible', color: 'warning' },
      { score: 3, text: 'Moyen', color: 'info' },
      { score: 4, text: 'Fort', color: 'success' },
      { score: 5, text: 'Très fort', color: 'success' },
    ];
    
    return levels[score] || levels[0];
  }, [newPassword]);

  if (success) {
    return (
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-success text-white text-center py-4">
          <i className="bi bi-check-circle display-4 mb-2"></i>
          <h3>Réinitialisation réussie</h3>
        </Card.Header>
        <Card.Body className="text-center p-4">
          <Alert variant="success">
            <h5>Mot de passe réinitialisé !</h5>
            <p className="mb-0">
              Votre mot de passe a été réinitialisé avec succès. 
              Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
            </p>
          </Alert>
          <Button 
            variant="primary" 
            href="/login"
            className="mt-3"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Retour à la connexion
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <Card.Header className="bg-warning text-dark text-center py-4">
        <div className="mb-2">
          <i className="bi bi-key display-4"></i>
        </div>
        <h3 className="mb-0">Réinitialisation</h3>
        <p className="mb-0">Définir un nouveau mot de passe</p>
      </Card.Header>
      
      <Card.Body className="p-4">
        <Alert variant="info" className="mb-4">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Attention:</strong> Cette fonctionnalité est à usage administratif uniquement. 
          En production, utilisez un système de réinitialisation par email sécurisé.
        </Alert>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <Form.Label>Adresse Email</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-envelope"></i>
              </InputGroup.Text>
              <Form.Control
                type="email"
                {...register('email', {
                  required: 'L\'adresse email est requise',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Adresse email invalide'
                  }
                })}
                isInvalid={!!errors.email}
                placeholder="Entrez l'adresse email du compte"
                autoComplete="email"
              />
              {errors.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </div>

          <div className="mb-3">
            <Form.Label>Nouveau mot de passe</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-lock"></i>
              </InputGroup.Text>
              <Form.Control
                type="password"
                {...register('newPassword', {
                  required: 'Le nouveau mot de passe est requis',
                  minLength: {
                    value: 8,
                    message: 'Le mot de passe doit contenir au moins 8 caractères'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
                  }
                })}
                isInvalid={!!errors.newPassword}
                placeholder="Entrez le nouveau mot de passe"
                autoComplete="new-password"
              />
              {errors.newPassword && (
                <Form.Control.Feedback type="invalid">
                  {errors.newPassword.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
            
            {/* Indicateur de force */}
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

          <div className="mb-4">
            <Form.Label>Confirmer le mot de passe</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-lock-fill"></i>
              </InputGroup.Text>
              <Form.Control
                type="password"
                {...register('confirmPassword', {
                  required: 'La confirmation est requise',
                  validate: (value) => {
                    if (value !== newPassword) {
                      return 'Les mots de passe ne correspondent pas';
                    }
                    return true;
                  }
                })}
                isInvalid={!!errors.confirmPassword}
                placeholder="Confirmez le nouveau mot de passe"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </div>

          {resetPassword.error && (
            <Alert variant="danger" className="mb-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              <strong>Erreur:</strong> {resetPassword.error.message}
            </Alert>
          )}

          <Button
            variant="warning"
            type="submit"
            className="w-100 py-2 text-dark"
            disabled={resetPassword.isPending}
            size="lg"
          >
            {resetPassword.isPending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Réinitialisation...
              </>
            ) : (
              <>
                <i className="bi bi-key me-2"></i>
                Réinitialiser le mot de passe
              </>
            )}
          </Button>

          <div className="text-center mt-3">
            <Button variant="link" href="/login" className="text-decoration-none">
              <i className="bi bi-arrow-left me-1"></i>
              Retour à la connexion
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
