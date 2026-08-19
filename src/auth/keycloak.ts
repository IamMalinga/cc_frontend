import Keycloak from 'keycloak-js';

// These three values come from your Keycloak realm/client setup (see
// infra/keycloak/realm-export.json for a matching realm you can import).
// Override via a .env file (Vite exposes anything prefixed VITE_).
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8081',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'cc-cms',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'cc-cms-admin-frontend',
});

let initPromise: Promise<boolean> | null = null;

/**
 * Initializes the Keycloak adapter exactly once. Call this before rendering
 * the admin panel (see main.tsx). The public site never calls this — it only
 * hits /api/public/** which requires no auth.
 */
export function initKeycloak(): Promise<boolean> {
  if (!initPromise) {
    initPromise = keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    });
  }
  return initPromise;
}

export function login(): Promise<void> {
  return keycloak.login({ redirectUri: `${window.location.origin}/admin` });
}

export function logout(): Promise<void> {
  return keycloak.logout({ redirectUri: window.location.origin });
}

export function getToken(): string | undefined {
  return keycloak.token;
}

export function isAuthenticated(): boolean {
  return !!keycloak.authenticated;
}

export function hasAdminRole(): boolean {
  const roles: string[] = keycloak.tokenParsed?.realm_access?.roles ?? [];
  return roles.includes('ADMIN');
}

/** Ensures the token has more than ~30s left, refreshing it if needed. */
export async function ensureFreshToken(): Promise<string | undefined> {
  try {
    await keycloak.updateToken(30);
  } catch {
    // Refresh failed (session expired) - send the user back through login.
    login();
  }
  return keycloak.token;
}

export default keycloak;
