import { Container, Row, Col } from "react-bootstrap";
import { JSX } from "react/jsx-runtime";
import "./GuestWifi.scss";

export default function GuestWifi(): JSX.Element {
  return (
    <Container className="cc-wifi-content">
      <Row className="justify-content-center">
        <Col lg={9}>
          <h1 className="cc-section-title">Guest Wi-Fi Access</h1>

          <p className="cc-wifi-lede">
            Short-Term Visitor Wi-Fi Access Request
          </p>

          <p>
            The Faculty of Engineering provides a Guest Wi-Fi service to
            offer short-term internet access for visitors attending
            university-related events, meetings, or collaborations.
          </p>

          <p>
            University officials can submit a request on behalf of their
            guests. Once reviewed and approved, this facility will provide
            the necessary credentials to connect with the Guest Wi-Fi.
          </p>

          <div className="cc-wifi-card">
            <div className="cc-wifi-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <path d="M12 20h.01" />
              </svg>
            </div>

            <div className="cc-wifi-card-body">
              <h2 className="cc-wifi-card-title">Request Guest Wi-Fi Access</h2>
              <p className="cc-wifi-card-text">
                Fill out the Guest Wi-Fi request form to submit an access
                request on behalf of your visitor.
              </p>

              
              <a
                href="https://forms.gle/jRS5mohfL2FYptdq9"
                target="_blank"
                rel="noreferrer"
                className="cc-wifi-btn"
              >
                Open Request Form
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}