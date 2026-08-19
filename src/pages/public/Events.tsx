import { JSX, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaRegImages, FaPaperclip, FaRegCalendar } from 'react-icons/fa';
import { useGetEventPageQuery } from '../../api/publicApi';
import PaginationBar from '../../components/public/PaginationBar';
import type { EventCategory } from '../../api/types';
import './Events.scss';

interface EventTab {
  key: EventCategory | 'ALL';
  label: string;
}

const tabs: EventTab[] = [
  { key: 'ALL', label: 'All Events' },
  { key: 'STAFF', label: 'Staff Events' },
  { key: 'STUDENT', label: 'Student Events' },
];

function EventGrid({ category }: { category?: EventCategory }): JSX.Element {
  const [page, setPage] = useState(0);

  const {
    data,
    isLoading,
    isError,
  } = useGetEventPageQuery({
    category,
    page,
    size: 6,
  });

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="cc-events-loading">
        <div className="cc-events-spinner" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="cc-events-empty">
        <p>Unable to load events.</p>
      </div>
    );
  }

  // Always guarantee an array
  const content = data?.content ?? [];

  if (content.length === 0) {
    return (
      <div className="cc-events-empty">
        <p>No events yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="cc-events-grid">
        {content.map((event) => {
          const imageCount = event.images?.length ?? 0;
          const attachmentCount = event.attachments?.length ?? 0;

          const eventDate = new Date(event.eventDate);

          const isUpcoming = eventDate.getTime() > Date.now();

          return (
            <div className="cc-event-card" key={event.id}>
              <div className="cc-event-image-wrapper">
                {event.imageUrl ? (
                  <>
                    <div
                      className="cc-event-image-backdrop"
                      style={{ backgroundImage: `url(${event.imageUrl})` }}
                    />
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="cc-event-image"
                    />
                  </>
                ) : (
                  <div className="cc-event-image cc-event-image--placeholder" />
                )}

                <div className="cc-event-overlay" />

                <div className="cc-event-date-badge">
                  <span className="cc-event-date-day">
                    {eventDate.getDate()}
                  </span>

                  <span className="cc-event-date-month">
                    {eventDate.toLocaleDateString(undefined, {
                      month: 'short',
                    })}
                  </span>
                </div>

                {isUpcoming && (
                  <span className="cc-event-status">
                    Upcoming
                  </span>
                )}
              </div>

              <div className="cc-event-body">
                <div className="cc-event-date-text">
                  <FaRegCalendar />

                  {eventDate.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>

                <h3 className="cc-event-title">
                  {event.title}
                </h3>

                {(imageCount > 0 || attachmentCount > 0) && (
                  <div className="cc-event-meta">
                    {imageCount > 0 && (
                      <span className="cc-event-meta-tag">
                        <FaRegImages />
                        {imageCount} photo
                        {imageCount > 1 ? 's' : ''}
                      </span>
                    )}

                    {attachmentCount > 0 && (
                      <span className="cc-event-meta-tag">
                        <FaPaperclip />
                        {attachmentCount} file
                        {attachmentCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                )}

                <Link
                  to={`/events/${event.id}`}
                  className="cc-event-link"
                >
                  View event

                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
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
          className="cc-events-pagination"
        />
      )}
    </>
  );
}

export default function Events(): JSX.Element {
  const [activeTab, setActiveTab] =
    useState<EventTab['key']>('ALL');

  return (
    <Container className="cc-events-content">
      <div className="text-center mb-5">
        <span className="section-tag">
          WHAT'S HAPPENING
        </span>

        <h1 className="section-heading">
          CC Events
        </h1>

        <p className="section-description">
          Workshops, seminars, and activities hosted by the
          Computing Centre for staff and students.
        </p>
      </div>

      <div className="cc-events-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`cc-events-tab ${
              activeTab === tab.key
                ? 'cc-events-tab--active'
                : ''
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <EventGrid
        category={
          activeTab === 'ALL'
            ? undefined
            : activeTab
        }
        key={activeTab}
      />
    </Container>
  );
}