import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import { JSX } from 'react/jsx-runtime';
import './Breadcrumbs.scss';

// Maps a URL segment to a display label. Segments not listed here fall back
// to a title-cased version of the segment itself (e.g. "lab-reservation" ->
// "Lab Reservation"), so only exceptions/overrides need to be listed.
const SEGMENT_LABELS: Record<string, string> = {
  news: 'News',
  staff: 'Staff',
  about: 'About Us',
  contact: 'Contact',
  history: 'History',
  policy: 'Policy and Rules',
  labs: 'Our Labs',
  vacancies: 'Vacancies',
  events: 'CC Events',
  student: 'Student Events',
  staff_events: 'Staff Events',
  services: 'Services',
  'lab-reservation': 'Lab Reservation',
  wifi: 'Guest Wi-Fi',
  directors: 'Past Directors',
};

// Segments that are route params (numeric ids, etc.) rather than real path
// labels - shown as a generic terminal crumb instead of the raw id.
function isDynamicSegment(segment: string): boolean {
  return /^\d+$/.test(segment);
}

function labelFor(segment: string): string {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];

  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Breadcrumbs(): JSX.Element | null {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  // No breadcrumb bar on the homepage, or inside the admin panel (which has
  // its own sidebar navigation context).
  if (segments.length === 0 || segments[0] === 'admin') {
    return null;
  }

  let accumulatedPath = '';
  const crumbs = segments.map((segment, index) => {
    accumulatedPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    const dynamic = isDynamicSegment(segment);

    return {
      path: accumulatedPath,
      label: dynamic ? 'Details' : labelFor(segment),
      isLast,
      clickable: !isLast && !dynamic,
    };
  });

  return (
    <nav className="cc-breadcrumbs" aria-label="Breadcrumb">
      <div className="cc-breadcrumbs-inner">
        <Link to="/" className="cc-breadcrumb-item cc-breadcrumb-item--home">
          <FaHome />
          <span>Home</span>
        </Link>

        {crumbs.map((crumb) => (
          <span className="cc-breadcrumb-segment" key={crumb.path}>
            <FaChevronRight className="cc-breadcrumb-sep" />
            {crumb.isLast ? (
              <span className="cc-breadcrumb-item cc-breadcrumb-item--current" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link to={crumb.path} className="cc-breadcrumb-item">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}