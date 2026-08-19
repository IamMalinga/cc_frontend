import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './app/store';
import App from './App';
import { initKeycloak, isAuthenticated, hasAdminRole } from './auth/keycloak';
import keycloak from './auth/keycloak';
import { setAuthenticated } from './auth/authSlice';
import './styles/theme.scss';

// Keycloak's silent SSO check needs to run once before the app mounts so we
// know up front whether the visitor already has a valid admin session
// (e.g. coming back from a previous login). The public site works fine
// even if this fails - it doesn't need auth at all.
initKeycloak()
  .then(() => {
    if (isAuthenticated() && hasAdminRole()) {
      store.dispatch(
        setAuthenticated({
          username: keycloak.tokenParsed?.preferred_username,
          name: keycloak.tokenParsed?.name,
          roles: keycloak.tokenParsed?.realm_access?.roles ?? [],
        })
      );
    }
  })
  .catch((err) => {
    console.error('Keycloak initialization failed', err);
  })
  .finally(() => {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element #root not found');
    }
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </React.StrictMode>
    );
  });
