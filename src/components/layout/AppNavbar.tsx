'use client';

import Link from 'next/link';
import { Navbar, Container, Nav } from 'react-bootstrap';

export default function AppNavbar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow">
      <Container>
        <Link href="/" className="navbar-brand fw-bold">
          🏨 Hotel MS
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link href="/staff" className="nav-link">
              Staff & Sécurité
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
