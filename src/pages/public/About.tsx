import { Container, Row, Col } from 'react-bootstrap';
import { useGetContactInfoQuery, useGetLabsQuery } from '../../api/publicApi';
import { JSX } from 'react/jsx-runtime';

export default function About(): JSX.Element {
  const { data: contact } = useGetContactInfoQuery();
  const { data: labs = [] } = useGetLabsQuery();

  return (
    <Container className="py-5">
      <h1 className="cc-section-title">About the Computing Centre</h1>
      <p style={{ maxWidth: 780 }}>
        Computing Centre provides the computing facility for the Undergraduate students as well as
        Postgraduate students and the staff of the Faculty of Engineering.
      </p>

      <Row className="gy-4 mt-4">
        <Col md={6}>
          <h2 className="cc-section-title">Mission</h2>
          <p>{contact?.mission}</p>
        </Col>
        <Col md={6}>
          <h2 className="cc-section-title">Vision</h2>
          <p>{contact?.vision}</p>
        </Col>
      </Row>

      <h2 className="cc-section-title mt-5">Our Labs</h2>
      <Row className="gy-3">
        {labs.map((lab) => (
          <Col md={4} key={lab.id}>
            <div className="cc-card p-3 h-100">
              <h5 style={{ color: '#0d2d62' }}>{lab.name}</h5>
              <p className="small text-muted mb-0">{lab.description}</p>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
