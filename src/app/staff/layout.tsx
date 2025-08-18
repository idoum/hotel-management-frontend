'use client';

import AppNavbar from '@/components/layout/AppNavbar';
import Sidebar from '@/components/layout/Sidebar';
import { Container } from 'react-bootstrap';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNavbar />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <Container fluid>{children}</Container>
        </main>
      </div>
    </>
  );
}
