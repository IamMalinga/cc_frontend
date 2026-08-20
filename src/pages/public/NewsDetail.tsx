import { useParams, Link } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import { useGetNewsByIdQuery } from '../../api/publicApi';
import { JSX } from 'react/jsx-runtime';
import { getMediaUrl } from '../../utils/mediaUrl';
import './NewsDetail.scss';

export default function NewsDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, isError } = useGetNewsByIdQuery(id ?? '', { skip: !id });

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" style={{ color: '#0d2d62' }} />
      </Container>
    );
  }

  if (isError || !post) {
    return (
      <Container className="cc-news-detail-notfound py-5 text-center">
        <h4>News post not found</h4>
        <p className="text-muted">It may have been removed or the link is incorrect.</p>
        <Link to="/news" className="cc-news-detail-back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to News
        </Link>
      </Container>
    );
  }

  const cleanHtml = DOMPurify.sanitize(post.content);

  return (
    <article className="cc-news-detail">
      {/* Hero banner */}
      <div
        className="cc-news-detail-hero"
        style={post.imageUrl ? { backgroundImage: `url(${getMediaUrl(post.imageUrl)})` } : undefined}
      >
        {!post.imageUrl && <div className="cc-news-detail-hero-fallback" />}
        <div className="cc-news-detail-hero-overlay" />

        <Container className="cc-news-detail-hero-content">
          <Link to="/news" className="cc-news-detail-back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to News
          </Link>

          <span className="cc-news-detail-badge">Announcement</span>

          <h1 className="cc-news-detail-title">{post.title}</h1>

          <div className="cc-news-detail-meta">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {new Date(post.publishedDate).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </Container>
      </div>

      {/* Body */}
      <Container className="cc-news-detail-body">
        <div className="cc-news-detail-content" dangerouslySetInnerHTML={{ __html: cleanHtml }} />

        <div className="cc-news-detail-footer">
          <Link to="/news" className="cc-news-detail-back-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to all news
          </Link>
        </div>
      </Container>
    </article>
  );
}