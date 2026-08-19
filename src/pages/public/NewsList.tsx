import { useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaRegCalendar } from 'react-icons/fa';
import { useGetNewsPageQuery } from '../../api/publicApi';
import { JSX } from 'react/jsx-runtime';
import './NewsList.scss';

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i);
  }

  const pages: (number | 'ellipsis')[] = [0];

  if (current > 2) pages.push('ellipsis');

  const start = Math.max(1, current - 1);
  const end = Math.min(total - 2, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 3) pages.push('ellipsis');

  pages.push(total - 1);

  return pages;
}

export default function NewsList(): JSX.Element {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useGetNewsPageQuery({ page, size: 9 });

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container className="cc-newslist-content">
      <div className="text-center mb-5">
        <span className="section-tag">LATEST UPDATES</span>
        <h1 className="section-heading">News &amp; Announcements</h1>
        <p className="section-description">
          Stay informed with the latest news, achievements, events, and
          announcements from the Computing Centre.
        </p>
      </div>

      {isLoading && (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: '#0d2d62' }} />
        </div>
      )}

      {!isLoading && data && data.content.length === 0 && (
        <div className="text-center py-5">
          <h5>No news available.</h5>
        </div>
      )}

      <Row className="gy-4">
        {data?.content.map((post) => (
          <Col md={6} lg={4} key={post.id}>
            <Card className="cc-news-list-card border-0 h-100">
              <div className="cc-news-list-image-wrapper">
                {post.imageUrl ? (
                  <Card.Img src={post.imageUrl} className="cc-news-list-image" />
                ) : (
                  <div className="cc-news-list-image cc-news-list-image--placeholder" />
                )}
                <div className="cc-news-list-overlay" />
              </div>

              <Card.Body>
                <div className="cc-news-list-date">
                  <FaRegCalendar />
                  {new Date(post.publishedDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>

                <Card.Title className="cc-news-list-title">{post.title}</Card.Title>

                <Card.Text className="cc-news-list-excerpt">
                  {post.content.slice(0, 110)}
                  {post.content.length > 110 ? '…' : ''}
                </Card.Text>

                <Link to={`/news/${post.id}`} className="cc-news-list-link">
                  Read more
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {data && data.totalPages > 1 && (
        <nav className="cc-pagination" aria-label="News pagination">
          <button
            type="button"
            className="cc-pagination-btn cc-pagination-btn--nav"
            onClick={() => goToPage(page - 1)}
            disabled={page === 0}
            aria-label="Previous page"
          >
            <FaChevronLeft />
          </button>

          {getPageNumbers(page, data.totalPages).map((p, idx) =>
            p === 'ellipsis' ? (
              <span className="cc-pagination-ellipsis" key={`ellipsis-${idx}`}>
                &hellip;
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className={`cc-pagination-btn ${p === page ? 'cc-pagination-btn--active' : ''}`}
                onClick={() => goToPage(p)}
                aria-current={p === page ? 'page' : undefined}
              >
                {p + 1}
              </button>
            )
          )}

          <button
            type="button"
            className="cc-pagination-btn cc-pagination-btn--nav"
            onClick={() => goToPage(page + 1)}
            disabled={page === data.totalPages - 1}
            aria-label="Next page"
          >
            <FaChevronRight />
          </button>
        </nav>
      )}
    </Container>
  );
}