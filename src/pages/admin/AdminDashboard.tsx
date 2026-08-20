import type { JSX } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaImages,
  FaNewspaper,
  FaUsers,
  FaBriefcase,
  FaCalendarAlt,
  FaUserTie,
  FaPlus,
  FaArrowRight,
  FaExclamationTriangle,
} from 'react-icons/fa';
import {
  useGetAllHeroSlidesQuery,
  useGetAllNewsPostsQuery,
  useGetAllStaffMembersPagedQuery,
  useGetAllVacanciesPagedQuery,
  useGetAllEventItemsPagedQuery,
  useGetAllPastDirectorsQuery,
} from '../../api/adminApi';
import './AdminDashboard.scss';

interface StatCardProps {
  label: string;
  count?: number;
  to: string;
  icon: JSX.Element;
  accent: 'navy' | 'gold' | 'green' | 'red' | 'blue' | 'purple';
}

function StatCard({ label, count, to, icon, accent }: StatCardProps): JSX.Element {
  return (
    <Col md={6} lg={4}>
      <Link to={to} className={`cc-stat-card cc-stat-card--${accent}`}>
        <div className="cc-stat-card-icon">{icon}</div>
        <div className="cc-stat-card-body">
          <div className="cc-stat-card-value">{count ?? '–'}</div>
          <div className="cc-stat-card-label">{label}</div>
        </div>
        <FaArrowRight className="cc-stat-card-arrow" />
      </Link>
    </Col>
  );
}

interface QuickAction {
  label: string;
  to: string;
  icon: JSX.Element;
}

const quickActions: QuickAction[] = [
  { label: 'Add News Post', to: '/admin/news/new', icon: <FaNewspaper /> },
  { label: 'Add Vacancy', to: '/admin/vacancies/new', icon: <FaBriefcase /> },
  { label: 'Add Event', to: '/admin/events/new', icon: <FaCalendarAlt /> },
  { label: 'Add Staff Member', to: '/admin/staff/new', icon: <FaUsers /> },
];

export default function AdminDashboard(): JSX.Element {
  const { data: hero = [] } = useGetAllHeroSlidesQuery();
  const { data: news = [] } = useGetAllNewsPostsQuery();
  const { data: staffPage } = useGetAllStaffMembersPagedQuery({ page: 0, size: 1 });
  const { data: vacancyPage } = useGetAllVacanciesPagedQuery({ page: 0, size: 1 });
  const { data: eventPage } = useGetAllEventItemsPagedQuery({ page: 0, size: 1 });
  const { data: directors = [] } = useGetAllPastDirectorsQuery();

  const activeVacancies = vacancyPage?.content?.filter((v) => v.active).length ?? 0;
  const openVacancyWarning = (vacancyPage?.totalElements ?? 0) > 0 && activeVacancies === 0;

  return (
    <div className="cc-admin-dashboard">
      <div className="cc-admin-dashboard-header">
        <div>
          <h1 className="cc-admin-dashboard-title">Dashboard</h1>
          <p className="cc-admin-dashboard-subtitle">
            Overview of everything published on the Computing Centre website.
          </p>
        </div>
      </div>

      {openVacancyWarning && (
        <div className="cc-admin-alert">
          <FaExclamationTriangle />
          You have vacancies on record, but none are currently marked active — the public
          Vacancies page may be showing "No open vacancies."
        </div>
      )}

      <Row className="g-4 mb-5">
        <StatCard label="Hero Slides" count={hero.length} to="/admin/hero" icon={<FaImages />} accent="navy" />
        <StatCard label="News Posts" count={news.length} to="/admin/news" icon={<FaNewspaper />} accent="gold" />
        <StatCard label="Staff Members" count={staffPage?.totalElements} to="/admin/staff" icon={<FaUsers />} accent="blue" />
        <StatCard label="Vacancies" count={vacancyPage?.totalElements} to="/admin/vacancies" icon={<FaBriefcase />} accent="green" />
        <StatCard label="Events" count={eventPage?.totalElements} to="/admin/events" icon={<FaCalendarAlt />} accent="purple" />
        <StatCard label="Past Directors" count={directors.length} to="/admin/directors" icon={<FaUserTie />} accent="red" />
      </Row>

      <div className="cc-admin-quick-actions">
        <h2 className="cc-admin-section-title">Quick actions</h2>
        <div className="cc-admin-quick-actions-grid">
          {quickActions.map((action) => (
            <Link to={action.to} className="cc-admin-quick-action" key={action.to}>
              <span className="cc-admin-quick-action-icon">{action.icon}</span>
              <span>{action.label}</span>
              <FaPlus className="cc-admin-quick-action-plus" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}