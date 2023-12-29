import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { Analytics } from '@vercel/analytics/react';

import './index.css';
import App from './App';

const client = new ApolloClient({
  uri: process.env.REACT_APP_SERVER_URL,
  cache: new InMemoryCache()
});

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <>
    <Auth0Provider
      domain='dev-4d6u7snvyprxooqo.us.auth0.com'
      clientId='XPGKdNsp1T9ZvwQ69a8G30aQYdhZ0aNT'
      redirectUri={`${window.location.origin}/dashboard`}
    >
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Auth0Provider>
    <Analytics />
  </>
);
