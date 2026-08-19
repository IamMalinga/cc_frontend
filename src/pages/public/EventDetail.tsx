import { JSX, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Spinner, Row, Col, Modal } from 'react-bootstrap';
import { FaDownload, FaChevronLeft, FaChevronRight, FaTimes, FaRegCalendar } from 'react-icons/fa';
import { useGetEventByIdQuery } from '../../api/publicApi';
import RichTextContent from '../../components/public/RichTextContent';
import './EventDetail.scss';

export default function EventDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, isError } = useGetEventByIdQuery(id ?? '', { skip: !id });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = event?.images ?? [];
  const attachments = event?.attachments ?? [];

  const showPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const showNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" style={{ color: '#0d2d62' }} />
      </Container>
    );
  }

  if (isError || !event) {
    return (
      <Container className="cc-event-detail-notfound py-5 text-center">
        <h4>Event not found</h4>
        <p className="text-muted">It may have been removed or the link is incorrect.</p>
        <Link to="/events" className="cc-event-detail-back-btn">
          <FaChevronLeft />
          Back to Events
        </Link>
      </Container>
    );
  }

  const eventDate = new Date(event.eventDate);

  return (
    <article className="cc-event-detail">
      {/* Hero banner */}
      <div className="cc-event-detail-hero">
        {event.imageUrl ? (
          <>
            <div
              className="cc-event-detail-hero-backdrop"
              style={{ backgroundImage: `url(${event.imageUrl})` }}
            />
            <img src={event.imageUrl} alt="" className="cc-event-detail-hero-image" />
          </>
        ) : (
          <div className="cc-event-detail-hero-fallback" />
        )}
        <div className="cc-event-detail-hero-overlay" />

        <Container className="cc-event-detail-hero-content">
          <Link to="/events" className="cc-event-detail-back-link">
            <FaChevronLeft />
            Back to Events
          </Link>

          <span className="cc-event-detail-badge">
            {event.category === 'STAFF' ? 'Staff Event' : 'Student Event'}
          </span>

          <h1 className="cc-event-detail-title">{event.title}</h1>

          <div className="cc-event-detail-meta">
            <FaRegCalendar />
            {eventDate.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </Container>
      </div>

      {/* Body */}
      <Container className="cc-event-detail-body">
        <RichTextContent html={event.description} className="cc-event-detail-content" />

        {images.length > 0 && (
          <div className="cc-event-detail-section">
            <h2 className="cc-event-detail-section-title">Photo Gallery</h2>
            <Row className="g-3">
              {images.map((img, index) => (
                <Col xs={6} md={4} lg={3} key={img.id}>
                  <button
                    type="button"
                    className="cc-event-gallery-item"
                    onClick={() => setLightboxIndex(index)}
                    style={{ backgroundImage: `url(${img.imageUrl})` }}
                    aria-label={`View photo ${index + 1}${img.caption ? `: ${img.caption}` : ''}`}
                  >
                    <span className="cc-event-gallery-zoom">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                      </svg>
                    </span>
                  </button>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="cc-event-detail-section">
            <h2 className="cc-event-detail-section-title">Downloads</h2>
            <div className="cc-event-downloads">
              {attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cc-event-download-item"
                >
                  <span className="cc-event-download-icon">
                    <FaDownload />
                  </span>
                  <span className="cc-event-download-label">{att.label}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="cc-event-download-arrow"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* Lightbox */}
      <Modal
        show={lightboxIndex !== null}
        onHide={() => setLightboxIndex(null)}
        centered
        size="lg"
        className="cc-event-lightbox"
      >
        <Modal.Body className="p-0">
          {lightboxIndex !== null && images[lightboxIndex] && (
            <div className="cc-event-lightbox-content">
              <button
                type="button"
                className="cc-event-lightbox-close"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close"
              >
                <FaTimes />
              </button>

              {images.length > 1 && (
                <button
                  type="button"
                  className="cc-event-lightbox-nav cc-event-lightbox-nav--prev"
                  onClick={showPrev}
                  aria-label="Previous photo"
                >
                  <FaChevronLeft />
                </button>
              )}

              <img
                src={images[lightboxIndex].imageUrl}
                alt={images[lightboxIndex].caption ?? event.title}
                className="cc-event-lightbox-image"
              />

              {images.length > 1 && (
                <button
                  type="button"
                  className="cc-event-lightbox-nav cc-event-lightbox-nav--next"
                  onClick={showNext}
                  aria-label="Next photo"
                >
                  <FaChevronRight />
                </button>
              )}

              <div className="cc-event-lightbox-footer">
                {images[lightboxIndex].caption && (
                  <p className="cc-event-lightbox-caption">{images[lightboxIndex].caption}</p>
                )}
                {images.length > 1 && (
                  <span className="cc-event-lightbox-counter">
                    {lightboxIndex + 1} / {images.length}
                  </span>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </article>
  );
}