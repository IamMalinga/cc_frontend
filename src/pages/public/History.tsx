import { Container, Row, Col } from "react-bootstrap";
import { JSX } from "react/jsx-runtime";
import historyImg1 from "../../assets/history/history1.jpg";
import historyImg2 from "../../assets/history/history2.jpg";
import "./History.scss";

const milestones = [
  {
    year: "1971",
    text: "The University Computing Centre was established when the University acquired an IBM 1130 Computing System, serving the entire university community and key organisations across the country.",
  },
  {
    year: "1973",
    text: "The Computing Centre moved into a new four-storied building with a total floor area of about 1000 square meters, significantly enhancing its services.",
  },
];

export default function History(): JSX.Element {
  return (
    <>
      {/* Top image gallery */}


      <Container className="cc-history-content">
        <Row className="justify-content-center">
          <Col lg={9}>
            <h1 className="cc-section-title">Our History</h1>
                  <div className="cc-history-gallery">
        <img src={historyImg1} alt="Computing Centre building" className="cc-history-img cc-history-img--left" />
        <img src={historyImg2} alt="Computing Centre early operations" className="cc-history-img cc-history-img--right mb-3" />
      </div>

            <p className="cc-history-lede">
              The University Computing Centre was established in 1971.
            </p>

            <p>
              The University Computing Centre was established in 1971 when the University
              acquired an IBM 1130 Computing System. At that time this machine was serving
              the entire university community and most of the key organisations in the
              country.
            </p>

            <p>
              In 1973 the Computing Centre was moved to a new four-storied building with
              a total floor area of about 1000 square meters. This enhanced the services
              of the CC.
            </p>

            <p>
              At present, the computing centre of the Faculty of Engineering, University
              of Peradeniya provides a wide range of computing services to students and
              staff of the University of Peradeniya as well as to other institutions on
              request. It provides its users the whole spectrum of modern data
              processing from fast workstations and a powerful network up to special
              devices and high-performance computers.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center cc-history-timeline">
          <Col lg={9}>
            <div className="cc-timeline">
              {milestones.map((m) => (
                <div className="cc-timeline-item" key={m.year}>
                  <div className="cc-timeline-year">{m.year}</div>
                  <div className="cc-timeline-text">{m.text}</div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}