import { Outlet, NavLink } from 'react-router-dom';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {
  FaTachometerAlt,
  FaImages,
  FaNewspaper,
  FaUsers,
  FaBriefcase,
  FaCalendarAlt,
  FaUserTie,
  FaSignOutAlt,
} from 'react-icons/fa';
import { logout } from '../../auth/keycloak';
import type { RootState } from '../../app/store';
import { JSX } from 'react/jsx-runtime';

interface NavItem {
  to: string;
  label: string;
  icon: JSX.Element;
  end?: boolean;
}

const navItems: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: <FaTachometerAlt />, end: true },
  { to: '/admin/hero', label: 'Hero Slides', icon: <FaImages /> },
  { to: '/admin/news', label: 'News', icon: <FaNewspaper /> },
  { to: '/admin/staff', label: 'Staff', icon: <FaUsers /> },
  { to: '/admin/vacancies', label: 'Vacancies', icon: <FaBriefcase /> },
  { to: '/admin/events', label: 'Events', icon: <FaCalendarAlt /> },
  { to: '/admin/directors', label: 'Past Directors', icon: <FaUserTie /> },
];

export default function AdminLayout(): JSX.Element {
  const { name, username } = useSelector((state: RootState) => state.auth);

  return (
    <div className="cc-admin-shell">
      <Navbar className="cc-admin-topbar" variant="dark">
        <Container fluid className="px-3">
          <Navbar.Brand className="cc-admin-brand">
            Computing Centre <span>Admin</span>
          </Navbar.Brand>
          <div className="ms-auto d-flex align-items-center gap-3">
            <div className="cc-admin-user">
              <div className="cc-admin-user-avatar">
                {(name || username || '?').charAt(0).toUpperCase()}
              </div>
              <span className="cc-admin-user-name">{name || username}</span>
            </div>
            <button className="cc-admin-logout-btn" onClick={() => logout()} type="button">
              <FaSignOutAlt />
              Log out
            </button>
          </div>
        </Container>
      </Navbar>

      <Container fluid className="cc-admin-body">
        <Row className="g-0">
          <Col md={2} className="cc-admin-sidebar p-3">
            <Nav className="flex-column gap-1">
              {navItems.map((item) => (
                <NavLink
                  to={item.to}
                  key={item.to}
                  end={item.end}
                  className={({ isActive }) => `cc-admin-nav-link${isActive ? ' active' : ''}`}
                >
                  <span className="cc-admin-nav-icon">{item.icon}</span>
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