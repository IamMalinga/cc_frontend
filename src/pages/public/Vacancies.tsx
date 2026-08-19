import { JSX, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaRegFilePdf, FaPaperclip, FaRegClock } from 'react-icons/fa';
import { useGetVacancyPageQuery } from '../../api/publicApi';
import PaginationBar from '../../components/public/PaginationBar';
import RichTextContent from '../../components/public/RichTextContent';
import './Vacancies.scss';

export default function Vacancies(): JSX.Element {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useGetVacancyPageQuery({
    page,
    size: 6,
  });

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const content = data?.content ?? [];

  return (
    <Container className="cc-vacancies-content">
      <div className="text-center mb-5">
        <span className="section-tag">JOIN OUR TEAM</span>

        <h1 className="section-heading">Vacancies</h1>

        <p className="section-description">
          Current job openings at the Computing Centre, Faculty of Engineering,
          University of Peradeniya.
        </p>
      </div>

      {isLoading && (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: '#0d2d62' }} />
        </div>
      )}

      {isError && !isLoading && (
        <div className="cc-vacancies-empty text-center py-5">
          <h5>Unable to load vacancies</h5>
          <p className="text-muted mb-0">
            Please try again later.
          </p>
        </div>
      )}

      {!isLoading && !isError && content.length === 0 && (
        <div className="cc-vacancies-empty text-center py-5">
          <h5>No open vacancies right now</h5>
          <p className="text-muted mb-0">
            Please check back later.
          </p>
        </div>
      )}

      {!isLoading && !isError && content.length > 0 && (
        <Row className="gy-4">
          {content.map((vacancy) => {
            const attachmentCount = vacancy.attachments?.length ?? 0;

            const isClosingSoon =
              !!vacancy.closingDate &&
              new Date(vacancy.closingDate).getTime() - Date.now() <
                1000 * 60 * 60 * 24 * 7;

            return (
              <Col md={6} key={vacancy.id}>
                <div className="cc-vacancy-card h-100">
                  <div className="cc-vacancy-card-header">
                    <h3 className="cc-vacancy-title">
                      {vacancy.title}
                    </h3>

                    {vacancy.closingDate && (
                      <span
                        className={`cc-vacancy-badge ${
                          isClosingSoon
                            ? 'cc-vacancy-badge--urgent'
                            : ''
                        }`}
                      >
                        <FaRegClock />

                        Closes{' '}
                        {new Date(
                          vacancy.closingDate
                        ).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>

                  <RichTextContent
  html={vacancy.description}
  maxLength={160}
  className="cc-vacancy-excerpt"
/>

                  {(vacancy.fileUrl || attachmentCount > 0) && (
                    <div className="cc-vacancy-files">
                      {vacancy.fileUrl && (
                        <span className="cc-vacancy-file-tag">
                          <FaRegFilePdf />
                          Advertisement PDF
                        </span>
                      )}

                      {attachmentCount > 0 && (
                        <span className="cc-vacancy-file-tag">
                          <FaPaperclip />
                          {attachmentCount} file
                          {attachmentCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  )}

                  <Link
                    to={`/vacancies/${vacancy.id}`}
                    className="cc-vacancy-link"
                  >
                    View details

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
              </Col>
            );
          })}
        </Row>
      )}

      {data && data.totalPages > 1 && (
        <PaginationBar
          page={page}
          totalPages={data.totalPages}
          onPageChange={goToPage}
          className="cc-vacancies-pagination"
        />
      )}
    </Container>
  );
}