import type { JSX, ReactNode } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  useGetAllHeroSlidesQuery,
  useGetAllNewsPostsQuery,
  useGetAllStaffMembersPagedQuery,
  useGetAllVacanciesPagedQuery,
  useGetAllEventItemsPagedQuery,
  useGetAllPastDirectorsQuery,
} from '../../api/adminApi';

interface StatCardProps {
  label: string;
  count?: number;
  to: string;
}

function StatCard({ label, count, to }: StatCardProps): ReactNode {
  return (
    <Col md={4}>
      <Card className="cc-card p-4 text-center h-100">
        <div className="display-5 fw-bold" style={{ color: '#0d2d62' }}>{count ?? '–'}</div>
        <div className="text-muted mb-3">{label}</div>
        <Link to={to} className="small fw-semibold" style={{ color: '#0d2d62' }}>Manage →</Link>
      </Card>
    </Col>
  );
}

export default function AdminDashboard(): JSX.Element {
  const { data: hero = [] } = useGetAllHeroSlidesQuery();
  const { data: news = [] } = useGetAllNewsPostsQuery();
  const { data: staffPage } = useGetAllStaffMembersPagedQuery({ page: 0, size: 1 });
  const { data: vacancyPage } = useGetAllVacanciesPagedQuery({ page: 0, size: 1 });
  const { data: eventPage } = useGetAllEventItemsPagedQuery({ page: 0, size: 1 });
  const { data: directors = [] } = useGetAllPastDirectorsQuery();

  return (
    <div>
      <h3 className="mb-4" style={{ color: '#0d2d62' }}>Dashboard</h3>
      <Row className="gy-4">
        <StatCard label="Hero Slides" count={hero.length} to="/admin/hero" />
        <StatCard label="News Posts" count={news.length} to="/admin/news" />
        <StatCard label="Staff Members" count={staffPage?.totalElements} to="/admin/staff" />
        <StatCard label="Vacancies" count={vacancyPage?.totalElements} to="/admin/vacancies" />
        <StatCard label="Events" count={eventPage?.totalElements} to="/admin/events" />
        <StatCard label="Past Directors" count={directors.length} to="/admin/directors" />
      </Row>
    </div>
  );
}
