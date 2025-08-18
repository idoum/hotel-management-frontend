'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Nav } from 'react-bootstrap';

const items = [
  { label: 'Tableau', href: '/staff' },
  { label: 'Personnel', href: '/staff/users' },
  { label: 'Rôles', href: '/staff/roles' },
  { label: 'Permissions', href: '/staff/permissions' },
  { label: 'Départements', href: '/staff/departments' },
  { label: 'Audit', href: '/staff/audit-logs' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <Nav className="flex-column bg-white border-end vh-100 p-3" style={{ width: 240 }}>
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={'nav-link mb-2 ' + (pathname === it.href ? 'active fw-semibold' : 'text-secondary')}
        >
          {it.label}
        </Link>
      ))}
    </Nav>
  );
}
