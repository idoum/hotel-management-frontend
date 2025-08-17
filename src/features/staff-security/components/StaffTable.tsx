// src/features/staff-security/components/StaffTable.tsx
'use client';

import React from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { useStaff } from '../hooks/useStaff';

export default function StaffTable() {
  const { data, isLoading, error } = useStaff();

  if (isLoading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return <Alert variant="danger">Erreur : {error.message}</Alert>;
  }
  return (
    <Table striped hover>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Rôle</th>
          <th>Département</th>
          <th>Actif</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((staff) => (
          <tr key={staff.id}>
            <td>{staff.firstName} {staff.lastName}</td>
            <td>{staff.email}</td>
            <td>{staff.role.name}</td>
            <td>{staff.department?.name || '—'}</td>
            <td>{staff.isActive ? 'Oui' : 'Non'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
