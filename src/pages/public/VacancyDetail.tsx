import { useParams, Link } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { FaDownload, FaChevronLeft, FaRegClock } from 'react-icons/fa';
import { useGetVacancyByIdQuery } from '../../api/publicApi';
import PdfViewer from '../../components/public/PdfViewer';
import RichTextContent from '../../components/public/RichTextContent';
import { getMediaUrl } from '../../utils/mediaUrl';
import { JSX } from 'react/jsx-runtime';
import './VacancyDetail.scss';

export default function VacancyDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data: vacancy, isLoading, isError } = useGetVacancyByIdQuery(id ?? '', { skip: !id });

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" style={{ color: '#0d2d62' }} />
      </Container>
    );
  }

  if (isError || !vacancy) {
    return (
      <Container className="cc-vacancy-detail-notfound py-5 text-center">
        <h4>Vacancy not found</h4>
        <p className="text-muted">It may have closed or the link is incorrect.</p>
        <Link to="/vacancies" className="cc-vacancy-detail-back-btn">
          <FaChevronLeft />
          Back to Vacancies
        </Link>
      </Container>
    );
  }

  const attachments = vacancy.attachments ?? [];
  const closingDate = vacancy.closingDate ? new Date(vacancy.closingDate) : null;
  const isClosed = !!closingDate && closingDate.getTime() < Date.now();
  const isClosingSoon =
    !!closingDate && !isClosed && closingDate.getTime() - Date.now() < 1000 * 60 * 60 * 24 * 7;

  return (
    <article className="cc-vacancy-detail">
      <Container className="cc-vacancy-detail-body">
        <Link to="/vacancies" className="cc-vacancy-detail-back-link">
          <FaChevronLeft />
          Back to Vacancies
        </Link>

        <div className="cc-vacancy-detail-titlebar">
          <h1 className="cc-vacancy-detail-title">{vacancy.title}</h1>

          {closingDate && (
            <span
              className={`cc-vacancy-detail-closing ${
                isClosed
                  ? 'cc-vacancy-detail-closing--closed'
                  : isClosingSoon
                    ? 'cc-vacancy-detail-closing--urgent'
                    : ''
              }`}
            >
              <FaRegClock />
              {isClosed ? 'Closed on' : 'Closes'}{' '}
              {closingDate.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </div>

        <RichTextContent html={vacancy.description} className="cc-vacancy-detail-content" />

        {attachments.length > 0 && (
          <div className="cc-vacancy-downloads">
            {attachments.map((att) => (
              <a
                key={att.id}
                href={att.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="cc-vacancy-download-item"
              >
                <FaDownload />
                {att.label}
              </a>
            ))}
          </div>
        )}

        {vacancy.fileUrl && (
          <div className="cc-vacancy-detail-section">
            <h2 className="cc-vacancy-detail-section-title">Advertisement</h2>
            <PdfViewer url={vacancy.fileUrl} title="Vacancy advertisement" />
          </div>
        )}
      </Container>
    </article>
  );
}