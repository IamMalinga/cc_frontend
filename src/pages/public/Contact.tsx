import { Container, Row, Col, Card } from 'react-bootstrap';
import { useGetContactInfoQuery } from '../../api/publicApi';
import { JSX } from 'react/jsx-runtime';

export default function Contact(): JSX.Element {
  const { data: contact } = useGetContactInfoQuery();

  return (
    <Container className="py-5">
      <h1 className="cc-section-title">Contact Us</h1>
      <Row className="gy-4">
        <Col md={4}>
          <Card className="cc-card h-100 p-3">
            <h5 style={{ color: '#0d2d62' }}>Address</h5>
            <p className="mb-0">{contact?.address}</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="cc-card h-100 p-3">
            <h5 style={{ color: '#0d2d62' }}>Phone</h5>
            <p className="mb-0">{contact?.phone}</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="cc-card h-100 p-3">
            <h5 style={{ color: '#0d2d62' }}>Email</h5>
            <p className="mb-0">{contact?.email}</p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
