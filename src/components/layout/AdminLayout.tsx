import { Outlet, NavLink } from 'react-router-dom';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { logout } from '../../auth/keycloak';
import type { RootState } from '../../app/store';
import { JSX } from 'react/jsx-runtime';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

const navItems: NavItem[] = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/hero', label: 'Hero Slides' },
  { to: '/admin/news', label: 'News' },
  { to: '/admin/staff', label: 'Staff' },
  // Coming next: labs, services, quick links, vacancies, events -
  // same pattern as hero/news/staff once the CRUD scaffold is proven out.
];

export default function AdminLayout(): JSX.Element {
  const { name, username } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <Navbar style={{ backgroundColor: '#0d2d62' }} variant="dark" className="px-3">
        <Navbar.Brand>Computing Centre — Admin</Navbar.Brand>
        <div className="ms-auto d-flex align-items-center text-white gap-3">
          <span className="small">{name || username}</span>
          <button className="btn btn-sm btn-outline-light" onClick={() => logout()} type="button">
            Log out
          </button>
        </div>
      </Navbar>

      <Container fluid>
        <Row>
          <Col md={2} className="cc-admin-sidebar p-3">
            <Nav className="flex-column gap-1">
              {navItems.map((item) => (
                <NavLink
                  to={item.to}
                  key={item.to}
                  end={item.end}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </Nav>
          </Col>
          <Col md={10} className="cc-admin-content p-4">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
