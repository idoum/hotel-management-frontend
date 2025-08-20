'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Alert, Spinner } from 'react-bootstrap';
import { useAuth, usePermissions } from '@/features/staff-security/hooks/useAuth';

interface Props {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  requireAuth?: boolean;
  fallbackUrl?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission, 
  requireAuth = true,
  fallbackUrl = '/login' 
}: Props) {
  const { data: user, isLoading } = useAuth();
  const { hasRole, hasPermission } = usePermissions();
  const router = useRouter();
  const pathname = usePathname();

  // Attendre le chargement de l'auth
  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Vérifier l'authentification
  if (requireAuth && !user?.isAuthenticated) {
    // Stocker la page courante pour redirection après login
    sessionStorage.setItem('redirectAfterLogin', pathname);
    router.push(fallbackUrl);
    return null;
  }

  // Vérifier le rôle requis
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          <Alert.Heading>
            <i className="bi bi-shield-x me-2"></i>
            Accès Refusé
          </Alert.Heading>
          <p>
            Vous n&apos;avez pas le rôle requis pour accéder à cette page.
          </p>
          <hr />
          <div className="d-flex justify-content-between align-items-center mb-0">
            <div>
              <strong>Rôle requis:</strong> {requiredRole}
              <br />
              <strong>Vos rôles:</strong> {user?.roles?.map(r => r.role_name).join(', ') || 'Aucun'}
            </div>
            <button 
              className="btn btn-outline-danger"
              onClick={() => router.back()}
            >
              Retour
            </button>
          </div>
        </Alert>
      </div>
    );
  }

  // Vérifier la permission requise
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="container mt-4">
        <Alert variant="warning">
          <Alert.Heading>
            <i className="bi bi-shield-exclamation me-2"></i>
            Permission Insuffisante
          </Alert.Heading>
          <p>
            Vous n&apos;avez pas la permission requise pour accéder à cette page.
          </p>
          <hr />
          <div className="d-flex justify-content-between align-items-center mb-0">
            <div>
              <strong>Permission requise:</strong> {requiredPermission}
              <br />
              <strong>Vos permissions:</strong> {user?.permissions?.length || 0} permission(s)
            </div>
            <button 
              className="btn btn-outline-warning"
              onClick={() => router.back()}
            >
              Retour
            </button>
          </div>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
