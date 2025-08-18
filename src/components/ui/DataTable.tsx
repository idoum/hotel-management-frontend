// src/components/ui/DataTable.tsx
import { Table } from 'react-bootstrap';

export default function DataTable<T>({
  columns,
  data,
}: {
  columns: { header: string; accessor: keyof T | ((row: T) => React.ReactNode) }[];
  data: T[];
}) {
  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.header}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td key={String(col.header)}>
                {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as any)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
