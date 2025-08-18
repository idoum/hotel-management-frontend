// src/features/staff-security/components/RoleTable.tsx
'use client';

import { Spinner } from 'react-bootstrap';
import DataTable from '@/components/ui/DataTable';
import { useRoles } from '../hooks/useRoles';

export default function RoleTable() {
  const { data, isLoading } = useRoles();

  if (isLoading) return <Spinner animation="border" />;

  return (
    <DataTable
      columns={[
        { header: 'Nom', accessor: 'name' },
        { header: 'Description', accessor: 'description' },
        {
          header: 'Nbre permissions',
          accessor: (r) => r.permissions.length,
        },
      ]}
      data={data || []}
    />
  );
}
