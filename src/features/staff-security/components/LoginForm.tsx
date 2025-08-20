'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Alert, Card, InputGroup } from 'react-bootstrap';
import { useLogin } from '../hooks/useAuth';
import { LoginRequest } from '../types/staff-security.types';
import InputField from '@/components/forms/InputField';

interface Props {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: Props) {
  const login = useLogin();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<LoginRequest>();
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login.mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      // L'erreur est gérée par le hook
    }
  };

  const identifier = watch('identifier');

  return (
    <Card className="shadow-lg border-0">
      <Card.Header className="bg-primary text-white text-center py-4">
        <div className="mb-2">
          <i className="bi bi-building display-4"></i>
        </div>
        <h3 className="mb-0">Hotel Management</h3>
        <p className="mb-0 opacity-75">Connexion Staff</p>
      </Card.Header>
      
      <Card.Body className="p-4">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <Form.Label>Nom d'utilisateur ou Email</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-person"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                {...register('identifier', {
                  required: 'Nom d\'utilisateur ou email requis',
                  minLength: {
                    value: 3,
                    message: 'Au moins 3 caractères requis'
                  }
                })}
                isInvalid={!!errors.identifier}
                placeholder="Entrez votre nom d'utilisateur ou email"
                autoComplete="username"
                autoFocus
              />
              {errors.identifier && (
                <Form.Control.Feedback type="invalid">
                  {errors.identifier.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </div>

          <div className="mb-3">
            <Form.Label>Mot de passe</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-lock"></i>
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Mot de passe requis',
                  minLength: {
                    value: 3,
                    message: 'Mot de passe trop court'
                  }
                })}
                isInvalid={!!errors.password}
                placeholder="Entrez votre mot de passe"
                autoComplete="current-password"
              />
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
              </Button>
              {errors.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </div>

          {login.error && (
            <Alert variant="danger" className="mb-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              <strong>Erreur de connexion:</strong> {login.error.message}
            </Alert>
          )}

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2"
            disabled={login.isPending}
            size="lg"
          >
            {login.isPending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Connexion en cours...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Se connecter
              </>
            )}
          </Button>

          {/* Info de développement */}
          <div className="mt-3 p-3 bg-light rounded small">
            <strong>Info développement:</strong>
            <div>Format accepté: nom d'utilisateur ou email</div>
            <div>Exemple: admin ou admin@hotel.com</div>
            {identifier && (
              <div className="text-primary mt-1">
                Mode détecté: {identifier.includes('@') ? 'Email' : 'Username'}
              </div>
            )}
          </div>

          {/* Lien reset password */}
          <div className="text-center mt-3">
            <small>
              <a href="#" className="text-muted text-decoration-none">
                Mot de passe oublié ?
              </a>
            </small>
          </div>
        </Form>
      </Card.Body>

      <Card.Footer className="text-center text-muted py-3">
        <small>
          <i className="bi bi-shield-check me-1"></i>
          Connexion sécurisée SSL
        </small>
      </Card.Footer>
    </Card>
  );
}
