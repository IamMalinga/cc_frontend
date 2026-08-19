import { useEffect, useState, type ReactNode } from 'react';
import { Spinner, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import keycloak, { login } from '../../auth/keycloak';
import type { RootState } from '../../app/store';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Wraps <AdminLayout> (see App.tsx). If the visitor doesn't have a valid
 * Keycloak session with the ADMIN realm role, they're bounced straight to
 * the Keycloak login page - there is no in-app login form, Keycloak owns
 * authentication end-to-end (OAuth2/OIDC Authorization Code + PKCE flow).
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // main.tsx already ran keycloak.init() with onLoad: 'check-sso' before
    // the app mounted, so by the time this component renders, keycloak.authenticated
    // reflects the real session state.
    if (!isAuthenticated && !keycloak.authenticated) {
      login();
      return;
    }
    setChecked(true);
  }, [isAuthenticated]);

  if (!checked) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" style={{ color: '#0d2d62' }} />
      </Container>
    );
  }

  return <>{children}</>;
}
