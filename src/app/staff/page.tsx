// src/app/staff/page.tsx
'use client';

import React from 'react';
import { Card } from 'react-bootstrap';

export default function StaffHomePage() {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Staff & Sécurité</Card.Title>
        <Card.Text>
          Bienvenue dans le module Staff & Sécurité. Sélectionnez une section ci-dessus pour commencer.
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
