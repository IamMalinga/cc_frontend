import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { JSX } from 'react/jsx-runtime';

export default function NotFound(): JSX.Element {
  return (
    <Container className="py-5 text-center">
      <h1 style={{ color: '#0d2d62' }}>404</h1>
      <p>Page not found.</p>
      <Link to="/">Go back home</Link>
    </Container>
  );
}
