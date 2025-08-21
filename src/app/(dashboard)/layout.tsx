'use client';

import React from 'react';
import { Container, Navbar, Nav, NavDropdown, Offcanvas, ListGroup, Button } from 'react-bootstrap';
import { useAuth, useLogout, usePermissions } from '@/features/staff-security/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const { data: user } = useAuth();
  const logout = useLogout();
  const { hasPermission, hasRole, isAdmin } = usePermissions();
  const pathname = usePathname();
  const router = useRouter();
  
  const [showSidebar, setShowSidebar] = React.useState(false);

  const handleLogout = async () => {
    try {
      console.log('🚀 Dashboard: Initiating logout...');
      await logout.mutateAsync();
      console.log('✅ Dashboard: Logout completed');
    } catch (error) {
      console.error('❌ Dashboard: Logout error:', error);
      // Forcer la redirection même en cas d'erreur
      router.push('/login');
    }
  };

  // Navigation items avec permissions
  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: 'bi-speedometer2',
      permission: null
    },
    {
      title: 'Staff & Sécurité',
      icon: 'bi-people',
      children: [
        {
          title: 'Utilisateurs',
          href: '/staff/users',
          icon: 'bi-person-badge',
          permission: 'user_read'
        },
        {
          title: 'Employés',
          href: '/staff/employees',
          icon: 'bi-people',
          permission: 'staff_read'
        },
        {
          title: 'Rôles',
          href: '/staff/roles',
          icon: 'bi-shield-check',
          permission: 'role_read'
        },
        {
          title: 'Permissions',
          href: '/staff/permissions-matrix',
          icon: 'bi-shield-lock',
          permission: 'permission_manage',
          adminOnly: true
        },
        {
          title: 'Départements',
          href: '/staff/departments',
          icon: 'bi-building',
          permission: 'department_read'
        }
      ]
    },
    {
      title: 'Hébergement',
      icon: 'bi-house',
      children: [
        {
          title: 'Chambres',
          href: '/accommodation/rooms',
          icon: 'bi-door-open',
          permission: 'room_read'
        },
        {
          title: 'Types de chambres',
          href: '/accommodation/room-types',
          icon: 'bi-list-stars',
          permission: 'room_type_read'
        },
        {
          title: 'Clients',
          href: '/accommodation/guests',
          icon: 'bi-person-check',
          permission: 'guest_read'
        },
        {
          title: 'Réservations',
          href: '/accommodation/bookings',
          icon: 'bi-calendar-check',
          permission: 'booking_read'
        }
      ]
    },
    {
      title: 'Restaurant',
      icon: 'bi-cup-hot',
      children: [
        {
          title: 'Restaurants',
          href: '/restaurant/restaurants',
          icon: 'bi-shop',
          permission: 'restaurant_read'
        },
        {
          title: 'Tables',
          href: '/restaurant/tables',
          icon: 'bi-table',
          permission: 'table_read'
        },
        {
          title: 'Menu',
          href: '/restaurant/menu',
          icon: 'bi-menu-button',
          permission: 'menu_read'
        },
        {
          title: 'Commandes',
          href: '/restaurant/orders',
          icon: 'bi-receipt',
          permission: 'order_read'
        }
      ]
    }
  ];

  // Filtrer les items selon les permissions
  const getFilteredNavItems = (items: any[]) => {
    return items.filter(item => {
      if (item.adminOnly && !isAdmin()) return false;
      if (item.permission && !hasPermission(item.permission)) return false;
      if (item.children) {
        item.children = getFilteredNavItems(item.children);
        return item.children.length > 0;
      }
      return true;
    });
  };

  const filteredNavItems = getFilteredNavItems([...navigationItems]);

  const isActiveLink = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <ProtectedRoute requireAuth>
      <div className="min-vh-100 bg-light">
        {/* Header Navigation */}
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
          <Container fluid>
            <Button
              variant="outline-light"
              className="me-3 d-lg-none"
              onClick={() => setShowSidebar(true)}
            >
              <i className="bi bi-list"></i>
            </Button>

            <Navbar.Brand as={Link} href="/dashboard">
              <i className="bi bi-building me-2"></i>
              Hotel Management
            </Navbar.Brand>

            <Nav className="ms-auto align-items-center">
              {user && (
                <NavDropdown
                  title={
                    <span>
                      <i className="bi bi-person-circle me-1"></i>
                      {user.username}
                      {isAdmin() && <span className="badge bg-danger ms-1">ADMIN</span>}
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Header>
                    <div><strong>{user.username}</strong></div>
                    <small className="text-muted">{user.email}</small>
                    {user.staff && (
                      <small className="text-info d-block">
                        👤 {user.staff.name}
                      </small>
                    )}
                  </NavDropdown.Header>
                  
                  <NavDropdown.Divider />
                  
                  <NavDropdown.Item>
                    <i className="bi bi-person me-2"></i>
                    Profil
                  </NavDropdown.Item>
                  
                  <NavDropdown.Item>
                    <i className="bi bi-gear me-2"></i>
                    Paramètres
                  </NavDropdown.Item>
                  
                  <NavDropdown.Divider />
                  
                  <NavDropdown.Item className="text-muted small">
                    <strong>Rôles:</strong> {user.roles?.map(r => r.role_name).join(', ') || 'Aucun'}
                  </NavDropdown.Item>
                  
                  <NavDropdown.Item className="text-muted small">
                    <strong>Permissions:</strong> {user.permissions?.length || 0}
                  </NavDropdown.Item>
                  
                  <NavDropdown.Divider />
                  
                  <NavDropdown.Item 
                    onClick={handleLogout}
                    className="text-danger"
                    disabled={logout.isPending}
                  >
                    <i className={`bi ${logout.isPending ? 'bi-hourglass-split' : 'bi-box-arrow-right'} me-2`}></i>
                    {logout.isPending ? 'Déconnexion...' : 'Déconnexion'}
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Container>
        </Navbar>

        <div className="d-flex">
          {/* Sidebar Desktop */}
          <div className="d-none d-lg-block bg-white shadow-sm" style={{ width: '260px', minHeight: 'calc(100vh - 56px)' }}>
            <div className="p-3">
              <ListGroup variant="flush">
                {filteredNavItems.map((item, index) => (
                  <div key={index}>
                    {item.href ? (
                      <ListGroup.Item
                        as={Link}
                        href={item.href}
                        action
                        active={isActiveLink(item.href)}
                        className="border-0 py-2"
                      >
                        <i className={`${item.icon} me-2`}></i>
                        {item.title}
                      </ListGroup.Item>
                    ) : (
                      <>
                        <ListGroup.Item className="border-0 py-2 fw-semibold text-muted small text-uppercase">
                          <i className={`${item.icon} me-2`}></i>
                          {item.title}
                        </ListGroup.Item>
                        {item.children?.map((child: any, childIndex: number) => (
                          <ListGroup.Item
                            key={childIndex}
                            as={Link}
                            href={child.href}
                            action
                            active={isActiveLink(child.href)}
                            className="border-0 py-2 ps-4"
                          >
                            <i className={`${child.icon} me-2`}></i>
                            {child.title}
                          </ListGroup.Item>
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </ListGroup>
            </div>
          </div>

          {/* Sidebar Mobile */}
          <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>
                <i className="bi bi-building me-2"></i>
                Navigation
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <ListGroup variant="flush">
                {filteredNavItems.map((item, index) => (
                  <div key={index}>
                    {item.href ? (
                      <ListGroup.Item
                        as={Link}
                        href={item.href}
                        action
                        active={isActiveLink(item.href)}
                        className="border-0 py-2"
                        onClick={() => setShowSidebar(false)}
                      >
                        <i className={`${item.icon} me-2`}></i>
                        {item.title}
                      </ListGroup.Item>
                    ) : (
                      <>
                        <ListGroup.Item className="border-0 py-2 fw-semibold text-muted small text-uppercase">
                          <i className={`${item.icon} me-2`}></i>
                          {item.title}
                        </ListGroup.Item>
                        {item.children?.map((child: any, childIndex: number) => (
                          <ListGroup.Item
                            key={childIndex}
                            as={Link}
                            href={child.href}
                            action
                            active={isActiveLink(child.href)}
                            className="border-0 py-2 ps-4"
                            onClick={() => setShowSidebar(false)}
                          >
                            <i className={`${child.icon} me-2`}></i>
                            {child.title}
                          </ListGroup.Item>
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </ListGroup>
            </Offcanvas.Body>
          </Offcanvas>

          {/* Main Content */}
          <main className="flex-grow-1 p-4">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
