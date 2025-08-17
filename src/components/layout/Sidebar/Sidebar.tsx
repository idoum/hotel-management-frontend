'use client';

import React from 'react';
import { Nav, Accordion } from 'react-bootstrap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, hasPermission } = useAuth();

  const isActiveLink = (href: string) => pathname.startsWith(href);

  const renderNavItem = (item: typeof NAVIGATION[0], index: number) => {
    // Vérifier les permissions
    if (item.permission && !hasPermission(item.permission)) {
      return null;
    }

    if (item.children) {
      // Sous-menu avec accordéon
      return (
        <Accordion key={item.id} className="mb-1">
          <Accordion.Item eventKey={index.toString()}>
            <Accordion.Header>
              <i className={`bi bi-${item.icon} me-2`}></i>
              {item.label}
            </Accordion.Header>
            <Accordion.Body className="p-0">
              {item.children.map((child) => {
                if (child.permission && !hasPermission(child.permission)) {
                  return null;
                }
                
                return (
                  <Nav.Link
                    key={child.href}
                    as={Link}
                    href={child.href}
                    className={`ps-4 py-2 ${isActiveLink(child.href) ? 'active bg-primary text-white' : ''}`}
                  >
                    {child.label}
                  </Nav.Link>
                );
              })}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      );
    }

    // Élément de menu simple
    return (
      <Nav.Link
        key={item.id}
        as={Link}
        href={item.href}
        className={`d-flex align-items-center py-3 ${isActiveLink(item.href) ? 'active bg-primary text-white' : ''}`}
      >
        <i className={`bi bi-${item.icon} me-3`}></i>
        {item.label}
      </Nav.Link>
    );
  };

  return (
    <div className="sidebar-hotel p-3" style={{ width: '280px' }}>
      <div className="mb-4 text-center">
        <h4 className="text-white mb-1">🏨 Hotel</h4>
        <small className="text-light opacity-75">Management System</small>
      </div>

      <Nav className="flex-column">
        {NAVIGATION.map((item, index) => renderNavItem(item, index))}
      </Nav>

      {user && (
        <div className="mt-auto pt-4 border-top border-secondary">
          <div className="d-flex align-items-center text-light">
            <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-person-fill"></i>
            </div>
            <div>
              <div className="fw-semibold">{user.firstName} {user.lastName}</div>
              <small className="opacity-75">{user.role.name}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
