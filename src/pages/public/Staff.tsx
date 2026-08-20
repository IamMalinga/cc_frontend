import { JSX, useState } from 'react';
import { Container } from 'react-bootstrap';
import { FaLink, FaEnvelope, FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';
import { useGetStaffPageQuery } from '../../api/publicApi';
import PaginationBar from '../../components/public/PaginationBar';
import type { StaffCategory, StaffLinkDto } from '../../api/types';
import { getMediaUrl } from '../../utils/mediaUrl';
import './Staff.scss';

interface CategoryTab {
  key: StaffCategory;
  label: string;
}

const categories: CategoryTab[] = [
  { key: 'ACADEMIC', label: 'Academic Staff' },
  { key: 'TECHNICAL', label: 'Non Academic Staff' },
  { key: 'ADMINISTRATIVE', label: 'Instructors' },
  { key: 'SUPPORT', label: 'Academic Support Staff' },
];

function linkIcon(link: StaffLinkDto) {
  const label = link.label.toLowerCase();
  if (label.includes('linkedin')) return <FaLinkedin />;
  if (label.includes('github')) return <FaGithub />;
  if (label.includes('website') || label.includes('portfolio')) return <FaGlobe />;
  return <FaLink />;
}

function StaffGrid({ category, categoryLabel }: { category: StaffCategory; categoryLabel: string }): JSX.Element {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useGetStaffPageQuery({
    category,
    page,
    size: 8,
  });

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="cc-staff-loading">
        <div className="cc-staff-spinner" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="cc-staff-empty">
        <p>Unable to load staff information.</p>
      </div>
    );
  }

  const content = data?.content ?? [];

  if (content.length === 0) {
    return (
      <div className="cc-staff-empty">
        <p>No staff listed in this category yet.</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="cc-staff-category-heading">{categoryLabel}</h2>

      <div className="cc-staff-grid">
        {content.map((member) => {
          const links = member.links ?? [];

          const initials = member.name
            .split(' ')
            .map((part) => part[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

          return (
            <div className="cc-staff-card" key={member.id}>
              <div className="cc-staff-photo">
                {member.imageUrl ? (
                  <img src={getMediaUrl(member.imageUrl)} alt={member.name} />
                ) : (
                  <div className="cc-staff-initials">{initials}</div>
                )}

                {(member.email || links.length > 0) && (
                  <div className="cc-staff-contacts">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="cc-staff-icon-btn"
                        title={member.email}
                        aria-label={`Email ${member.name}`}
                      >
                        <FaEnvelope />
                      </a>
                    )}

                    {links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        title={link.label}
                        className="cc-staff-icon-btn"
                        aria-label={link.label}
                      >
                        {linkIcon(link)}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="cc-staff-body">
                <h3 className="cc-staff-name">{member.name}</h3>
                <p className="cc-staff-designation">{member.designation}</p>
              </div>
            </div>
          );
        })}
      </div>

      {data && data.totalPages > 1 && (
        <PaginationBar
          page={page}
          totalPages={data.totalPages}
          onPageChange={goToPage}
          className="cc-staff-pagination"
        />
      )}
    </>
  );
}

export default function Staff(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<StaffCategory>('ACADEMIC');
  const activeLabel = categories.find((c) => c.key === activeCategory)?.label ?? '';

  return (
    <Container className="cc-staff-content">
      <div className="text-center mb-5">
        <span className="section-tag">MEET THE TEAM</span>
        <h1 className="section-heading">Our Staff</h1>
        <p className="section-description">
          The people behind the Computing Centre's academic, technical,
          administrative, and support services.
        </p>
      </div>

      <div className="cc-staff-tabs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            className={`cc-staff-tab ${activeCategory === cat.key ? 'cc-staff-tab--active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <StaffGrid category={activeCategory} categoryLabel={activeLabel} key={activeCategory} />
    </Container>
  );
}