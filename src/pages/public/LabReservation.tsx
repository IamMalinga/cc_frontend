import { Container, Row, Col } from "react-bootstrap";
import { JSX } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import "./LabReservation.scss";

export default function LabReservation(): JSX.Element {
  return (
    <Container className="cc-labres-content">
      <Row className="justify-content-center">
        <Col lg={9}>
          <h1 className="cc-section-title">Lab Reservation</h1>

          {/* Important notice */}
          <div className="cc-notice-card">
            <div className="cc-notice-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              </svg>
            </div>
            <div className="cc-notice-body">
              <h2 className="cc-notice-title">Important Notice</h2>
              <a
                href="https://script.google.com/macros/s/AKfycbxuINFGameclxQWzYd-nBx445hmA870c61mgichaeXx_9ua8Ugyz7kfrqk-kfOB_gvp/exec"
                target="_blank"
                rel="noreferrer"
                className="cc-notice-link"
              >
                Check Lab Availability
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </a>
            </div>
          </div>

          {/* Action cards */}
          <Row className="cc-labres-actions">
            <Col md={6} className="mb-4">
              <Link to="/labs" className="cc-action-card">
                <div className="cc-action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="12" rx="2" />
                    <path d="M2 20h20M8 20l1-4M16 20l-1-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="cc-action-title">Overview of the Labs</h3>
                  <p className="cc-action-text">
                    See platform, capacity, and equipment details for each lab.
                  </p>
                </div>
                <svg className="cc-action-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            </Col>

            <Col md={6} className="mb-4">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSedU_mdBo9eMoDjZYPU2NU0XlEeb1hLFRSkM0UqEgrncDXS7Q/viewform"
                target="_blank"
                rel="noreferrer"
                className="cc-action-card cc-action-card--primary"
              >
                <div className="cc-action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <path d="M14 2v6h6" />
                    <path d="M9 15h6M9 11h6M9 19h3" />
                  </svg>
                </div>
                <div>
                  <h3 className="cc-action-title">Lab Reservation Form</h3>
                  <p className="cc-action-text">
                    Submit a request to book a lab for your class or event.
                  </p>
                </div>
                <svg className="cc-action-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </a>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}