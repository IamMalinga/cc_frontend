import { Container, Row, Col } from "react-bootstrap";
import { JSX } from "react/jsx-runtime";
import "./Policy.scss";

const generalRules = [
  "No food or drink at computer workstations.",
  "No moving the lab equipment and/or cables.",
  "No laptops on the wired network (exception: instructors for instructional purposes, granted permission for lab sessions).",
  "No disruptive behavior.",
  "Keep sound levels to a minimum.",
  "The labs are for Engineering students, staff and faculty ONLY. We reserve the right to check IDs.",
];

export default function Policy(): JSX.Element {
  return (
    <Container className="cc-policy-content">
      <Row className="justify-content-center">
        <Col lg={9}>
          <h1 className="cc-section-title">Policy &amp; Rules</h1>

          <p className="cc-policy-lede">
            Guidelines governing the use of the Computing Centre's facilities
            and computer laboratories.
          </p>

          <div className="cc-policy-card">
            <h2 className="cc-policy-card-title">General Use of Computer Labs</h2>

            <ul className="cc-policy-list">
              {generalRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
}