import { Container, Row, Col } from "react-bootstrap";
import { JSX } from "react/jsx-runtime";
import "./Labs.scss";

// Swap these placeholders for real gallery photos in src/assets/
import galleryImg1 from "../../assets/labs/lab1.jpg";
import galleryImg2 from "../../assets/labs/lab2.jpg";
import galleryImg3 from "../../assets/labs/lab3.jpg";

interface LabSpec {
  label: string;
  value: string;
}

interface LabInfo {
  name: string;
  specs: LabSpec[];
}

const labs: LabInfo[] = [
  {
    name: "Lab 1",
    specs: [
      { label: "Platform", value: "Windows 11" },
      { label: "# Workstations", value: "60" },
      { label: "Projector/Screen", value: "Yes" },
      { label: "Audio", value: "No" },
      { label: "Internet", value: "Wi-Fi only" },
    ],
  },
  {
    name: "Lab 2",
    specs: [
      { label: "Platform", value: "Windows 10" },
      { label: "# Workstations", value: "40" },
      { label: "Projector/Screen", value: "No" },
      { label: "Audio", value: "No" },
      { label: "Internet", value: "Cable + Wi-Fi" },
    ],
  },
  {
    name: "Lab 3",
    specs: [
      { label: "Platform", value: "Windows 11" },
      { label: "# Workstations", value: "45" },
      { label: "Projector/Screen", value: "Yes" },
      { label: "Audio", value: "No" },
      { label: "Internet", value: "Cable + Wi-Fi" },
    ],
  },
];

const generalRules = [
  "No food or drink at computer workstations.",
  "No disruptive behavior.",
  "No moving the lab equipment and/or cables.",
  "No laptops on the wired network (exception: instructors for instructional purposes). It is okay to have laptops in the labs and be on the wireless network — they just can't be physically plugged into our jacks.",
  "No illegal copying of ANY materials.",
  "Keep sound levels to a minimum.",
  "The labs are for Engineering students, staff and faculty ONLY. We reserve the right to check IDs.",
];

const galleryImages = [
  { src: galleryImg1, alt: "Computing Centre lab workstations" },
  { src: galleryImg2, alt: "Computing Centre lab session" },
  { src: galleryImg3, alt: "Computing Centre lab equipment" },
];

export default function Labs(): JSX.Element {
  return (
    <Container className="cc-labs-content">
      <Row className="justify-content-center">
        <Col lg={9}>
          <h1 className="cc-section-title">Our Labs</h1>

          {/* Overview */}
          <section className="cc-labs-section">
            <h2 className="cc-labs-heading">Overview</h2>
            <p>
              There are three computer labs in the Computing Centre. These
              lab spaces are used for scheduled undergraduate classes,
              general drop-in/open-use for engineering students and the
              staff. Lab computers require logging on with an active CC ID
              &amp; password.
            </p>
          </section>

          {/* Open hours */}
          <section className="cc-labs-section">
            <h2 className="cc-labs-heading">Centre Open Hours</h2>
            <div className="cc-hours-card">
              <div className="cc-hours-row">
                <span className="cc-hours-label">Weekdays</span>
                <span className="cc-hours-value">8 AM – 4 PM</span>
              </div>
              <div className="cc-hours-row">
                <span className="cc-hours-label">After office / weekends / holidays</span>
                <span className="cc-hours-value">On request</span>
              </div>
            </div>
          </section>

          {/* General rules */}
          <section className="cc-labs-section">
            <h2 className="cc-labs-heading">General Use of Computer Labs</h2>
            <ul className="cc-labs-list">
              {generalRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>

            <div className="cc-labs-actions">
              <a
                href="https://eng.pdn.ac.lk/eeu/booking/Web/view-schedule.php?sid=10."
                target="_blank"
                rel="noreferrer"
                className="cc-labs-btn cc-labs-btn--outline"
              >
                Class Schedules
              </a>

              <a
                href="https://eng.pdn.ac.lk/cc/labreservations.html"
                target="_blank"
                rel="noreferrer"
                className="cc-labs-btn"
              >
                Lab Reservation
              </a>
            </div>
          </section>

          {/* Software requests */}
          <section className="cc-labs-section">
            <h2 className="cc-labs-heading">Request Software for a Computer Lab</h2>
            <p>
              Software requests must be made at least a week before the start
              of class. This gives us time to install and preliminarily test
              the software, and time for final usability checking.
            </p>
            <p>
              Please note that class-specific software will be removed prior
              to the beginning of each semester. This allows us to clean out
              old and possibly unused files and applications, and update only
              software that is known to be used — providing the most current
              version, which may be more stable and secure than previous
              versions.
            </p>
          </section>

          {/* Help */}
          <section className="cc-labs-section">
            <h2 className="cc-labs-heading">Need Help?</h2>
            <div className="cc-help-card">
              <a href="mailto:ccoffice@eng.pdn.ac.lk" className="cc-help-email">
                ccoffice@eng.pdn.ac.lk
              </a>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSf2J3nwXzuUuN4wktlYJhi2vdezpA7jplCe2Yd8qErZOR68SQ/viewform"
                target="_blank"
                rel="noreferrer"
                className="cc-labs-btn"
              >
                Open a Ticket
              </a>
            </div>
          </section>
        </Col>
      </Row>

      {/* Lab info cards */}
      <Row className="justify-content-center cc-labs-grid">
        {labs.map((lab) => (
          <Col md={6} lg={4} key={lab.name} className="mb-4">
            <div className="cc-lab-card">
              <h3 className="cc-lab-card-title">{lab.name}</h3>
              <p className="cc-lab-card-subtitle">{lab.name} Information</p>
              <ul className="cc-lab-specs">
                {lab.specs.map((spec) => (
                  <li key={spec.label}>
                    <span className="cc-lab-spec-label">{spec.label}</span>
                    <span className="cc-lab-spec-value">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        ))}
      </Row>

      {/* Gallery */}
      <Row className="justify-content-center">
        <Col lg={9}>
          <section className="cc-labs-section">
            <h2 className="cc-labs-heading">Gallery</h2>
            <div className="cc-gallery-grid">
              {galleryImages.map((img) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  className="cc-gallery-img"
                />
              ))}
            </div>
          </section>
        </Col>
      </Row>
    </Container>
  );
}