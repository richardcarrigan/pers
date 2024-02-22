import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { Analytics } from '@vercel/analytics/react';

import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

const client = new ApolloClient({
  uri: process.env.REACT_APP_SERVER_URL,
  cache: new InMemoryCache({
    typePolicies: {
      Account: {
        fields: {
          transactions: {
            merge(_, incoming) {
              return incoming;
            }
          }
        }
      },
      Query: {
        fields: {
          accounts: {
            merge(_, incoming) {
              return incoming;
            }
          }
        }
      }
    }
  })
});

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <>
    <Auth0Provider
      domain='dev-4d6u7snvyprxooqo.us.auth0.com'
      clientId='XPGKdNsp1T9ZvwQ69a8G30aQYdhZ0aNT'
      redirectUri={`${window.location.origin}/accounts`}
    >
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Auth0Provider>
    <Analytics />
  </>
);
