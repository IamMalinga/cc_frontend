import { useRef } from 'react';
import { Carousel, Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { serviceIcons } from "../../icons/serviceIcons";
import { FaCogs, FaChevronLeft, FaChevronRight, FaBullseye, FaEye } from "react-icons/fa";
import {
  useGetHeroSlidesQuery,
  useGetNewsHighlightsQuery,
  useGetLabsQuery,
  useGetServicesQuery,
  useGetContactInfoQuery,
} from '../../api/publicApi';
import { JSX } from 'react/jsx-runtime';
import { getMediaUrl } from '../../utils/mediaUrl';
import { FaRegCalendar } from 'react-icons/fa6';

// Strips HTML tags and decodes entities so card excerpts show plain text
// instead of raw markup (e.g. "<p><span style=...>Text</span></p>" -> "Text").
function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}

export default function Home(): JSX.Element {
  const { data: slides = [], isLoading: slidesLoading } = useGetHeroSlidesQuery();
  const { data: news = [] } = useGetNewsHighlightsQuery();
  const { data: labs = [] } = useGetLabsQuery();
  const { data: services = [] } = useGetServicesQuery();
  const { data: contact } = useGetContactInfoQuery();

  const newsScrollRef = useRef<HTMLDivElement>(null);

  const scrollNews = (direction: "left" | "right") => {
    const el = newsScrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <>
      {/* Hero */}
     {/* Hero */}
{slidesLoading ? (
  <div className="text-center py-5"><Spinner animation="border" style={{ color: '#0d2d62' }} /></div>
) : slides.length > 0 ? (
  <div className="cc-hero-wrapper">
    <Carousel indicators controls fade>
      {slides.map((slide) => (
        <Carousel.Item key={slide.id}>
          <div className="cc-hero" style={{ backgroundImage: `url(${getMediaUrl(slide.imageUrl)})` }}>
            <div className="cc-hero-shape cc-hero-shape--one" />
            <div className="cc-hero-shape cc-hero-shape--two" />
            <Container className="cc-hero-content">
              <h1 className="cc-hero-title">{slide.title}</h1>
              {slide.subtitle && <p className="cc-hero-subtitle">{slide.subtitle}</p>}
              <div className="cc-hero-actions">
                {slide.ctaText && slide.ctaUrl && (
                  <Link to={slide.ctaUrl} className="cc-hero-btn cc-hero-btn--primary">
                    {slide.ctaText}
                  </Link>
                )}
              </div>
            </Container>
            <div className="cc-hero-scroll-cue">
              <span />
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>

    {/* Floating stats strip */}
    <Container>
      <div className="cc-hero-stats">
        <div className="cc-hero-stat">
          <span className="cc-hero-stat-value">3</span>
          <span className="cc-hero-stat-label">Computer Labs</span>
        </div>
        <div className="cc-hero-stat-divider" />
        <div className="cc-hero-stat">
          <span className="cc-hero-stat-value">145+</span>
          <span className="cc-hero-stat-label">Workstations</span>
        </div>
        <div className="cc-hero-stat-divider" />
        <div className="cc-hero-stat">
          <span className="cc-hero-stat-value">1971</span>
          <span className="cc-hero-stat-label">Established</span>
        </div>
        <div className="cc-hero-stat-divider" />
        <div className="cc-hero-stat">
          <span className="cc-hero-stat-value">8AM–4PM</span>
          <span className="cc-hero-stat-label">Weekday Hours</span>
        </div>
      </div>
    </Container>
  </div>
) : null}

      {/* Mission / Vision */}
{/* Mission / Vision */}
<Container className="mission-section py-5">
  <div className="text-center mb-5">
    <span className="section-tag">OUR FOUNDATION</span>
    <h2 className="section-heading">Mission & Vision</h2>
    <p className="section-description">
      Empowering innovation, excellence, and lifelong learning through
      technology and collaboration.
    </p>
  </div>

  <Row className="g-4 mission-row">
    <Col lg={6}>
      <div className="mission-card h-100">
        <span className="mission-number">01</span>
        <FaBullseye className="mission-watermark" />

        <div className="mission-icon">
          <FaBullseye />
        </div>

        <h3>Our Mission</h3>
        <p>{contact?.mission}</p>
      </div>
    </Col>

    <Col lg={6}>
      <div className="mission-card h-100">
        <span className="mission-number">02</span>
        <FaEye className="mission-watermark" />

        <div className="mission-icon vision">
          <FaEye />
        </div>

        <h3>Our Vision</h3>
        <p>{contact?.vision}</p>
      </div>
    </Col>
  </Row>
</Container>

      {/* Services */}
      <section className="services-section">
        <Container>
          <div className="text-center mb-5">
            <span className="services-subtitle">WHAT WE PROVIDE</span>
            <h2 className="services-title">Professional IT Services</h2>
            <p className="services-description">
              Empowering students and researchers with modern
              computing infrastructure, software development,
              networking, cybersecurity and cloud technologies.
            </p>
          </div>
          <Row className="g-4">
            {services.map((service) => {
              const Icon =
                serviceIcons[service.icon?.toLowerCase() || ""] || FaCogs;
              return (
                <Col lg={3} md={6} key={service.id}>
                  <Card className="service-card border-0 h-100">
                    <Card.Body>
                      <div className="service-icon">
                        <Icon />
                      </div>
                      <h5>{service.title}</h5>
                      <p>{service.description}</p>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* Our Labs */}
      <section className="labs-section">
        <Container>
          <div className="text-center mb-5">
            <span className="section-tag">OUR FACILITIES</span>
            <h2 className="section-heading">Our Computer Laboratories</h2>
            <p className="section-description">
              Our laboratories provide modern computing facilities, high-speed
              internet, specialized software, and technical support for students,
              researchers, and academic staff.
            </p>
          </div>

          <div className="labs-grid">
            {labs.slice(0, 3).map((lab) => (
              <div
                className="lab-scroll-card"
                key={lab.id}
                style={{ backgroundImage: `url(${lab.imageUrl})` }}
              >
                <div className="lab-scroll-overlay" />

                <div className="lab-icon">
                  <i className="bi bi-pc-display"></i>
                </div>

                <div className="lab-content">
                  <h4>{lab.name}</h4>
                  <p>{lab.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/labs" className="labs-view-more-btn">
              View More About Labs
            </Link>
          </div>
        </Container>
      </section>

      {/* News Section - scrollable, max 6 */}
      {/* News Section - scrollable, max 6 */}
<section className="news-section py-5">
  <Container>
    <div className="text-center mb-5">
      <span className="section-tag">LATEST UPDATES</span>
      <h2 className="section-heading">News & Announcements</h2>
      <p className="section-description">
        Stay informed with the latest news, achievements, events, and
        announcements from the Computing Centre.
      </p>
    </div>

    {news.length === 0 ? (
      <div className="text-center py-5">
        <h5>No news available.</h5>
      </div>
    ) : (
      <>
        <div className="news-scroll-wrapper">
          <button
            type="button"
            className="news-scroll-btn news-scroll-btn--left"
            onClick={() => scrollNews("left")}
            aria-label="Scroll news left"
          >
            <FaChevronLeft />
          </button>

          <div className="news-scroll" ref={newsScrollRef}>
            {news.slice(0, 6).map((post) => {
              const excerpt = stripHtml(post.content);

              return (
                <Card className="news-card border-0" key={post.id}>
                  <div className="news-image-wrapper">
                    <Card.Img
                      src={getMediaUrl(post.imageUrl) ?? undefined}
                      className="news-image"
                    />
                    <div className="news-overlay" />
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
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>
                      {excerpt.length > 120
                        ? excerpt.slice(0, 120) + "..."
                        : excerpt}
                    </Card.Text>
                    <Link to={`/news/${post.id}`} className="news-link">
                      Read More →
                    </Link>
                  </Card.Body>
                </Card>
              );
            })}
          </div>

          <button
            type="button"
            className="news-scroll-btn news-scroll-btn--right"
            onClick={() => scrollNews("right")}
            aria-label="Scroll news right"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="text-center mt-5">
          <Link to="/news" className="news-view-all-btn">
            View All News
          </Link>
        </div>
      </>
    )}
  </Container>
</section>
    </>
  );
}