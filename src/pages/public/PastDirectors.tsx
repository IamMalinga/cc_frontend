import { JSX } from 'react/jsx-runtime';
import { Container, Row, Col } from 'react-bootstrap';
import { useGetPastDirectorsQuery } from '../../api/publicApi';
import { getMediaUrl } from '../../utils/mediaUrl';
import './PastDirectors.scss';

export default function PastDirectors(): JSX.Element {
  const { data = [], isLoading } = useGetPastDirectorsQuery();

  const formatYear = (date: string) => new Date(date).getFullYear();

  const sorted = [...data].sort(
    (a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime()
  );

  const initialsOf = (name: string) =>
    name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <Container className="cc-directors-content">
      <div className="text-center mb-5">
        <span className="section-tag">OUR LEGACY</span>
        <h1 className="section-heading">Past Directors</h1>
        <p className="section-description">
          Honoring the leaders who have guided the Computing Centre since its
          establishment in 1971.
        </p>
      </div>

      {isLoading && (
        <div className="cc-directors-loading">
          <div className="cc-directors-spinner" />
        </div>
      )}

      {!isLoading && sorted.length === 0 && (
        <div className="cc-directors-empty">
          <p>No past directors listed yet.</p>
        </div>
      )}

      {!isLoading && sorted.length > 0 && (
        <Row className="gy-5 justify-content-center">
          {sorted.map((director) => {
            const isCurrent = !director.periodTo;

            return (
              <Col xs={9} sm={6} md={4} lg={3} key={director.id}>
                <div className="cc-portrait-card">
                  {isCurrent && <span className="cc-portrait-badge">Current</span>}

                  <div className="cc-portrait-frame">
                    {director.photoUrl ? (
                      <img src={getMediaUrl(director.photoUrl)} alt={director.name} />
                    ) : (
                      <div className="cc-portrait-initials">{initialsOf(director.name)}</div>
                    )}
                  </div>

                  <div className="cc-portrait-plaque">
                    <h3 className="cc-portrait-name">{director.name}</h3>
                    <div className="cc-portrait-period">
                      <span>{formatYear(director.periodFrom)}</span>
                      <span className="cc-portrait-period-sep" />
                      <span>{director.periodTo ? formatYear(director.periodTo) : 'Present'}</span>
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}