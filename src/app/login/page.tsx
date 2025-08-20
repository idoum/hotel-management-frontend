'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LoginForm from '@/features/staff-security/components/LoginForm';
import { useAuth } from '@/features/staff-security/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { data: user } = useAuth();
  const router = useRouter();

  // Rediriger si déjà connecté
  React.useEffect(() => {
    if (user?.isAuthenticated) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-vh-100 bg-gradient-primary d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <div className="text-center mb-4">
              <h1 className="text-white mb-2">
                <i className="bi bi-building me-3"></i>
                Hotel Management
              </h1>
              <p className="text-white-50">
                Système de gestion hôtelière - Accès Staff
              </p>
            </div>
            
            <LoginForm 
              onSuccess={() => {
                // La redirection est gérée par le hook useLogin
                console.log('Login successful - redirecting...');
              }} 
            />

            <div className="text-center mt-4">
              <a 
                href="/reset-password" 
                className="text-white text-decoration-none small"
              >
                <i className="bi bi-arrow-right me-1"></i>
                Réinitialiser le mot de passe
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
