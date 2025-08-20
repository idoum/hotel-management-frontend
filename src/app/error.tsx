'use client';

import { useEffect } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <Container className="mt-5">
      <Alert variant="danger">
        <Alert.Heading>Une erreur est survenue !</Alert.Heading>
        <p>{error.message}</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button variant="outline-danger" onClick={reset}>
            Réessayer
          </Button>
        </div>
      </Alert>
      
      {process.env.NODE_ENV === 'development' && (
        <Alert variant="secondary">
          <h6>Debug Info:</h6>
          <pre><code>{error.stack}</code></pre>
        </Alert>
      )}
    </Container>
  );
}
